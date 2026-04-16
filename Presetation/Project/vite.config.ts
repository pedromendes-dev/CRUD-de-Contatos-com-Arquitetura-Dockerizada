import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/Contatos': {
        target: 'https://localhost:8081',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
