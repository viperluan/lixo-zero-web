import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const src = (...segments: string[]) => path.resolve(__dirname, './src', ...segments);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Array em vez de objeto porque o alias do moment precisa casar exatamente:
    // com match por prefixo, `moment/locale/pt-br` tambem seria reescrito.
    alias: [
      { find: '~api', replacement: src('api') },
      { find: '~assets', replacement: src('assets') },
      { find: '~components', replacement: src('components') },
      { find: '~context', replacement: src('context') },
      { find: '~layouts', replacement: src('layouts') },
      { find: '~views', replacement: src('views') },
      { find: '~', replacement: src() },
      // O arquivo de locale do moment e UMD e resolve o proprio moment por
      // caminho relativo (`../moment`). Fixando o import bare no mesmo arquivo,
      // app e locale compartilham uma unica instancia — senao o pre-bundling
      // registra o pt-br numa copia paralela e o calendario sai em ingles.
      { find: /^moment$/, replacement: path.resolve(__dirname, './node_modules/moment/moment.js') },
    ],
  },
  build: {
    rollupOptions: {
      output: {
        // moment + react-big-calendar + react-datetime respondem pela maior
        // fatia do bundle e so aparecem na agenda e no cadastro de acao. Isolar
        // esses vendors evita reenviar tudo a cada deploy e deixa o chunk do
        // app pequeno o bastante para ser revalidado sozinho.
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          calendar: ['moment', 'react-big-calendar', 'react-datetime'],
          forms: ['formik', 'yup', 'react-input-mask'],
        },
      },
    },
  },
});
