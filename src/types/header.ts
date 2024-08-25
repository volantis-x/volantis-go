export type TopMarquee = {
  ENABLE: boolean;
  DIRECTION: string;
  DEFAULT_PRIMARY_CONTENT?: string;
  DEFAULT_SECONDARY_CONTENT?: string;
};

export type TopNav = {
  behavior: "fixed" | "static" | "sticky";
  containerLayout: "full" | "centered";
  contentLayout:
    | "two"
    | "twoColumns"
    | "twoParts"
    | "double"
    | "three"
    | "threeColumns"
    | "threeParts"
    | "triple";
  logo?: {
    visible: boolean;
    alignment?: "left" | "center" | "right"; // 仅在 threeColumns 布局下有效
  };
  menu?: {
    visible: boolean;
    adjacentTo?: "logo" | "actions"; // 仅在 twoColumns 布局下有效
  };
  actions?: {
    visible: boolean;
  };
};
