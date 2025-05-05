import { defineConfig } from "vite";

export default defineConfig({
    base: "/",
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
