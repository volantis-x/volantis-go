const ERROR_PREFIX_EN = `   ❌ \u001b[31m [ Error EN ]: \u001b[0m `;
const INFO_PREFIX_EN = `   ℹ️ \u001b[34m [ Info EN ]: \u001b[0m `;
const WARN_PREFIX_EN = `   ⚠️ \u001b[33m [ Warning EN ]: \u001b[0m `;
const DEBUG_PREFIX_EN = `   ⚙️ \u001b[36m [ Debug EN ]: \u001b[0m `;

const ERROR_PREFIX_CN = `   ❌ \u001b[31m [ Error CN ]: \u001b[0m `;
const INFO_PREFIX_CN = `   ℹ️ \u001b[34m [ Info CN ]: \u001b[0m `;
const WARN_PREFIX_CN = `   ⚠️ \u001b[33m [ Warning CN ]: \u001b[0m `;
const DEBUG_PREFIX_CN = `   ⚙️ \u001b[36m [ Debug CN ]: \u001b[0m `;

const messages = {
  en: {
    // --- Astro Config Errors/Infos ---
    error_content_dir_not_found: `\n${ERROR_PREFIX_EN} Required directory './content' not found.`,
    info_content_dir_separation: `       This project separates user content from the main project files.`,
    info_example_content_exists: `${INFO_PREFIX_EN} An './example_content' directory exists.`,
    info_example_content_usage: `       You can copy or rename './example_content' to './content' to get started...`,
    info_example_content_not_found: `${INFO_PREFIX_EN} The './example_content' directory was not found. Consider creating './content' manually or cloning the project.`,
    error_site_config_not_found: (filePath) =>
      `\n${ERROR_PREFIX_EN} Required configuration file '${filePath}' not found.`,
    info_ensure_site_config_exists: `       Please ensure that 'site.config.ts' exists and is correctly placed.`,
    info_example_site_config_exists: `${INFO_PREFIX_EN} An example 'site.config.ts' exists in './example_content/config/'.`,
    info_copy_example_site_config: `       You might want to copy it to './content/config/'.`,
    info_example_site_config_not_found: `${INFO_PREFIX_EN} Example 'site.config.ts' not found in './example_content/config/'. You might need to create it or run 'git pull' if it's part of the repository.`,

    // --- Jiti Load Errors ---
    error_jiti_load_failed_title: (filePath) => `\n${ERROR_PREFIX_EN} Failed to load and execute "${filePath}" using jiti.`,
    error_jiti_load_failed_ensure_file: `       Ensure the file exists and is valid TypeScript/JavaScript.`,
    error_jiti_load_failed_original_error: (errorMessage) => `       Original error: ${errorMessage}`,

    // --- Theme Validation ---
    warn_invalid_theme: (themeName, supportedThemes, defaultTheme) =>
      `${WARN_PREFIX_EN} UserTheme ("${themeName}") is invalid or not in the supported list (${supportedThemes}). Using default theme "${defaultTheme}".`, // 使用了新的前缀

    // --- Astro Config Debug Info ---
    debug_active_theme_for_vite: (themeName) => `${DEBUG_PREFIX_EN} ACTIVE_THEME_NAME_FOR_VITE: ${themeName}`,
    debug_theme_resolve_path: (path) => `${DEBUG_PREFIX_EN} @THEME will resolve to: ${path}`,
  },
  cn: {
    // --- Astro Config Errors/Infos ---
    error_content_dir_not_found: `\n${ERROR_PREFIX_CN} 项目根目录没有 './content' 文件夹目录。`,
    info_content_dir_separation: `        我们实行用户内容和项目内容分离，以方便各自的维护工作。`,
    info_example_content_exists: `${INFO_PREFIX_CN} 存在 './example_content' 示例目录。`,
    info_example_content_usage: `        您可以把 './example_content' 复制或重命名为 './content' 之后，开始旅程...`,
    info_example_content_not_found: `${INFO_PREFIX_CN} './example_content' 示例目录未找到。请考虑手动创建 './content' 目录或重新克隆项目。`,
    error_site_config_not_found: (filePath) =>
      `\n${ERROR_PREFIX_CN} 未找到所需的配置文件 '${filePath}'。`,
    info_ensure_site_config_exists: `        请确保 'site.config.ts' 文件存在且位置正确。`,
    info_example_site_config_exists: `${INFO_PREFIX_CN} 在 './example_content/config/' 中存在示例 'site.config.ts'。`,
    info_copy_example_site_config: `        您可以考虑将其复制到 './content/config/'。`,
    info_example_site_config_not_found: `${INFO_PREFIX_CN} './example_content/config/' 中未找到示例 'site.config.ts'。您可能需要创建它，或者如果它是仓库的一部分，请运行 'git pull'。`,

    // --- Jiti Load Errors ---
    error_jiti_load_failed_title: (filePath) => `\n${ERROR_PREFIX_CN} 使用 jiti 加载并执行 "${filePath}" 失败。`,
    error_jiti_load_failed_ensure_file: `       请确保文件存在且是有效的 TypeScript/JavaScript。`,
    error_jiti_load_failed_original_error: (errorMessage) => `       原始错误: ${errorMessage}`,

    // --- Theme Validation ---
    warn_invalid_theme: (themeName, supportedThemes, defaultTheme) =>
      `${WARN_PREFIX_CN} UserTheme ("${themeName}") 无效或不在支持列表 (${supportedThemes}) 中。将使用默认主题 "${defaultTheme}"。`,

    // --- Astro Config Debug Info ---
    debug_active_theme_for_vite: (themeName) => `${DEBUG_PREFIX_CN} 用于 Vite 的激活主题名: ${themeName}`,
    debug_theme_resolve_path: (path) => `${DEBUG_PREFIX_CN} @THEME 将解析到: ${path}`,
  },
};

const SUPPORTED_CLI_LANGUAGES = Object.keys(messages);
const DEFAULT_CLI_LANG = "en";

function detectCliLanguage() {
  const envLang = process.env.LANG;

  if (!envLang) {
    return DEFAULT_CLI_LANG;
  }

  const langParts = envLang.toLowerCase().split(/[._-]/); // 按 ., _, - 分割并转小写
  const mainLangCode = langParts[0]; // 通常第一个部分是主要语言代码，如 'zh', 'en', 'fr'

  if (SUPPORTED_CLI_LANGUAGES.includes(mainLangCode)) {
    return mainLangCode;
  }

  if (mainLangCode === "zh" && SUPPORTED_CLI_LANGUAGES.includes("cn")) {
    return "cn";
  }

  return DEFAULT_CLI_LANG;
}

const currentLang = detectCliLanguage();

// --- 翻译函数 ---
/**
 * 获取翻译后的消息。
 * @param {string} key - 消息的键名。
 * @param {Record<string, any> | any[]} [args] - 如果消息是函数，传递给函数的参数。
 *                                                如果是对象，用于命名插值 (暂未实现，当前为函数参数)。
 *                                                如果是数组，按顺序传递给函数。
 * @returns {string} 翻译后的消息，或原始键名（如果找不到）。
 */
export function t(key, ...args) {
  const langMessages = messages[currentLang] || messages.en;
  const messageOrFn = langMessages[key] || messages.en[key];

  if (typeof messageOrFn === "function") {
    return messageOrFn(...args);
  }
  if (typeof messageOrFn === "string") {
    return messageOrFn;
  }
  if (process.env.NODE_ENV === 'development') {
      console.warn(`[I18N DEV WARNING] Missing translation for key: "${key}" in lang: "${currentLang}"`);
  }
  return key;
}
