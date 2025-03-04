import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import AutoImport from "unplugin-auto-import/vite";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    AutoImport({
      imports: [
        "react", // 自动导入React相关API
      ],
      dts: "./auto-imports.d.ts", // 生成类型声明文件
      eslintrc: {
        enabled: true, // 生成eslint配置
      },
    }),
  ],
});
