/**
 * Re-encodes the images under public/ at sane web quality.
 *
 * Why this exists as a script rather than a one-off: the images were compressed
 * by hand once (see 0f3b58e, "compress all images offline 22MB->200KB avg"),
 * because the Vercel image optimizer cannot be reached through the multi-zone
 * proxy with a basePath, so `images.unoptimized` is on and nothing resizes
 * images at request time. With no tooling in the repo that hand-pass drifted —
 * by the time anyone looked again the average was 283KB, two files were over
 * 1MB, and one content page shipped 2.5MB of images. A committed script means
 * the next person adding an image can re-run it instead of guessing.
 *
 * Dimensions are already correct (everything is capped at 1200px, which suits
 * the content column) so this only touches encoding quality. Nothing is
 * resized, so no layout can shift.
 *
 *   node scripts/compress-images.mjs            # dry run, writes nothing
 *   node scripts/compress-images.mjs --execute  # rewrites files in place
 *
 * Originals are recoverable with `git checkout -- public` — re-encoding is
 * lossy and cannot be undone from the output.
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const PUBLIC_DIR = "public";
const JPEG_QUALITY = 80;
const PNG_QUALITY = 80;

/**
 * Below this, the win is a rounding error and the only effect is diff noise on
 * a binary file. The four flag PNGs (24KB and under) live here.
 */
const MIN_SIZE_BYTES = 50 * 1024;

/**
 * Only rewrite when the result is a real improvement. This is also what makes
 * the script safe to re-run: a second pass over an already-compressed file
 * produces roughly the same size, fails this test, and is skipped — so
 * repeated runs cannot quietly degrade the images by re-encoding them over
 * and over.
 */
const MIN_GAIN_RATIO = 0.85;

/**
 * PNGs that are photographs, and should become JPEGs. An explicit list rather
 * than a heuristic: getting this wrong on line art or anything with
 * transparency is very visible, so it should be a reviewed decision per file.
 *
 * Deliberately NOT included:
 *   images/error-illustration.png — line art with hard edges (JPEG would ring
 *     around every line) and an alpha channel that JPEG cannot carry at all.
 *   united-kingdom-map.png, and the flags — flat graphics; PNG is the right
 *     format and palette quantisation handles them.
 */
const PNG_TO_JPEG = new Set(["public/house-of-commons.png"]);

const execute = process.argv.includes("--execute");

function listImages(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listImages(full));
    else if (/\.(jpe?g|png)$/i.test(entry.name)) out.push(full);
  }
  return out;
}

const key = (p) => p.split(path.sep).join("/");
const kb = (bytes) => (bytes / 1024).toFixed(0).padStart(5);

async function encode(file) {
  // Read to a buffer first: the output may overwrite this same path, and sharp
  // reads lazily from disk otherwise.
  const input = fs.readFileSync(file);
  const meta = await sharp(input).metadata();

  // .rotate() with no argument bakes in EXIF orientation. Without it, stripping
  // metadata (which sharp does by default) would visually rotate any image that
  // was relying on an EXIF orientation flag to display correctly.
  const pipeline = sharp(input).rotate();

  const toJpeg =
    /\.jpe?g$/i.test(file) || PNG_TO_JPEG.has(key(file));

  if (toJpeg) {
    if (meta.hasAlpha) {
      // JPEG has no alpha; flattening would silently paint a background in.
      return { skip: "has alpha, refusing to convert to JPEG" };
    }
    return {
      buffer: await pipeline
        .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
        .toBuffer(),
      outPath: file.replace(/\.png$/i, ".jpg"),
      meta,
    };
  }

  // PNG: lossy palette quantisation. This is what shrinks flat graphics and
  // line art hard, and it preserves the alpha channel.
  return {
    buffer: await pipeline
      .png({ palette: true, quality: PNG_QUALITY, effort: 10 })
      .toBuffer(),
    outPath: file,
    meta,
  };
}

const files = listImages(PUBLIC_DIR).sort(
  (a, b) => fs.statSync(b).size - fs.statSync(a).size,
);

console.log(
  execute
    ? "REWRITING FILES IN PLACE (originals in git)\n"
    : "DRY RUN — nothing will be written. Pass --execute to apply.\n",
);
console.log(
  "  BEFORE   AFTER   SAVED  DIMENSIONS   FILE                                    NOTE",
);

let totalBefore = 0;
let totalAfter = 0;
const renames = [];
const skipped = [];

for (const file of files) {
  const before = fs.statSync(file).size;
  totalBefore += before;

  if (before < MIN_SIZE_BYTES) {
    totalAfter += before;
    skipped.push(`${key(file)} (under ${MIN_SIZE_BYTES / 1024}KB)`);
    continue;
  }

  const result = await encode(file);
  if (result.skip) {
    totalAfter += before;
    skipped.push(`${key(file)} (${result.skip})`);
    continue;
  }

  const after = result.buffer.length;
  const renamed = result.outPath !== file;

  if (after >= before * MIN_GAIN_RATIO && !renamed) {
    totalAfter += before;
    skipped.push(`${key(file)} (already compressed — no meaningful gain)`);
    continue;
  }

  totalAfter += after;
  const dims = `${result.meta.width}x${result.meta.height}`;
  const note = renamed ? `-> ${path.basename(result.outPath)}` : "";
  console.log(
    `${kb(before)}KB ${kb(after)}KB   ${String(
      Math.round((1 - after / before) * 100),
    ).padStart(3)}%  ${dims.padEnd(12)} ${key(file).padEnd(40)}${note}`,
  );

  if (execute) {
    fs.writeFileSync(result.outPath, result.buffer);
    if (renamed) {
      fs.unlinkSync(file);
      renames.push([key(file), key(result.outPath)]);
    }
  } else if (renamed) {
    renames.push([key(file), key(result.outPath)]);
  }
}

console.log(
  `\nTOTAL  ${(totalBefore / 1048576).toFixed(1)}MB -> ${(
    totalAfter / 1048576
  ).toFixed(1)}MB  (${Math.round((1 - totalAfter / totalBefore) * 100)}% smaller)`,
);

if (renames.length) {
  console.log("\nRenamed — these src references must be updated:");
  for (const [from, to] of renames) console.log(`  ${from} -> ${to}`);
}

if (skipped.length) {
  console.log(`\nSkipped ${skipped.length}:`);
  for (const s of skipped) console.log(`  ${s}`);
}
