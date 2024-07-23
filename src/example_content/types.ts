export type Config = {
  FAVICON: string;
  DEFAULT_LOCALE: string;
  DIR: string;
  TITLE: string;
  DESCRIPTION: string;
  AUTHOR: string;
  ADD_TITLE: boolean;
  DELIMITER: boolean;
  VIEW_TRANSITIONS: boolean;
  USE_SMALLER_FONT: boolean;
};

export type MarqueeTOP = {
  ENABLE: boolean;
  DIRECTION: string;
  PRIMARY_CONTENT: string;
  SECONDARY_CONTENT: string;
};

export type Metadata = {
  TITLE: string;
  DESCRIPTION: string;
};
