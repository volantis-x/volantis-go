export type TopMarquee = {
  ENABLE: boolean;
  DIRECTION: string;
  DEFAULT_PRIMARY_CONTENT?: string;
  DEFAULT_SECONDARY_CONTENT?: string;
};

export type TopNav = {
  behavior: "fixed" | "static" | "sticky";
  containerLayout: "full" | "centered";
  contentLayout: "one" | "two" | "three";
  logo?: {
    visible: boolean;
    alignment?: "left" | "center" | "right"; // 仅在 three 布局下有效
  };
  menu?: {
    visible: boolean;
    adjacentTo?: "logo" | "actions"; // 仅在 two 布局下有效
  };
  actions?: {
    visible: boolean;
  };
};
