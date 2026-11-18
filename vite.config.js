import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"

const root = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 3847,
    strictPort: true,
    allowedHosts: true,
  },
  preview: {
    host: "0.0.0.0",
    port: 3847,
    strictPort: true,
    allowedHosts: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        about: resolve(root, "about.html"),
        amenities: resolve(root, "amenities.html"),
        events: resolve(root, "events.html"),
        contact: resolve(root, "contact.html"),
        membership: resolve(root, "membership.html"),
      },
    },
  },
})
