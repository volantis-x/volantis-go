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
