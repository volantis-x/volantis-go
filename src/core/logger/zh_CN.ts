export const cliMessages: Record<string, string | ((key: any) => string)> = {
  // --- Active Theme Name ---
  Active_Theme_invalid_user_them: (t) =>
    `Volantis 将使用 [ base ] 主题, 因为配置了不存在的主题名: ${t}`,

  // --- Astro Config Errors/Infos ---
  Astro_Config_content_dir_not_found_error: `项目根目录没有 './content' 文件夹目录。`,
  Astro_Config_content_dir_separation: `   ⤷ 我们实行用户内容和项目内容分离，以方便各自的维护工作。`,
  Astro_Config_example_content_exists: `存在 './example_content' 示例目录。`,
  Astro_Config_example_content_usage: `   ⤷ 您可以把 './example_content' 复制或重命名为 './content' 之后，开始旅程...`,
  Astro_Config_example_content_not_found: `'./example_content' 示例目录未找到。请考虑手动创建 './content' 目录或重新克隆项目。`,
  Astro_Config_site_config_not_found_error: (filePath) =>
    `未找到所需的配置文件 '${filePath}'。`,
  Astro_Config_ensure_site_config_exists: `   ⤷ 请确保 'site.config.ts' 文件存在且位置正确。`,
  Astro_Config_example_site_config_exists: `在 './example_content/config/' 中存在示例 'site.config.ts'。`,
  Astro_Config_copy_example_site_config: `   ⤷ 您可以考虑将其复制到 './content/config/'。`,
  Astro_Config_example_site_config_not_found: `'./example_content/config/' 中未找到示例 'site.config.ts'。如果您没有个性化修改本项目，请运行 'git pull' 同步最新示例文件。`,
  Astro_Config_load_failed_title_error: (filePath) =>
    `TypeScript 动态导入 "${filePath}" 失败。`,
  Astro_Config_load_failed_ensure_file_error: `   ⤷ 请确保文件存在且是有效的 TypeScript/JavaScript。`,
  Astro_Config_load_failed_original_error: (e) => `   ⤷ 原始错误: ${e}`,

  // --- Bootstrap initializer ---
  Bootstrap_initializer_running: `启动项目初始化...`,
  Bootstrap_initializer_successfully: `项目初始化完成！`,
  Bootstrap_initializer_error: `项目初始化失败！！！`,
  Bootstrap_initializer_config_not_found: (userPath) =>
    `用户配置文件：${userPath} 加载出错，激活默认配置.`,
  Bootstrap_initializer_missing_config_keys: (t) =>
    `配置未定义的属性将使用默认值: ${t}`,
  Bootstrap_initializer_missing_component_config_keys: (t) =>
    `组件未定义的属性将使用默认值: ${t}`,
};

export default cliMessages;
