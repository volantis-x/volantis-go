// --- 全站配置存储 (Site, I18n) ---
const globalConfigsStore: Record<string, Readonly<any>> = {};

export function getGlobalConfig<T>(key: string): Readonly<T> | undefined {
  return globalConfigsStore[key] as Readonly<T> | undefined;
}

export function _setGlobalConfig(key: string, value: any): void {
  globalConfigsStore[key] = Object.freeze(value);
}

// --- 组件默认配置存储 (经过合并后的全局默认) ---
const componentConfigsStore: Record<string, Readonly<any>> = {};

export function getProcessedConfig<T>(key: string): Readonly<T> | undefined {
  return componentConfigsStore[key] as Readonly<T> | undefined;
}

export function _setProcessedConfig(key: string, value: any): void {
  if (
    componentConfigsStore[key] &&
    Object.isFrozen(componentConfigsStore[key])
  ) {
    console.warn(`[Store] Config for ${key} already set.`);
    return;
  }
  componentConfigsStore[key] = Object.freeze(value);
}

// --- 组件命名实例存储 ---
const namedInstancesStore: Record<string, Readonly<Record<string, any>>> = {};

export function getNamedInstanceConfig<T>(
  componentKey: string,
  instanceId: string
): Readonly<T> | undefined {
  const instances = namedInstancesStore[componentKey];
  if (
    instances &&
    Object.prototype.hasOwnProperty.call(instances, instanceId)
  ) {
    return instances[instanceId] as Readonly<T>;
  }
  return undefined;
}

export function _setNamedInstances(
  componentKey: string,
  instances: Record<string, any>
): void {
  namedInstancesStore[componentKey] = Object.freeze(instances);
}
