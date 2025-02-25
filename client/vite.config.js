import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
	plugins: [react()],
	base: '/', // Asegura que la base path esté configurada correctamente para el enrutamiento
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
})
