import type { TopNav } from "@/types/header";
import { WARNING } from "@/helpers/config/console";

/**
 * @en Get the current time and format it as a localized time string.
 * @zh 获取当前时间并将其格式化为本地化的时间字符串。
 *
 * @returns {string} - @en The current time as a localized string.
 *                     @zh 当前时间格式化为本地化的字符串。
 */
export const getTimeStamp = (): string => {
  return new Date().toLocaleTimeString();
};

/**
 * @en Normalize user input contentLayout value to "twoColumns" or "threeColumns".
 * @zh 将用户输入的 contentLayout 值标准化为 "twoColumns" 或 "threeColumns".
 *
 * @param layout - @en User input contentLayout value.
 *                 @zh 用户输入的 contentLayout 值.
 * @returns @en Normalized contentLayout value.
 *          @zh 标准化的 contentLayout 值.
 */
export function normalizeContentLayout(
  layout: TopNav["contentLayout"]
): "twoColumns" | "threeColumns" {
  switch (layout) {
    case "two":
    case "twoParts":
    case "twoColumns":
    case "double":
      return "twoColumns";
    case "three":
    case "threeParts":
    case "threeColumns":
    case "triple":
      return "threeColumns";
    default:
      // 处理无效输入，例如抛出错误或使用默认值
      // Handle invalid input, e.g., throw an error or use a default value
      console.warn(
        `${WARNING}: header.config.ts 中 TOP_NAV 的 contentLayout 配置项无效：${layout}，将使用默认值 twoColumns`
      );
      console.warn(
        `${WARNING}: Invalid contentLayout configuration value in TOP_NAV within header.config.ts: ${layout}. Using default value "twoColumns"`
      );
      return "twoColumns";
  }
}
