// // 引入组件的默认配置（包含值和类型）
// import { defaultMarqueeProps } from "../components/marquee/marquee.props";
// // import { defaultHeroProps } from ...

// /**
//  * 组件注册表
//  * 使用 "as const" 锁定类型，这样 TS 就能自动推断出 "marquee" 这个 key
//  * 以及 defaultMarqueeProps 里的具体类型。
//  */
// export const COMPONENTS = {
//   marquee: {
//     defaults: defaultMarqueeProps,
//     userPath: "content/components/Marquee.config.ts",
//   },
//   // 未来新增组件只需在这里加一行：
//   // hero: { defaults: defaultHeroProps, userPath: "..." }
// } as const;

// // 这是一个类型辅助，后面 store.ts 会用到
// export type ComponentRegistry = typeof COMPONENTS;
