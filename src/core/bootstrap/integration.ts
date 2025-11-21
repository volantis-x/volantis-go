import type { AstroIntegration } from "astro";
import { runInitializers } from "./initializer";

export default function createConfigInitializerIntegration(): AstroIntegration {
  return {
    name: "Volantis GO",
    hooks: {
      // 'astro:config:setup' 钩子在配置解析后、服务器启动或构建开始前运行
      // 或者 'astro:build:start' 在构建开始时
      "astro:config:setup": async ({
        logger, // Astro 提供了自己的、带颜色的日志工具
        // command, // 'dev', 'build', 'preview'
        // isRestart, // 是否是因文件变更而重启
        // updateConfig // 如果需要动态修改 Astro 配置
      }) => {
        try {
          await runInitializers();
        } catch (error: unknown) {
          if (error instanceof Error) {
            logger.error(error.stack || error.message);
          } else {
            logger.error(`---->> An unknown error occurred: ${String(error)}`);
          }

          // 在构建时，重新抛出错误以中断构建
          if (
            process.env.NODE_ENV === "production" ||
            process.env.ASTRO_COMMAND === "build"
          ) {
            // 重新抛出原始错误，而不是只抛出消息，这样可以保留完整的堆栈信息
            throw error;
          }
        }
      },
    },
  };
}
