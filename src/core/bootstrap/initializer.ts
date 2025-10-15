
import { Logger } from "../../helpers/lib/logger";
// import { ACTIVE_THEME_NAME } from "@/helpers/lib/theme"; // 主题名服务
import { _setProcessedConfig, _setNamedInstances } from "./store"; // 存储结果

// --- Marquee Specific Imports ---
import { defaultMarqueeProps, type MarqueeProps } from "../../components/contentblocks/marquee/marquee.props";

// 用户 content/config/components.config.ts 导出的类型
interface UserComponentConfigs {
  marquee?: Partial<MarqueeProps>;
  // ... other components
}

// --- 辅助函数：安全地加载模块 ---
async function safeImport<T = any>(
  modulePath: string,
  expectedExportName: string = "default",
): Promise<T | null> {
  try {
    // 注意：这里的动态 import 路径是相对于 initializer.ts 的，或者需要 jiti/vite 能解析的别名
    // 如果 initializer.ts 是被 astro.config.mjs 中的 jiti 加载的，jiti 应该能处理这些
    // 如果 initializer.ts 是一个普通的 .ts 文件被其他 .ts 文件导入，
    // 那么这里的动态 import 路径需要 Vite 在构建时能解析。
    const module = await import(/* @vite-ignore */ modulePath); // @vite-ignore 抑制 Vite 警告
    return module[expectedExportName] || module; // 尝试默认导出，否则返回整个模块
  } catch (error) {
    // Logger.debug('CORE_INIT', 'debug_module_not_found_or_error', modulePath, error.message);
    // 在这里不打印日志，让调用者决定如何处理找不到模块的情况
    return null;
  }
}

// --- Marquee 配置初始化函数 ---
async function initializeMarqueeConfig(): Promise<void> {
  let userConfig: Partial<MarqueeProps> | undefined = undefined;
  let themeConfig: Partial<MarqueeProps> | undefined = undefined;

  // 1a. 尝试加载特定于 Marquee 的用户配置文件
  const specificUserMarqueeConfigModule = await safeImport<
    Partial<MarqueeProps>
  >(
    `@userConfig/components/ContentBlocks/Marquee/Marquee.config.ts`, // 或者你选择的更简短路径
  );
  if (specificUserMarqueeConfigModule) {
    userConfig = specificUserMarqueeConfigModule; // 假设默认导出配置对象
    // Logger.info("CORE_INIT", "info_marquee_specific_user_config_loaded");
  } else {
    // 1b. 如果特定文件不存在，尝试从集中的用户配置文件加载
    const centralizedUserConfigsModule = await safeImport<UserComponentConfigs>(
      `@userConfig/components.config.ts`,
    );
    if (centralizedUserConfigsModule?.marquee) {
      userConfig = centralizedUserConfigsModule.marquee;
      // Logger.info("CORE_INIT", "info_marquee_centralized_user_config_loaded");
    } else {
      // Logger.info("CORE_INIT", "info_marquee_user_config_not_found");
    }
  }

  // 2. 加载特定于 Marquee 的主题配置文件
  // @THEME/components/ContentBlocks/Marquee/Marquee.defaults.ts (或 .config.ts)
  const themeMarqueeConfigModule = await safeImport<Partial<MarqueeProps>>(
    `@THEME/components/ContentBlocks/Marquee/Marquee.config.ts`, // 保持与用户配置路径结构类似
  );
  if (themeMarqueeConfigModule) {
    themeConfig = themeMarqueeConfigModule; // 假设默认导出配置对象
    // Logger.info(
    //   "CORE_INIT",
    //   "info_marquee_specific_theme_config_loaded",
    //   ACTIVE_THEME_NAME,
    // );
  } else {
    // 可选：如果特定文件不存在，可以尝试从集中的 @THEME/component.defaults.ts 加载
    // 但更推荐的是，如果主题想覆盖，就必须提供特定组件的配置文件
    // Logger.info(
    //   "CORE_INIT",
    //   "info_marquee_theme_config_not_found_specific",
    //   ACTIVE_THEME_NAME,
    // );
  }

  // 3. 合并配置：用户 > 主题 > 组件基础默认
  const globalDefaultMarqueeConfig: MarqueeProps = {
    ...defaultMarqueeProps, // 基础默认
    ...(themeConfig || {}), // 主题配置覆盖（如果存在）
    ...(userConfig || {}), // 用户配置覆盖（如果存在）
  };

  // 4. 日志提示回退情况
  if (!userConfig && !themeConfig) {
    Logger.info("COMPONENT", "info_marquee_using_default_config");
  } else if (!userConfig && themeConfig) {
    // Logger.info(
    //   "COMPONENT",
    //   "info_marquee_using_theme_config",
    //   ACTIVE_THEME_NAME,
    // ); // 需要新消息键
  } else if (userConfig && !themeConfig) {
    // 这种情况比较少见，通常主题至少会提供一些默认
    // Logger.info("COMPONENT", "info_marquee_using_user_config_no_theme"); // 需要新消息键
  }

  // 5. 将这个 "全局默认的 Marquee 配置" 存储到 processedConfigs
  //    这样 <Marquee /> (不带 instanceId) 就能获取到它
  _setProcessedConfig("marquee", globalDefaultMarqueeConfig);

  // --- 新增：加载 Marquee 的命名实例 ---
  const marqueeInstancesUserConfig = await safeImport<{
    marqueeInstances: Record<string, Partial<MarqueeProps>>;
  }>(
    `@userConfig/components/ContentBlocks/Marquee.instances.ts` // 用户的命名实例配置文件
  );

  if (marqueeInstancesUserConfig?.marqueeInstances) {
    const processedNamedInstances: Record<string, Readonly<MarqueeProps>> = {}; // <-- 改为 Readonly<MarqueeProps>
    for (const instanceId in marqueeInstancesUserConfig.marqueeInstances) {
      if (Object.prototype.hasOwnProperty.call(marqueeInstancesUserConfig.marqueeInstances, instanceId)) {
        processedNamedInstances[instanceId] = Object.freeze({ // <--- 对每个实例也 freeze
          ...globalDefaultMarqueeConfig,
          ...marqueeInstancesUserConfig.marqueeInstances[instanceId],
        });
      }
    }
    _setNamedInstances("marquee", processedNamedInstances);
    // Logger.info("CORE_INIT", "info_marquee_named_instances_loaded");
  } else {
    // Logger.info("CORE_INIT", "info_marquee_no_named_instances_found");
  }
}

// --- 主初始化函数 ---
let initializationPromise: Promise<void> | null = null;

export function runInitializers(): Promise<void> {
  if (initializationPromise) {
    return initializationPromise;
  }
  // Logger.info("CORE_INIT", "info_starting_initialization"); // 需要新消息键
  initializationPromise = (async () => {
    // 确保 Logger 和 ACTIVE_THEME_NAME 已经准备好
    // （它们在模块顶层就应该可用了）
    await initializeMarqueeConfig();
    // await initializeOtherComponentConfigs();
    // Logger.success("CORE_INIT", "info_initialization_complete"); // 需要新消息键
  })().catch((_err) => {
    // Logger.error("CORE_INIT", "error_initialization_failed", err.message);
  });
  return initializationPromise;
}
