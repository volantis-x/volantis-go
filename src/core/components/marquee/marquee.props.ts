// 只保留类型定义，干干净净
export interface MarqueeProps {
  enable?: boolean;
  direction?: "left" | "right" | "none";
  scrollDuration?: string;
  background?: string;
  primaryContent?: string;
  secondaryContent?: string;
  separator?: string;
  button?: {
    text: string;
    url: string;
    target?: "_blank" | "_self";
    ariaLabel?: string;
  };
  customClass?: string;
  ariaLabel?: string;
  pauseOnHover?: boolean;
  visibility?: {
    showOnHomePage?: boolean;
    includes?: string[];
    excludes?: string[];
  };
}
