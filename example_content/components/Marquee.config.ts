// content/config/components/ContentBlocks/Marquee/Marquee.config.ts

// 1. 全局默认配置 (所有 Marquee 组件生效)
export default {
  // 默认开启
  enable: true,
  // 默认向左
  direction: "left",
  // 默认使用你那个漂亮的渐变 (因为我们在 props 里设了默认值，这里不写也可以，写了就是覆盖)
  // background: "..."
  visibility: {
    showOnHomePage: true, // 1. 首页显示
    includes: [
      "^/projects/demo-modal", // 2. 特殊的弹窗演示页
      "^/campaign/.*", // 3. 所有的营销活动页
    ],
    // 只要不是首页，也不匹配上面的 regex，统统不显示
  },
  primaryContent: "😊 Welcome to Volantis GO!",
};

// 2. 命名实例 (针对特定场景)
export const instances = {
  // 场景 A: 首页顶部，向左滚，红色背景
  homeTop: {
    direction: "left",
    background: "linear-gradient(to right, #ff0000, #ff7f00)", // 简单的 CSS 背景
    scrollDuration: "40s",
  },

  // 场景 B: 首页底部，向右滚，使用图片背景
  homeBottom: {
    direction: "right",
    background: "/uploads/space-bg.jpg", // 图片背景
    primaryContent: "Thanks for visiting!",
    secondaryContent: "",
    button: {
      text: "Contact Us",
      url: "/contact",
    },
  },

  // 场景 C: 静态公告栏 (不滚动)
  staticNotice: {
    direction: "none",
    background: "#333",
    customClass: "text-white",
  },
};
