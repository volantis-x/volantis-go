import { getTimeStamp } from "@utils/utils";

export const WARNING_PREFIX = `\u001b[33m${getTimeStamp()} ⚠ WARNING: \u001b[0m`;

export const WARNING = {
  TOP_NAV_REQUIRES_TWO_VISIBLE_ELEMENTS:
    `${WARNING_PREFIX} 当前主题的头部导航不支持单列样式，请确保配置文件 "header.config.ts" >> "TOP_NAV" 里面的 "logo"、"menu"、"actions" 至少有两个 "visible" 的值为 "true" \r\n` +
    `${WARNING_PREFIX} This theme's header requires at least two visible elements: logo, menu, or actions. Please check your "visible" settings in "header.config.ts" >> "TOP_NAV".`,
  TOP_NAV_REQUIRES_THREE_VISIBLE_ELEMENTS:
    `${WARNING_PREFIX} 当前主题的头部导航配置是三列样式，请确保配置文件 "header.config.ts" >> "TOP_NAV" 里面的 "logo"、"menu"、"actions" 的 "visible" 的值都为 "true" \r\n` +
    `${WARNING_PREFIX} This theme's header is configured for a three-column layout. Please ensure that the "visible" values for "logo", "menu", and "actions" are all set to "true" in "header.config.ts" >> "TOP_NAV".`,
};
