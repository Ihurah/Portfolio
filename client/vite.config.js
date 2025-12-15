import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        // disable CSS code splitting so CSS is emitted as a single file
        cssCodeSplit: false,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html')
            },
            output: {
                // force output filenames
                entryFileNames: 'assets/script.js',
                chunkFileNames: 'assets/script.js',
                assetFileNames: function (assetInfo) {
                    if (assetInfo && assetInfo.name && assetInfo.name.endsWith('.css')) {
                        return 'assets/style.css';
                    }
                    return 'assets/[name][extname]';
                },
                // Inline dynamic imports so Rollup produces a single JS bundle
                inlineDynamicImports: true
            }
        }
    }
});
