import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:5000', // 👈 your backend server
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //   },
  // },
});
