import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	base: "/",
	resolve: {
		alias: {
			"@": path.join(__dirname, "./src"),
		},
	},
	esbuild: {
		target: "es2020",
	},
});
