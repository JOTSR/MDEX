import renderSSR from 'preact-render-to-string'
import { expandGlobSync } from '@std/fs/mod.ts'
import { compiler } from './compile.ts'
import { Command } from 'cliffy'

export async function renderer(
	{ input, output, template, config }: {
		input: string
		output?: string
		template: string
		config?: string
	},
): Promise<string> {
	const { Template } = await import(template)
	const { default: MdxContent } = await import(
		`data:text/jsx,${encodeURIComponent(await compiler({ input, config }))}`
	)
	const html = renderSSR(
		Template({ children: MdxContent(), title: 'main' }),
	)

	if (output !== undefined) {
		await Deno.writeTextFile(
			output,
			html,
		)
	}
	return html
}

async function renderAction(
	{ input, output, template, config }: {
		input: string
		output?: true | string
		template: string
		config?: string
	},
) {
	const html = await renderer({
		input,
		output: output === true ? input.replace('.mdx', '.tsx') : output,
		template,
		config,
	})
	if (output === undefined) {
		console.log(html)
	}
}

export const render = new Command()
	.name('render')
	.version('0.1.0')
	.description('Render MDX file into html document')
	.example('render to console', 'mdex render main.mdx')
	.example('render to file', 'mdex render main.mdx -o main.html')
	.example(
		'render and watch all .mdx file in current directory',
		'mdex render main.mdx -o main.html -w',
	)
	.example(
		'render and watch specific paths',
		'mdex render main.mdx -o main.html -w ./src/*.(mdx|svg|png)',
	)
	.example(
		'render with custom template (named export Template = ({ children: JSX.Element, title: string }) => JSX.Element',
		'mdex render main.mdx -t ./custom_template.tsx',
	)
	.example(
		'compile custom config (export const compileOptions: mdx.CompileOptions = {})',
		'mdex render main.mdx -c ./config.ts',
	)
	.option('-w, --watch [globExp]', 'Watch files')
	.option('-o, --output [path:file]', 'Output file')
	.option('-t, --template <path:file>', 'Template to embed mdx file', {
		default: import.meta.resolve('../template/readme.tsx'),
	})
	.option('-c, --config <path:file>', 'Compiler config file')
	.arguments('<input:file>')
	.action(async ({ watch, output, template, config }, input) => {
		if (watch) {
			const paths = Array.from(
				expandGlobSync(watch === true ? '*.mdx' : watch),
			).map(({ path }) => path)
			const watcher = Deno.watchFs(
				paths,
			)
			console.log(
				`%c[watching] %c${paths.join(', ')}`,
				'color: #0055ef; font-weight: bold',
				'color: white; font-weight: normal',
			)
			for await (const event of watcher) {
				if (event.kind === 'access') continue
				console.log(
					`%c[update] %c${event.paths.join(', ')}`,
					'color: #0055ef; font-weight: bold',
					'color: white; font-weight: normal',
				)
				console.log(
					`%c[rendering] %c${input} => ${output}`,
					'color: #00ac55; font-weight: bold',
					'color: white; font-weight: normal',
				)
				await renderAction({ input, output, template })
			}
			return
		}
		await renderAction({ input, output, template, config })
	})
