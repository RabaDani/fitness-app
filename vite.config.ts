import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
	plugins: [
		preact(),
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: ['logo.png', 'logo192.png', 'logo512.png'],
			manifest: {
				name: 'TheBestOfYou - Fitness App',
				short_name: 'TheBestOfYou',
				description: 'Calorie and nutrition tracking app with exercise diary and weight logging',
				theme_color: '#4f46e5',
				background_color: '#ffffff',
				display: 'standalone',
				orientation: 'portrait-primary',
				icons: [
					{
						src: 'logo192.png',
						sizes: '192x192',
						type: 'image/png',
						purpose: 'any maskable'
					},
					{
						src: 'logo512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable'
					}
				]
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,json}'],
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/api\.spoonacular\.com\/.*/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'spoonacular-api-cache',
							expiration: {
								maxEntries: 500,
								maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
							},
							cacheableResponse: {
								statuses: [0, 200]
							}
						}
					},
					{
						urlPattern: /^https:\/\/spoonacular\.com\/cdn\/.*/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'spoonacular-images-cache',
							expiration: {
								maxEntries: 100,
								maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
							},
							cacheableResponse: {
								statuses: [0, 200]
							}
						}
					}
				]
			},
			devOptions: {
				enabled: true,
				type: 'module'
			}
		})
	],
	base: '/',
	build: {
		outDir: 'dist',
		assetsDir: 'assets',
		sourcemap: false
	}
}));
