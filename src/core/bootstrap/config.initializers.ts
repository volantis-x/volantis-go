import * as SiteDefaults from "../../core/defaults/site.default";
// import * as I18nDefaults from "@/core/config/defaults/i18n.default";

export interface GlobalConfigRegistryItem {
  /** 配置的唯一标识符 (如 'site', 'i18n') */
  key: string;
  /** 用户配置文件的路径 (用于动态导入) */
  userPath: string;
  /** 项目默认配置对象 (直接引用模块) */
  defaults: any;
}

export const GLOBAL_CONFIG_REGISTRY: GlobalConfigRegistryItem[] = [
  {
    key: "site",
    // 不要用 @userConfig，直接写相对于项目根目录的路径
    // 也不要写 ../../../，直接从 content 开始，后续会自动处理路径
    userPath: "content/config/site.config.ts",
    defaults: SiteDefaults,
  },
  // {
  //   key: "i18n",
  //   userPath: "@userConfig/i18n.config.ts",
  //   defaults: I18nDefaults,
  // },
];
