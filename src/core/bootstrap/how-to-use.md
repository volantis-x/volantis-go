---
title: 初始化之后的各配置和组件调用方法
---

## 关于 bootstrap

`integration.ts` 为初始化入口, 主要实现了热加载用户配置文件.

`reloader.ts` 为初始化的核心文件, 主要为 `store.ts` 提供三个输出变量.

`store.ts` 为主要输出入口, 其他组件调用初始化结果, 只需要加载此文件, 调用对应配置或组件名即可.

其中有两个文件, 在后续开发增加或减少时, 需要手动增减:

+ `component.initializers.ts`: 各组件的默认文件和用户文件设置文件.
+ `config.initializers.ts`: 各配置的默认文件和用户文件设置文件.

## 调用方式

`bootstrap` 初始化已经处理好所有用户配置和组件配置, 只需要直接读取使用即可.

在这之前先说明什么是用户配置和组件配置:

+ `用户配置`: 指 `content/config/*.ts` 里面的配置.
+ `组件配置`: 指 `content/components/*.ts` 里面的配置.

这些名称定义, 都不是项目本身内置的配置.

### 使用用户配置

要想读取用户配置, 无需直接加载 `content/config/*.ts`, 直接读取 store 的结果, 即可得到在没有设定的相关配置时, 会使用以下结果:

用户配置 > 项目默认配置.

当某个值用户没有配置, 或者配置的值是错误时, 初始化会把它恢复成项目的默认配置值, 并会在初始化时输出提示.

使用方式非常简单, 直接调用 `store.ts` 里的 `getGlobalConfig` 即可.

```ts
// 用户配置调用示例

import { getGlobalConfig } from "@/core/bootstrap/store";

// 示例读取用户的 site.config.ts 配置里的 CONFIG
// 注意: 这里有采用 ! 去声明配置一定存在, 从而防止报错
// 因为初始化时, 那怕没有配置这些值, 也会读取项目的默认值
const siteConfig = getGlobalConfig("site")!.CONFIG

// 使用它们
const {
  title = siteConfig.DEFAULT_TITLE,
  description = siteConfig.DEFAULT_DESCRIPTION,
  author = siteConfig.DEFAULT_AUTHOR,
}: Frontmatter = Astro.props;
```

### 使用组件配置

组件配置是由各组件内部去实现各自的初始化.

这相比用户的配置文件来说更为简易调用!

```astro
---
// 这将和传统的加载方式一模一样, 组件内部会去实现如何读取相关配置值.
// 遵循: 用户的组件配置优先, 其次才是项目本身的组件配置.
import Marquee from "@components/marquee/";
---

<Marquee />
```

如果想为组件使用不同的场景配置, 直接传入对应参数即可:

```astro
---
// 这将和传统的加载方式一模一样, 组件内部会去实现如何读取相关配置值.
// 遵循: 用户的组件配置优先, 其次才是项目本身的组件配置.
import Marquee from "@components/marquee/";
---

{/* 常规使用 */}
<Marquee />

<!-- 1. 调用 "homeTop" 实例 (左滚，红背景) -->
<Marquee instanceId="homeTop" />

<!-- 2. 调用 "homeBottom" 实例 (右滚，图片背景) -->
<Marquee instanceId="homeBottom" />

<!-- 3. 调用 "staticNotice" 实例 (静止) -->
<Marquee instanceId="staticNotice" />
```

以上几个场景, 假设配置是以下代码, 实际使用过程, 用户完全可以自定义, 只是注意相关命名即可:

```ts
export const instances = {
  // 场景 A: 首页顶部，向左滚，红色背景
  homeTop: {
    direction: "left",
    background: "linear-gradient(to right, #ff0000, #ff7f00)", // 简单的 CSS 背景
    scrollDuration: "40s",
  },

  // 场景 B: 首页底部，向右滚，使用图片背景
  homeBottom: {
    direction: "right",
    background: "/uploads/space-bg.jpg", // 图片背景
    primaryContent: "Thanks for visiting!",
    secondaryContent: "",
    button: {
      text: "Contact Us",
      url: "/contact",
    },
  },

  // 场景 C: 静态公告栏 (不滚动)
  staticNotice: {
    direction: "none",
    background: "#333",
    customClass: "text-white",
  },
};
```
