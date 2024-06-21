import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import basicSsl from '@vitejs/plugin-basic-ssl';


// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': process.env,
  },
  assetsInclude: ['**/*.md'],
  plugins: [
    // basicSsl({
    //   /** name of certification */
    //   name: 'test',
    //   /** custom trust domains */
    //   domains: ['*.custom.com'],
    //   /** custom certification directory */
    //   certDir: '/Users/.../.devServer/cert'
    // }),
    basicSsl(),
    react(), eslint({ fix: true })],
  base: '',
  server: {
    port: 1337,
    host: '0.0.0.0',
    https: true,
  },
});
