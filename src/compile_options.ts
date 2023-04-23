import remarkGfm from '@esm/remark-gfm@3.0.1' // Tables, footnotes, strikethrough, task lists, literal URLs.
import remarkFrontmatter from '@esm/remark-frontmatter@4.0.1' // YAML and such.
import remarkMath from '@esm/remark-math@5.1.1' // Support math like `$so$`.
import rehypeKatex from '@esm/rehype-katex@6.0.3' // Render math with KaTeX.
// import rehypePrisme from 'npm:@mapbox/rehype-prism'
import rehypeHighlight from '@esm/rehype-highlight@6.0.0'

export const compileOptions = {
	remarkPlugins: [
		remarkGfm,
		remarkMath,
		remarkFrontmatter,
	],
	rehypePlugins: [rehypeKatex, rehypeHighlight],
	jsxImportSource: 'preact',
	jsx: true,
}
