import tailwindcss from "@tailwindcss/vite";
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'

// https://vite.dev/config/




export default defineConfig({
  plugins: [svelte(), tailwindcss(),],
  base: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: 'index.html',
        // background: 'src/background.js', // If needed
      }
    }
  }
})
