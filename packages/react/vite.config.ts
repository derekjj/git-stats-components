import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
	plugins: [
		react(),
		dts({
			insertTypesEntry: true,
			include: ['src/**/*.ts', 'src/**/*.tsx'],
			exclude: ['**/*.test.ts', '**/*.test.tsx'],
		}),
	],
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'GitStatsReact',
			fileName: (format) => `react.${format}.js`,
		},
		rollupOptions: {
			// Only externalize React/ReactDOM, NOT core (core should be bundled)
			external: ['react', 'react-dom'],
			output: {
				globals: {
					react: 'React',
					'react-dom': 'ReactDOM',
				},
				assetFileNames: (assetInfo) => {
					if (assetInfo.name === 'style.css') return 'style.css'
					return assetInfo.name || 'asset'
				},
			},
		},
		sourcemap: true,
		target: 'es2015',
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
			// Resolve core to source during build
			'@git-stats-components/core': resolve(__dirname, '../core/src'),
		},
	},
})