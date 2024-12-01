import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // https://stackoverflow.com/questions/66043612/vue3-vite-project-alias-src-to-not-working
  // 设置./src为@
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("src", import.meta.url)),
      },
    ],
  },
});
