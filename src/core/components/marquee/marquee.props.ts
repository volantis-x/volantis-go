export interface MarqueeProps {
  /**
   * 是否启用组件
   */
  enable?: boolean;

  /**
   * 滚动方向
   */
  direction?: "left" | "right" | "none";

  /**
   * 滚动一圈所需时间
   */
  scrollDuration?: string;

  /**
   * 背景设置
   * 可以是图片 URL (e.g., "/images/bg.png")
   * 也可以是 CSS 值 (e.g., "linear-gradient(...)", "#f0f0f0")
   * 如果为空，将使用组件内置的炫彩渐变
   */
  background?: string;

  /**
   * 主要内容 (HTML)
   */
  primaryContent?: string;

  /**
   * 次要内容 (HTML)
   */
  secondaryContent?: string;

  /**
   * 分隔符
   */
  separator?: string;

  /**
   * 按钮配置
   */
  button?: {
    text: string;
    url: string;
    target?: "_blank" | "_self";
    ariaLabel?: string;
  };

  /**
   * 自定义类名
   */
  customClass?: string;
  ariaLabel?: string;
  pauseOnHover?: boolean;

  /**
   * 智能显示规则
   * 控制组件在哪些页面显示。
   * 如果未定义，且 enable=true，则默认在所有页面显示。
   */
  visibility?: {
    /**
     * 是否在首页显示
     * @default true
     */
    showOnHomePage?: boolean;

    /**
     * 页面路径白名单 (支持正则字符串)
     * 只要当前路径匹配其中任意一项，就强制显示。
     * 例如: ["^/special-page", "/modal/.*"]
     */
    includes?: string[];

    /**
     * 页面路径黑名单 (支持正则字符串)
     * 只要当前路径匹配其中任意一项，就强制隐藏 (优先级高于 includes)。
     * 例如: ["^/admin", "/login"]
     */
    excludes?: string[];
  };
}

// 默认复杂渐变背景
const DEFAULT_COMPLEX_GRADIENT = `
  radial-gradient(circle at 50% 0, rgba(255,255,255,0.9) 100%, transparent),
  radial-gradient(circle at 50% 75%, rgba(233, 0, 0, 0.5), rgba(233, 0, 0, 0) 70.71%),
  radial-gradient(circle at 6.7% 75%, rgba(0, 0, 233, 0.5), rgba(0, 0, 233, 0) 70.71%),
  radial-gradient(circle at 93.3% 75%, rgba(0, 233, 0, 0.5), rgba(0, 233, 0, 0) 70.71%)
  beige
`;

export const defaultMarqueeProps: Omit<
  Required<MarqueeProps>,
  "button" | "visibility"
  //  | "backgroundImage" | "backgroundImageStyle"
> & {
  button?: MarqueeProps["button"];
  visibility?: MarqueeProps["visibility"];
  // 兼容旧属性，虽然我们不再推荐使用，但为了防止报错，给它们 undefined
  // backgroundImage?: string;
  // backgroundImageStyle?: any;
} = {
  enable: true,
  direction: "left",
  scrollDuration: "60s",
  background: DEFAULT_COMPLEX_GRADIENT,
  primaryContent: "😊 Welcome to Volantis GO!",
  secondaryContent: "A content site built with Astro.",
  separator: "-",
  customClass: "",
  ariaLabel: "Notification marquee",
  pauseOnHover: true,

  // 显式设置为 undefined
  button: undefined,
  visibility: undefined,
  // backgroundImage: undefined,
  // backgroundImageStyle: undefined,
};
