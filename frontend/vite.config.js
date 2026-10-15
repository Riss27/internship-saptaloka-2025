import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // Pecah library besar ke chunk sendiri agar bundle awal lebih kecil
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("@tiptap")) return "tiptap";
          if (/framer-motion|motion-dom|motion-utils/.test(id)) return "motion";
          if (/\/react-dom\/|\/react\/|scheduler\//.test(id)) return "react";
          if (/react-router/.test(id)) return "router";
          if (/i18next|react-i18next/.test(id)) return "i18n";
          if (/react-icons|lucide-react|@fortawesome/.test(id)) return "icons";
          if (/axios/.test(id)) return "axios";
        },
      },
    },
  },
})
