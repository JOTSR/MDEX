export { compile } from './src/compile.ts'
export { render } from './src/render.ts'

import { Command, DenoLandProvider, UpgradeCommand } from 'cliffy'
import { compile } from './src/compile.ts'
import { render } from './src/render.ts'

if (import.meta.main) {
	const cli = new Command()
		.name('mdex')
		.version('0.1.2')
		.description('Compile and render MDX file from Deno')
		.command('compile', compile)
		.command('render', render)
		.command(
			'upgrade',
			new UpgradeCommand({
				main: 'mod.ts',
				provider: new DenoLandProvider(),
				args: [
					'--allow-read',
					'--allow-write',
					'--allow-net',
					'-r',
					'-q',
					'-f',
					'--no-check',
					'-n mdex',
				],
				importMap: 'import_map.json',
			}),
		)

	if (Deno.args.length === 0) {
		cli.showHelp()
	}

	await cli.parse(Deno.args)
}
