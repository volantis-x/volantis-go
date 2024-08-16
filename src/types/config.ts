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

export const SUPPORTED_THEMES = ["base"] as const;
export type SupportedTheme = (typeof SUPPORTED_THEMES)[number];
