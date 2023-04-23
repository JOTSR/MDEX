import { CSS, KATEX_CSS } from 'https://deno.land/x/gfm@0.2.1/mod.ts'
import { JSX } from 'preact/jsx-runtime'
//@ts-ignore ejm default export
import hljsCss from '@ejsm/highlight.js@11.7.0/styles/github.min.css' assert {
	type: 'json',
}
//@ts-ignore ejm default export
import hljsDarkCss from '@ejsm/highlight.js@11.7.0/styles/github-dark.min.css' assert {
	type: 'json',
}

export function Template(
	{ children, title }: { children: JSX.Element; title: string },
) {
	return (
		<html>
			<head>
				<title>{title}</title>
				<meta charSet='UTF-8' />
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1.0'
				/>
				<style>
					{/*css*/ `
                    @media (prefers-color-scheme: dark) {
                        body {
                            background-color: #0D1117;
                            color: #e6edf3;
                        }
                    }
                    main {
                        max-width: 800px;
                        margin: 0 auto;
                        width: 100%;
                        background-color: initial;
                        padding: 2rem;
                        border-radius: 7px;
                    }
                    
                    @media (min-width: 900px) {
                        main {
                            border: 1px solid rgba(127, 127, 127, 0.2);
                        }
                    }

                    a {
                        text-decoration: none;
                        color: #2f81f7;
                    }

                    a:hover,
                    a:active {
                        text-decoration: underline;
                    }

                    .katex-html {
                        display: none;
                    }

                    ${hljsCss.text}
                    @media (prefers-color-scheme: dark) {
                        ${hljsDarkCss.text}
                    }
                `}
				</style>
				<style>{CSS}{KATEX_CSS}</style>
			</head>
			<body>
				<main
					data-color-mode='auto'
					data-light-theme='light'
					data-dark-theme='dark'
					class='markdown-body'
				>
					{children}
				</main>
			</body>
		</html>
	)
}
