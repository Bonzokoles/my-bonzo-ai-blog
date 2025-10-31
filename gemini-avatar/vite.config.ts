import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [react()],
    base: '/gemini-avatar/',
    build: {
        outDir: 'dist',
        emptyOutDir: true,
    }
})
