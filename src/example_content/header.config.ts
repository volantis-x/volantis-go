// 引入类型声明
// Introduce type declaration
import type { TopMarquee } from "@/content/types";

// 顶部滚动条配置。启用后，将在所有页面显示滚动条。
// Top marquee configuration. When enabled, a scrolling marquee will be displayed on all pages.
export const TOP_MARQUEE: TopMarquee = {
  // 是否启用顶部滚动条。设置为 false 则不显示滚动条。
  // Enable/disable the top marquee. Set to false to hide the marquee.
  ENABLE: true,

  // 滚动条内容的移动方向。 "left" 为向左滚动，"right" 为向右滚动。
  // Direction of the marquee content movement. "left" for leftward scrolling, "right" for rightward scrolling.
  DIRECTION: "left",

  // 滚动条的主要内容。
  // Primary content of the marquee.
  DEFAULT_PRIMARY_CONTENT: "Welcome to Volantis GO",

  // 滚动条的次要内容。
  // Secondary content of the marquee.
  DEFAULT_SECONDARY_CONTENT: "A content site built with Astro",
};
