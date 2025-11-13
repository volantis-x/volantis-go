import type { AstroIntegration } from "astro";
import { runInitializers } from "./initializer";

const INTEGRATION_NAME = " 🚀 Volantis GO 🚀 ";

export default function createConfigInitializerIntegration(): AstroIntegration {
  return {
    name: INTEGRATION_NAME,
    hooks: {
      // 'astro:config:setup' 钩子在配置解析后、服务器启动或构建开始前运行
      "astro:config:setup": async ({
        logger, // Astro 提供了自己的、带颜色的日志工具
        // command, // 'dev', 'build', 'preview'
        // isRestart, // 是否是因文件变更而重启
        // updateConfig // 如果需要动态修改 Astro 配置
      }) => {
        const integrationLogger = logger.fork(INTEGRATION_NAME);

        integrationLogger.info("\u001b[36m---->> Running initializers... <<----");

        try {
          await runInitializers();
          integrationLogger.info("\u001b[32m---->> Initializers successfully! <<----");
        } catch (error: unknown) {
          // 明确 error 是 unknown 类型
          integrationLogger.error("\u001b[31m---->> Initializers failed! <<----");

          if (error instanceof Error) {
            // 如果 error 是一个 Error 对象实例，我们可以安全地访问 .stack 和 .message
            // logger.error() 通常可以接受 Error 对象作为参数
            integrationLogger.error(error.stack || error.message);
          } else {
            // 如果捕获到的不是一个 Error 对象，我们将其转换为字符串并输出
            integrationLogger.error(
              `---->> An unknown error occurred: ${String(error)}`,
            );
          }
          // ------------------------------------------

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

      // 你也可以使用其他钩子，例如 'astro:server:setup' 在开发服务器设置时
      // 或者 'astro:build:start' 在构建开始时
      // 但 'astro:config:setup' 通常是进行全局初始化的最佳位置
    },
  };
}
