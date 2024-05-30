import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: "/src",
      assets: "/src/assets",
      data: "/src/data",
      components: "/src/components",
      layouts: "/src/components/layouts",
      pages: "/src/pages",
      types: "/src/types",
      services: "/src/services",
      features: "/src/features",
    },
  },
})
