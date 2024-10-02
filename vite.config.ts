import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';
import jsconfigPaths from 'vite-jsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), jsconfigPaths()],
});
