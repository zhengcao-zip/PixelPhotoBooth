import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    // Base "./" ensures assets are linked relatively, fixing broken paths on GitHub Pages
    base: './', 
    define: {
      // Stringify the API key so it's injected into the build
      // NOTE: For public GitHub Pages, you must be careful about exposing API keys.
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});