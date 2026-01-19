import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
	plugins: [
		vue(),
		dts({
			insertTypesEntry: true,
			include: ['src/**/*.ts', 'src/**/*.vue'],
			exclude: ['**/*.test.ts'],
		}),
	],
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'VueGitStats',
			fileName: (format) => `vue-git-stats.${format}.js`,
		},
		rollupOptions: {
			// Only externalize Vue, NOT core (core should be bundled)
			external: ['vue'],
			output: {
				globals: {
					vue: 'Vue',
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