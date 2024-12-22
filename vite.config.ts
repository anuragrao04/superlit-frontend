import path from "path";
import { defineConfig } from 'vite';
import dotenv from 'dotenv';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default ({ mode }: any) => {
  dotenv.config();
  const config = {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: process.env.BACKEND_URL,
          changeOrigin: true,
        },
      },
    },
  };
  return defineConfig(config);
};

