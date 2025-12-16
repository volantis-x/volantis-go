export default {
  // 通用默认配置
  default: {
    // --- 逻辑参数 ---
    enable: true, // 虽然主题决定加载，但保留这个开关允许用户强制关闭
    direction: "left",
    scrollDuration: "60s",
    pauseOnHover: true,

    // --- 内容参数 ---
    primaryContent: "欢迎来到 Volantis GO！(默认)",
    secondaryContent: "构建未来的内容站点",
    separator: "-",
    // button: {
    //   text: "Get Started",
    //   url: "#" // 给个默认链接，防止报错
    // },
    background:
      "radial-gradient(circle at 50% 0, rgba(255,255,255,0.9) 100%, transparent), radial-gradient(circle at 50% 75%, rgba(233, 0, 0, 0.5), rgba(233, 0, 0, 0) 70.71%), radial-gradient(circle at 6.7% 75%, rgba(0, 0, 233, 0.5), rgba(0, 0, 233, 0) 70.71%), radial-gradient(circle at 93.3% 75%, rgba(0, 233, 0, 0.5), rgba(0, 233, 0, 0) 70.71%) beige",
  },

  // 预设实例 (可选)
  // homeTop: { ... }
  homeTop: {
    primaryContent: "🔥 热门新闻：Volantis 更新啦！",
  },
};
