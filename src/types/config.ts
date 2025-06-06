export type Config = {
  FAVICON: string;
  DEFAULT_LOCALE: string;
  DIR: string;
  DEFAULT_TITLE: string;
  DEFAULT_DESCRIPTION: string;
  DEFAULT_AUTHOR: string;
  ADD_TITLE: boolean;
  DELIMITER: boolean;
  VIEW_TRANSITIONS: boolean;
  USE_SMALLER_FONT: boolean;
};

export type Metadata = {
  DEFAULT_TITLE: string;
  DEFAULT_DESCRIPTION: string;
};

export type I18n = {
  USE_I18N: boolean;
};

// 请同步 astro.conifg.mjs 里的 ASTRO_CONFIG_SUPPORTED_THEMES 值
// Keep this in sync with the ASTRO_CONFIG_SUPPORTED_THEMES value in astro.config.mjs
export const SUPPORTED_THEMES = ["base", "custom"] as const;
export type SupportedTheme = (typeof SUPPORTED_THEMES)[number];
