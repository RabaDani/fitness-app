import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
	plugins: [preact()],
	base: mode === 'production' ? '/fitness-app/' : '/',
	build: {
		outDir: 'dist',
		assetsDir: 'assets',
		sourcemap: false
	}
}));
