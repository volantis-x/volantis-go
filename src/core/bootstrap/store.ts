// 储存初始化后的组件参数

import type { MarqueeProps } from '../../components/contentblocks/marquee/marquee.props';
// import type { OtherComponentProps } from '@/components/...'; // 其他组件的 Props 类型

// 定义所有可能被处理的配置的接口
interface ProcessedConfigsMap {
  marquee?: Readonly<MarqueeProps>; // Marquee 组件的最终配置
  // topNav?: Readonly<TopNavProps>;
  // button?: Readonly<ButtonProps>;
  // ... 其他组件
}

// 这个对象将由 initializer.ts 填充
const configsStore: Partial<ProcessedConfigsMap> = {}; // 使用 Partial 因为初始为空

/**
 * 获取经过初始化处理的组件配置。
 * @param key 组件配置的键名 (例如 'marquee', 'topNav')
 * @returns 返回只读的配置对象，如果未处理则返回 undefined。
 */
export function getProcessedConfig<K extends keyof ProcessedConfigsMap>(
  key: K
): ProcessedConfigsMap[K] | undefined {
  return configsStore[key];
}

/**
 * (仅供 initializer.ts 内部使用) 设置并冻结处理后的组件配置。
 * @param key 组件配置的键名
 * @param value 处理后的配置对象
 */
export function _setProcessedConfig<K extends keyof ProcessedConfigsMap>(
  key: K,
  value: NonNullable<ProcessedConfigsMap[K]> // 确保传入的值不是 undefined
): void {
  if (configsStore[key] && Object.isFrozen(configsStore[key])) {
    // 如果配置已被设置并冻结，理论上不应该再次设置
    // 可以选择抛出错误或仅记录一个警告
    console.warn(`[ProcessedConfigs] Attempted to re-set frozen config for key: ${String(key)}`);
    return;
  }
  configsStore[key] = Object.freeze(value); // 存储并冻结
}

// --- 命名实例配置类型 ---
// NamedComponentInstances 现在存储的是完整的 PropsType，而不是 Partial<PropsType>
// 因为在 initializer 中，每个实例都基于 globalDefault 合并了，已经是完整的了
interface NamedComponentInstances<PropsType> {
  [instanceId: string]: Readonly<PropsType>; // 存储完整的、只读的实例配置
}

interface AllNamedInstances {
  marquee?: Readonly<NamedComponentInstances<MarqueeProps>>;
  // topNav?: Readonly<NamedComponentInstances<TopNavProps>>;
}
const namedInstancesStore: Partial<AllNamedInstances> = {};

/**
 * 获取一个组件的特定命名实例的配置。
 * @param componentKey - 组件的键名，例如 'marquee'。
 * @param instanceId - 该组件的实例 ID，例如 'featuredProduct'。
 * @returns 返回只读的实例配置对象，如果未找到则返回 undefined。
 */
export function getNamedInstanceConfig(
  componentKey: keyof AllNamedInstances,
  instanceId: string
): Readonly<any> | undefined { // <-- 返回类型一些报错, 这里返回所有类型, 各组件内进行类型安全声明.
  const componentInstances = namedInstancesStore[componentKey];

  if (componentInstances && Object.prototype.hasOwnProperty.call(componentInstances, instanceId)) {
    return componentInstances[instanceId as keyof typeof componentInstances];
  }

  return undefined;
}

/**
 * (仅供 initializer.ts 内部使用) 设置一个组件的所有命名实例。
 * @param componentKey - 组件的键名，例如 'marquee'。
 * @param instances - 一个包含所有命名实例配置的对象。
 */
export function _setNamedInstances<
  CompKey extends keyof AllNamedInstances,
  PropsType = AllNamedInstances[CompKey] extends Readonly<NamedComponentInstances<infer P>> ? P : never
>(
  componentKey: CompKey,
  instances: Record<string, Readonly<PropsType>> // <-- 明确参数类型
): void {
  // 冻结整个实例对象并存储
  namedInstancesStore[componentKey] = Object.freeze(instances);
}

// (可选) 一个函数来确保所有必要的检查都已完成
// let initializationDone = false;
// export function markInitializationComplete() { initializationDone = true; }
// export function isInitializationComplete() { return initializationDone; }
