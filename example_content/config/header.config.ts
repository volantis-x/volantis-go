import type { TopNav } from "../../src/core/types/header";

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
