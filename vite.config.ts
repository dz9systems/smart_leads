// vite.config.ts (in project root)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // ✅ This is what you're missing
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default defineConfig({
  root: path.resolve(__dirname, 'client'),
  build: {
    outDir: path.resolve(__dirname, 'public'),
    emptyOutDir: true
  },
  plugins: [react()],
  server: {
    port: 5173
  }
});
