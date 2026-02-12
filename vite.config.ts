import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import seoPrerender from 'vite-plugin-seo-prerender';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
      seoPrerender({
        routes: [
          '/',
          '/blog',
          '/blog/ppr-2026-guia',
          '/blog/guia-irs-2026',
          '/blog/literacia-financeira-portugal',
          '/blog/mercados-emergentes-2026',
          '/blog/como-criar-orcamento-pessoal',
          '/blog/fundo-emergencia-quanto-poupar',
          '/privacy',
          '/terms',
        ],
        delay: 3000,
        network: true,
        removeStyle: false,
      })
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
