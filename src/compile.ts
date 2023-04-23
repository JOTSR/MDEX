import { compile as compileMdx } from '@esm/@mdx-js/mdx@2.3.0'
import { Command } from 'cliffy'
import { expandGlobSync } from '@std/fs/mod.ts'
import { compileOptions } from './compile_options.ts'

export async function compiler(
	{ input, output, config }: {
		input: string
		output?: string
		config?: string
	},
): Promise<string> {
	const mdx = await Deno.readTextFile(input)
	const jsx = await compileMdx(mdx, {
		...compileOptions,
		...(config !== undefined ? (await import(config)).compileOptions : {}),
	})
	if (output !== undefined) {
		await Deno.writeTextFile(output, jsx.value)
	}
	return jsx.value
}

async function compileAction(
	{ input, output, config }: {
		input: string
		output?: true | string
		config?: string
	},
) {
	const html = await compiler({
		input,
		output: output === true ? input.replace('.mdx', '.tsx') : output,
		config,
	})
	if (output === undefined) {
		console.log(html)
	}
}

export const compile = new Command()
	.name('compile')
	.version('0.1.0')
	.description('Compile MDX file into jsx')
	.example('compile to console', 'mdex compile main.mdx')
	.example('compile to file', 'mdex compile main.mdx -o main.jsx')
	.example(
		'compile and watch all .mdx file in current directory',
		'mdex compile main.mdx -o main.jsx -w',
	)
	.example(
		'compile and watch specific paths',
		'mdex compile main.mdx -o main.jsx -w ./src/*.(mdx|svg|png)',
	)
	.example(
		'compile custom config (export const compileOptions: mdx.CompileOptions = {})',
		'mdex compile main.mdx -c ./config.ts',
	)
	.option('-w, --watch [globExp]', 'Watch files')
	.option('-o, --output [path:file]', 'Output file')
	.option('-c, --config <path:file>', 'Compiler config file')
	.arguments('<input:file>')
	.action(async ({ watch, output, config }, input) => {
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
					`%c[compiling] %c${input} => ${output}`,
					'color: #00ac55; font-weight: bold',
					'color: white; font-weight: normal',
				)
				await compileAction({ input, output, config })
			}
			return
		}
		await compileAction({ input, output, config })
	})
