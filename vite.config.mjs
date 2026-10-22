import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import {execFileSync} from "node:child_process";
import {resolve} from "node:path";

export default defineConfig({
  build: {
    outDir: "dist/client",
  },
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    host: "0.0.0.0",
    watch: {usePolling:true, interval:300},
    allowedHosts: ["terminal.local"],
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  plugins: [react(), {name:"markdown-refresh", configureServer(server){
    const folder=resolve("content");server.watcher.add(folder);
    server.watcher.on("all",(event,file)=>{if(file.startsWith(folder)&&file.endsWith(".md")){try{execFileSync(process.execPath,["scripts/prepare-content.mjs"]);server.ws.send({type:"full-reload"});}catch(error){server.config.logger.error(error.message);}}});
  }}],
});
