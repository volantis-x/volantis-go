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
                  const startUp = async () => {
                    try {
                      // 开始初始化
                      Logger.info("Bootstrap_initializer_running");

                      // 【控制台信息开启开关】
                      globalThis.__VOLANTIS_RELOADER_VERBOSE__ = true;

                      // 先加载原本是否有缓存
                      const mod = await server.moduleGraph.getModuleByUrl(
                        "/src/core/bootstrap/reloader.ts",
                      );
                      // 如果之前加载过，使缓存失效
                      if (mod) {
                        server.moduleGraph.invalidateModule(mod);
                      }
                      // 主动加载 reloader.ts
                      await server.ssrLoadModule(
                        "/src/core/bootstrap/reloader.ts",
                      );

                      // 输出完成初始化
                      Logger.success("Bootstrap_initializer_successfully");
                    } catch (e) {
                      Logger.error("Bootstrap_initializer_error", e);
                      console.error(e);
                    } finally {
                      // 【控制台信息关闭开关】无论成功失败，加载完后立刻关闭
                      // 这样后续的所有 HMR 都会保持安静
                      globalThis.__VOLANTIS_RELOADER_VERBOSE__ = false;
                    }
                  };

                  startUp();

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
