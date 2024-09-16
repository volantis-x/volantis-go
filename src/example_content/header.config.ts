import type { TopMarquee, TopNav } from "../../src/types/header";

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

export const TOP_NAV: TopNav = {
  // 头部导航栏的行为
  // "static":  默认行为，跟随页面滚动
  // "fixed":  固定在页面顶部
  // "sticky":  吸附在页面底部（仅部分主题支持）
  // Behavior of the header navigation bar
  // "static":  Default behavior, scrolls with the page
  // "fixed":  Fixed to the top of the page
  // "sticky":  Sticks to the bottom of the page (supported by only some themes)
  behavior: "static",
  // 头部导航栏的容器布局
  // "full":  全屏宽度
  // "centered":  内容宽度（宽度由 Style.css 中的 --content-max-width 变量控制）
  // Container layout of the header navigation bar
  // "full":  Full-width
  // "centered":  Content-width (controlled by the --content-max-width variable in Style.css)
  containerLayout: "full",
  // 头部导航栏的内容组件布局
  // "one": 单列布局
  // "two": 两列布局
  // "three": 三列布局
  // Layout of content components within the header navigation bar
  // "one": One-column layout
  // "two": Two-column layout
  // "three": Three-column layout
  contentLayout: "three",
  logo: {
    visible: true,
    // 仅在 threeColumns 布局下有效
    alignment: "left",
  },
  menu: {
    visible: true,
    // 仅在 twoColumns 布局下有效
    adjacentTo: "logo",
  },
  actions: {
    visible: true,
  },
};
