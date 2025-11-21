
核心都在 `src/core/bootstrap/store.ts` 导出的那三个 Getter 函数上。

以下是三种常见的使用场景：

### 1. 使用全站配置 (在 Layout 或 Page 中)

通常用于 `<head>` 设置、SEO、多语言判断等。

**场景**：在 `src/layouts/Layout.astro` 中获取网站标题和语言设置。

```astro
---
// src/layouts/Layout.astro
import { getGlobalConfig } from "@/core/bootstrap/store";
// 引入类型定义，让写代码时有自动补全 (TS)
// 假设你的 site.default.ts 导出了这些类型，或者你从 @/types/config 引入
import type { Config, Metadata } from "@/types/config";

// 定义存储在 Store 里的全站配置结构
// 因为 site.default.ts 是命名导出，Store 里的结构是 { SITE: ..., CONFIG: ..., HOME: ... }
interface SiteConfigFull {
  SITE: string;
  BUILD_ASSETS_DIR: string;
  UserTheme: string;
  CONFIG: Config;
  HOME: Metadata;
}

// 1. 获取配置
// 注意：'site' 对应 GLOBAL_CONFIG_REGISTRY 里的 key
const siteData = getGlobalConfig<SiteConfigFull>("site");

// 2. 解构使用 (如果初始化成功，siteData 一定有值，但为了安全可以用可选链 ?.)
const appConfig = siteData?.CONFIG;
const siteTitle = appConfig?.DEFAULT_TITLE || "Volantis GO";
const lang = appConfig?.DEFAULT_LOCALE || "en";
const direction = appConfig?.DIR || "ltr";
---

<!doctype html>
<html lang={lang} dir={direction}>
  <head>
    <meta charset="UTF-8" />
    <title>{siteTitle}</title>
    <!-- 其他 meta 标签 -->
  </head>
  <body>
    <slot />
  </body>
</html>
```

---

### 2. 使用组件配置 (在组件内部)

这是我们这次重构的核心受益者。组件不需要关心配置从哪来，直接拿就行。

**场景**：在 `Marquee.astro` 内部。

```astro
---
// src/components/contentblocks/marquee/Marquee.astro
import {
  getProcessedConfig,
  getNamedInstanceConfig,
} from "@/core/bootstrap/store";
import type { MarqueeProps } from "./marquee.props";
// 引入代码级默认值作为最后的“兜底”
import { defaultMarqueeProps } from "./marquee.props";

export interface Props extends Partial<MarqueeProps> {
  instanceId?: string;
}

const { instanceId, ...propsFromCaller } = Astro.props;

// 1. 获取全局组件配置
// 这里的逻辑是：Store 里存的是 (代码默认 + 用户全站配置) 合并后的结果
const globalConfig = getProcessedConfig<MarqueeProps>("marquee") || defaultMarqueeProps;

// 2. 获取命名实例 (如果有 instanceId)
let instanceConfig: Partial<MarqueeProps> = {};
if (instanceId) {
  const found = getNamedInstanceConfig<MarqueeProps>("marquee", instanceId);
  if (found) {
    instanceConfig = found;
  }
}

// 3. 最终合并
// 优先级：直接传参 > 命名实例 > 全局配置
const finalProps: MarqueeProps = {
  ...globalConfig,
  ...instanceConfig,
  ...propsFromCaller,
};

// 4. 渲染
const shouldRender = finalProps.enable;
---

{shouldRender && (
  <div class={finalProps.customClass}>
    {/* 渲染逻辑 */}
    {finalProps.primaryContent}
  </div>
)}
```

---

### 3. 在页面中使用命名实例

这是用户在 `.astro` 页面文件中调用组件的方式。

**场景**：用户在 `index.astro` 想用一个名为 `fast` 的 Marquee 配置（假设他在 `Marquee.config.ts` 里定义了 `instances: { fast: { ... } }`）。

```astro
---
// src/pages/index.astro
import Marquee from "@/components/contentblocks/marquee/Marquee.astro";
---

<!-- 情况 A: 使用默认全局配置 -->
<Marquee />

<!-- 情况 B: 使用命名实例 "fast" -->
<Marquee instanceId="fast" />

<!-- 情况 C: 使用命名实例，但临时覆盖某个属性 -->
<Marquee instanceId="fast" direction="right" />
```

---

### 总结使用的三个函数

| 函数名 | 用途 | 示例 Key | 返回值内容 |
| :--- | :--- | :--- | :--- |
| `getGlobalConfig<T>(key)` | 获取全站非组件配置 | `"site"`, `"i18n"` | 包含 `SITE`, `CONFIG` 等对象的全量配置 |
| `getProcessedConfig<T>(key)` | 获取组件的**通用**配置 | `"marquee"` | 经过用户全局覆盖后的 Props 对象 |
| `getNamedInstanceConfig<T>(k, id)` | 获取组件的**特定实例** | `"marquee"`, `"fast"` | 用户定义的特定实例 Props 对象 |

### 调试小技巧

如果你不确定 Store 里到底存了什么，可以在任何一个 Astro 组件的前端脚本或 Server 脚本里打印一下：

```astro
---
import { getGlobalConfig, getProcessedConfig } from "@/core/bootstrap/store";

const debugSite = getGlobalConfig("site");
const debugMarquee = getProcessedConfig("marquee");

console.log("DEBUG SITE:", JSON.stringify(debugSite, null, 2));
console.log("DEBUG MARQUEE:", JSON.stringify(debugMarquee, null, 2));
---
```
