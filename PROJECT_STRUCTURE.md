
# 关于本项目

## 概念

为了防止未来某一天因自己过久没有维护项目，导致增加对整个项目结构理解成本，在此写下项目的主要目录结构。

所有配置都会有回退机制, 以确保项目能正常运行, 其中多以用户自行配置权重最高:

+ 站点配置: **用户配置** > **默认配置**
+ 组件配置: **props传入配置** > **用户配置** > **组件默认配置**
+ 样式配置: **用户样式** > **主题样式** > **组件默认样式**

初始化实行配置合并事项, 其他地方只读取初始化后的值.

项目在开始前就获取到当前用户选择的主题名称(如果没有则回退到默认主题名), 并存放在全局变量:`__VOLANTIS_THEME__`.

### 站点配置

用户配置在 `/content/config/*.ts`, 项目默认配置在 `/src/core/defaults/*.ts`.

使用方法:

```
import { getGlobalConfig } from "@/core/bootstrap/store";
// 如需要获取其他配置, 只需要换配置名即可.
// 如需要获取配置内的 CONFIG, 可以这样读取: getGlobalConfig("site")!.CONFIG;
const i18nConfig = getGlobalConfig("i18n");
```

### 组件配置

组件的配置分两种情况: 组件有默认配置和无默认配置之分. 不管是否有默认配置, 都支持用户配置权重高优先级(最高优先级是 props 传入).

1、组件有默认配置:

用户组件配置在 `/content/config/locales/**/*.ts`, 组件默认配置在 `/src/core/defaults/locales/**/*.ts`.

组件内使用方法:

```instanceId是可复用时查找的配置名,当前组件不可复用时,此值不会传入.
import { getComponentConfig } from "@/core/bootstrap/store";
import { getCurrentLang } from "@/core/i18n";

const { instanceId, ...propsFromCaller } = Astro.props;
const currentLang = getCurrentLang(Astro.url);

// 这已经合并了：System Default -> User Locale Default -> User Locale Instance
const storeConfig = getComponentConfig<MarqueeProps>(
  "marquee",
  currentLang,
  instanceId
);

const finalProps: MarqueeProps = {
  ...storeConfig,
  ...propsFromCaller,
};
```

2、组件没有默认配置:

用户组件配置依旧在 `/content/config/locales/**/*.ts`, 但是, 组件本身没有默认配置, 这类组件多是自动生成回退的默认配置.

那怕是没有配置, 其本身一些相关功能的开关, 依旧是需要额外配置, 只是内容层是自动生成.

```
const propsConfig = Astro.props.config || {};

const finalConfig: NavbarConfig = {
  ...getThemeNavbarConfig(), // 底层：各主题默认功能开关
  ...userNavSettings,
  ...propsConfig,
};

// 判断用户是否有配置组件内容配置, 没有则使用自动生成方案.
```

### 样式配置

样式配合组件, 以实现各组件在不同主题中能有不同风格, 依旧是遵守用户样式最高优先级:

“用户样式 -> 主题样式 -> 组件实现 -> 样式变量”

由于样式不需要经过初始化, 它使用的是后加载覆盖前面的作用, 故只需要在基础加载时调整顺序即可:

```src/core/themes/[主题名]/Style.astro
---
import "../normalize.css";
import "./variables.css";
import "./themeStyle.css";
import.meta.glob("/content/config/style.css", { eager: true });

import { getGlobalConfig } from "@/core/bootstrap/store";
const siteConfig = getGlobalConfig("site")!.CONFIG
---

{/*
  如果用户在网站配置中启用了较小的字体，则应用该字体大小。
  Apply smaller font size if enabled in site configuration.
*/}
{siteConfig?.USE_SMALLER_FONT && <style>html {font-size: 14px;}</style>}

```

## 关于项目版本号

本项目实行 **SemVer（语义化版本）** 和 **CalVer（日历化版本）** 的混合机制, 并遵守以下规则:

+ 大版本可能会存在兼容问题, 这往往代表了大量改变.
+ 小版本只有在增加相关功能时, 才会增加此小版本号, 如果只是修正或优化类, 此版本号不变.
+ 日期为修改时的日期, 以方便知晓此版本是在何时发布的.
+ 同一天有多个修订版本时, 后续再加热修版本号.

当天没有多次发行的版本号格式:

+ `v{大版本}.{小版本}.{日期}` -> `v1.0.20251215`

当天有多次发行的版本号格式:

+ `v{大版本}.{小版本}.{日期}.{修改}` -> `v1.0.20251215.1`, `v1.0.20251215.2`

如果有增加新功能或新样式等情况时,则小版本号增加:

+ 原 `v1.0.20251215` -> 新 `v1.1.20251215` (同一天)
+ 原 `v1.123.20251215` -> 新 `v1.124.20251216` (不同一天)

## TODO

+ ~~重构多语言信息提示~~
+ ~~重构 Logger 底层逻辑~~
+ ~~重构 astro.config.mjs 文件到 ts~~
+ ~~实现用户是否采用 i18n~~
+ 重构所有配置, 以方便采用未来的多语言统一一致性
+ 构思各板块统一性, 以方便未来扩展
+ 优化页面布局加载的方法, 同主题加载方法一样

## ./content/

本项目实行用户内容和项目内容分离，以实现各自的维护工作。

`./content/` 默认被项目 gitignore 排除，用户需要自己创建此目录，里面包含所有的用户网站信息。用户如需修改自己的网站内容，只需要修改此处内容即可。

## ./example_content/

`./example_content/` 示例 content ，新用户完全可以复制此目录并重命名为 `content` 即可得到一个初始的用户内容。保留此目录内容，可以查看示例的默认值。

## ./src/pages/

此目录为 Astro 生成页面路由用, 没有它, 则不会生成任何页面.

## ./src/core/

这里存放本项目内部实现过程的重要文件及默认配置。

普通用户无需来这里修改，此目录面向开发者或进阶用户。
