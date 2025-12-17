export type Config = {
  FAVICON: string;
  ADD_TITLE: boolean;
  DELIMITER: boolean;
  VIEW_TRANSITIONS: boolean;
  USE_SMALLER_FONT: boolean;

  // 是否显示 Volantis 版本号 (e.g. Volantis GO v1.0.xxx)
  SHOW_VOLANTIS_VERSION: boolean;

  // 是否显示 Astro 版本生成器信息 (e.g. Astro v5.x.x)
  SHOW_ASTRO_GENERATOR: boolean;
};

// export type Metadata = {
//   DEFAULT_TITLE: string;
//   DEFAULT_DESCRIPTION: string;
// };
