import { defaultMarqueeProps } from "../components/contentblocks/marquee/marquee.props";

export interface ComponentRegistryItem {
  /** 组件唯一键名 */
  key: string;
  /** 组件代码里的硬编码默认值 */
  defaultProps: any;
  /** 用户配置文件的路径 (单个文件包含基础配置和实例) */
  userPath: string;
}

export const COMPONENT_REGISTRY: ComponentRegistryItem[] = [
  {
    key: "marquee",
    defaultProps: defaultMarqueeProps,
    // 不要用 @userConfig，直接写相对于项目根目录的路径
    // 也不要写 ../../../，直接从 content 开始，后续会自动处理路径
    userPath: "content/components/contentblocks/marquee/marquee.config.ts",
  },
  // 其他组件...
];
