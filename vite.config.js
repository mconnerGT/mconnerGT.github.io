import { defineConfig } from "vite";

export default defineConfig({
    base: "mconnerGT.github.io",
    build: {
        outDir: "dist",
        assetsDir: "assets",
        rollupOptions: {
            output: {
                entryFileNames: "assets/index.js",
                chunkFileNames: "assets/[name].js",
                assetFileNames: "assets/[name].[ext]"
            }
        }
    }
});
