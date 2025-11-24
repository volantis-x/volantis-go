export interface MarqueeProps {
  /**
   * 是否启用 Marquee 组件。
   * @default true
   */
  enable?: boolean;

  /**
   * 滚动方向。
   * 'left': 向左滚动
   * 'right': 向右滚动
   * 'none': 不滚动 (居中或其他静态对齐)
   * @default 'left'
   */
  direction?: "left" | "right" | "none";

  /**
   * 滚动速度的持续时间 (仅当 direction 不为 'none' 时生效)。
   * 例如："60s", "30s"。
   * @default '60s'
   */
  scrollDuration?: string;

  /**
   * 主要内容。可以是纯文本或 HTML 字符串。
   * @default "✨ Welcome to Volantis GO!"
   */
  primaryContent?: string;

  /**
   * 次要内容。可以是纯文本或 HTML 字符串。
   * @default "A content site built with Astro."
   */
  secondaryContent?: string;

  /**
   * 当主内容和次要内容都存在时，它们之间的分隔符。
   * @default "-"
   */
  separator?: string;

  /**
   * 按钮配置 (可选)。
   * 如果提供，将显示一个按钮。
   */
  button?: {
    text: string;
    url: string;
    target?: "_blank" | "_self";
    ariaLabel?: string;
  };

  /**
   * 背景图片 URL (可选)。
   */
  backgroundImage?: string;

  /**
   * 背景图片的位置和样式 (更高级的配置，可选)。
   */
  backgroundImageStyle?: {
    position?: "left" | "right" | "center" | "cover"; // 'cover' 表示作为背景平铺
    size?: string; // e.g., 'contain', '50px auto'
    repeat?: string; // e.g., 'no-repeat'
    opacity?: number;
  };

  /**
   * 自定义 CSS 类名，应用到 Marquee 的根元素。
   */
  customClass?: string;

  /**
   * ARIA label，用于可访问性。
   */
  ariaLabel?: string;

  /**
   * 当鼠标悬停在 Marquee 上时是否暂停滚动。
   * 仅当 direction 不为 'none' 时生效。
   * @default true
   */
  pauseOnHover?: boolean;
}

// 组件的基础默认值，初始化器会用到它
export const defaultMarqueeProps: Required<
  Omit<
    MarqueeProps,
    "button" | "secondaryContent" | "backgroundImage" | "backgroundImageStyle"
  >
> &
  Pick<
    MarqueeProps,
    "button" | "secondaryContent" | "backgroundImage" | "backgroundImageStyle"
  > = {
  enable: true,
  direction: "left",
  scrollDuration: "60s",
  primaryContent: "✨ Welcome to Volantis GO!",
  secondaryContent: "A content site built with Astro.",
  separator: "-",
  button: undefined,
  backgroundImage: undefined,
  backgroundImageStyle: undefined,
  customClass: "",
  ariaLabel: "Notification marquee",
  pauseOnHover: true,
};
