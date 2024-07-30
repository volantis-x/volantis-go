# helpers

## 简介

这个目录存放了项目中常用的工具函数和模块，用于简化开发流程。

## 目录结构

* `utils`: 存放通用的、与业务逻辑无关的辅助函数。
  * 字符串处理函数。
  * 日期时间处理函数。
  * 数组操作函数。
  * 类型判断函数。
  * 网络请求封装。
* `lib`: 存放与项目业务逻辑相关、相对复杂的模块或组件。
  * API 调用封装。
  * 配置相关函数。
  * 自定义的 hooks。
  * 与第三方库交互的封装。
  * 特定领域的算法或数据结构实现。

## 使用示例

```javascript
// 导入字符串处理函数
import { trim } from './helpers/utils/string';

// 使用 trim 函数去除字符串首尾空格
const str = trim('  Hello, world!  ');
console.log(str); // 输出：Hello, world!
```
