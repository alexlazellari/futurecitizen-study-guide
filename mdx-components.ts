import type { MDXComponents } from "nextra/mdx-components";
import { useMDXComponents as getDocsMDXComponents } from "nextra-theme-docs";
import { StudyFigure } from "./components/study-guide/StudyFigure";

export function useMDXComponents(components: MDXComponents) {
  return getDocsMDXComponents({
    ...components,
    StudyFigure,
  } as MDXComponents);
}
