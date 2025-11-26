import type { AstroIntegration } from "astro";
import { Logger } from "../logger";

export default function createConfigInitializerIntegration(): AstroIntegration {
  return {
    name: "Volantis-GO",
    hooks: {
      "astro:config:setup": ({ updateConfig }) => {
        // 注入一个自定义 Vite 插件
        updateConfig({
          vite: {
            plugins: [
              {
                name: "volantis-config-loader",
                // 这个钩子在 Vite 开发服务器启动时调用
                configureServer(server) {
                  Logger.info("Bootstrap_initializer_running");
                  try {
                    // 主动加载 reloader.ts
                    // 这会触发里面的 import.meta.glob 和所有的 console.log 逻辑
                    server.ssrLoadModule("/src/core/bootstrap/reloader.ts");
                    // Logger.success("Bootstrap_initializer_successfully");
                  } catch (e) {
                    Logger.error("Bootstrap_initializer_error", e);
                    console.error(e);
                  }

                  // 监听服务器启动完成的事件
                  // server.httpServer?.once("listening", async () => {
                  // });
                },
                // 处理热更新 (HMR)
                handleHotUpdate({ file, server }) {
                  // 如果修改的是 content/config 下的文件
                  if (
                    file.includes("/content/config/") ||
                    file.includes("/content/components/")
                  ) {
                    // 重新加载配置模块
                    server.ssrLoadModule("/src/core/bootstrap/reloader.ts");
                  }
                },
              },
            ],
          },
        });
      },
    },
  };
}
