
# 目录结构

为了防止未来某一天因自己过久没有维护项目，导致增加对整个项目结构理解成本，在此写下项目的主要目录结构。

本项目主要是解决不想因为更换网站样式主题等，而去修改整个内容文档去适配不同的主题。

说白话：保持所有文章内容、配置内容不变的情况下，仅需要修改主题名，就可以实现网站风格更换。

本项目配置核心概念：

**基础默认 < 主题默认 < 用户配置**

当用户没有进行相关配置时，读取主题的相关配置（如组件样式，内容参数等）。

当主题没有进行相关配置时，读取各组件的默认配置。

## ./content/ 用户内容区

本项目实行用户内容和项目内容分离，以实现各自的维护工作。

`./content/` 默认被项目 gitignore 排除，用户需要自己创建此目录，里面包含所有的用户网站信息。用户如需修改自己的网站内容，只需要修改此处内容即可。

`./example_content/` 示例 content ，新用户完全可以复制此目录并重命名为 `content` 即可得到一个初始的用户内容。保留此目录内容，可以查看示例的默认值。

## ./src/config/ 内部配置区

这里存放项目内部定义的一些内容或配置。

用户无需来这里修改，此目录面向开发者使用，定义了大量项目的初始配置。

## ./src/components/ 组件区

TODO: 每个版块组件化。

为了方便组件的维护，每个组件的默认配置和组件放在一起。

同时为了更友好归类组件，这里对组件区进行了以下分类:

```txt
src/components/
├── Core/                       // 非常基础和通用的构建块
│   ├── Button.astro
│   ├── Button.config.ts        // 组件默认配置文件示例
│   ├── Link.astro
│   └── Link.config.ts
│
├── Navigation/                 // 导航相关
│   ├── Menu.astro
│   ├── Breadcrumbs.astro
│   └── Pagination.astro
│
├── Layout/                     // 布局辅助
│   ├── Grid.astro
│   └── Section.astro
│
├── ContentBlocks/              // 用于构建页面主要内容的块级组件
│   ├── Card.astro              // 通用卡片
│   ├── ArticleCard.astro       // 文章专用卡片
│   ├── FeatureList.astro       // 特性列表
│   ├── CallToAction.astro      // 行动号召块
│   ├── Testimonial.astro       // 用户评价
│   ├── Marquee.astro           // 跑马灯
│   └── AuthorProfile.astro
│
├── Feedback/                   // 用户反馈和状态提示
│   ├── Alert.astro
│   ├── Modal.astro
│   └── Spinner.astro
│
└── Forms/                      // 表单元素
    ├── Form.astro
    └── FormField.astro         // (可能封装了 Label + Input + Error)
```

## ./src/helpers/ 帮手

这个目录存放了项目中常用的工具函数和模块，用于简化开发流程。

### 目录结构

* `./src/helpers/utils/`: 存放通用的、与业务逻辑无关的辅助函数。
  * 字符串处理函数。
  * 日期时间处理函数。
  * 数组操作函数。
  * 类型判断函数。
  * 网络请求封装。
* `./src/helpers/lib/`: 存放与项目业务逻辑相关、相对复杂的模块或组件。
  * API 调用封装。
  * 配置相关函数。
  * 自定义的 hooks。
  * 与第三方库交互的封装。
  * 特定领域的算法或数据结构实现。
  * 服务于业务逻辑的调试和信息反馈，比如 logger。

### 使用示例

```javascript
// 导入字符串处理函数
import { trim } from './helpers/utils/string';

// 使用 trim 函数去除字符串首尾空格
const str = trim('  Hello, world!  ');
console.log(str); // 输出：Hello, world!
```

## ./src/layouts/ 布局

布局层文件，此处主要实现不同主题加载不同的布局组件。

`./src/layouts/components/` 此处为组件的加载入口，根据不同的主题配置，去判断是否加载相关组件。

## ./src/pages/ 页面

页面生成层，此处主要实现网站页面内容的输出结构。

TODO: 考虑如何按需生成页面。比如，只有博客内容时，不要生成相册等页面。

## ./src/themes/ 各主题的默认配置

此处存放每个主题的默认样式，以及各组件的主题风格配置。

## ./src/types/ 类型声明

声明一些通用的 ts 类型，多作用在全局。
