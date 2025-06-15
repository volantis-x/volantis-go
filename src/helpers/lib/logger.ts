import { LOG_LEVELS, LOG_DOMAINS, RESET_COLOR } from "./logger.meta";
import { messages as appMessages } from "@config/messages/app.messages";
import { messages as componentMessages } from "@config/messages/component.messages";
import { messages as configMessages } from "@config/messages/config.messages";

// --- 语言检测 ---
// 显式定义我们支持的语言代码，并确保 'en' 在其中
// TODO: 每次新加其他语言提示时，都需要来这里写进新的语言名称，后续看看如何改进
type SupportedCliLanguage = "en" | "cn"; // | 'ja' | 'fr' 等
const SUPPORTED_CLI_LANGUAGES: SupportedCliLanguage[] = ["en", "cn"]; // 这里的值同 SupportedCliLanguage 保持相同。
const DEFAULT_CLI_LANG: SupportedCliLanguage = "en";

const currentLang = ((): SupportedCliLanguage => {
  const envLang = (typeof process !== "undefined" && process.env?.LANG) || "en";

  if (!envLang) return DEFAULT_CLI_LANG;

  const mainLangCode = envLang.toLowerCase().split(/[._-]/)[0];

  // 优先匹配完整语言代码 (如果用户系统是 'cn'，而我们支持 'cn')
  if ((SUPPORTED_CLI_LANGUAGES as string[]).includes(mainLangCode)) {
    return mainLangCode as SupportedCliLanguage;
  }
  // 特定映射 (例如，系统是 'zh'，我们用 'cn')
  if (mainLangCode === "zh" && SUPPORTED_CLI_LANGUAGES.includes("cn")) {
    return "cn";
  }
  // ... 其他映射 ...
  return DEFAULT_CLI_LANG;
})();
// --- 语言检测结束 ---

// 定义单个语言的消息结构 (键是字符串，值是字符串或函数)
type LanguageMessages = Record<string, string | ((...args: any[]) => string)>;

// 定义一个消息源必须包含 'en' (以及可选的其他语言)
interface MessageSourceSchema {
  en: LanguageMessages;
  cn?: LanguageMessages; // 中文是可选的
  [lang: string]: LanguageMessages | undefined; // 允许其他语言，但 en 是必须的
}

const allMessages = {
  APP: appMessages as MessageSourceSchema,
  COMPONENT: componentMessages as MessageSourceSchema,
  CONFIG: configMessages as MessageSourceSchema,
  // API: apiMessages as MessageSourceSchema,
} as const;

type LogDomain = keyof typeof allMessages;

// 为每个领域的消息键创建联合类型
type AppMessageKey = keyof typeof appMessages.en; // 或者 typeof appMessages[keyof typeof appMessages]
type ComponentMessageKey = keyof typeof componentMessages.en;
type ConfigMessageKey = keyof typeof configMessages.en;

// 创建一个映射类型，将 LogDomain 映射到其对应的 MessageKey 类型
type DomainMessageKeys = {
  APP: AppMessageKey;
  COMPONENT: ComponentMessageKey;
  CONFIG: ConfigMessageKey;
};

// --- 内部翻译函数 _t，现在返回一个包含消息和实际使用语言的对象 ---
interface TranslationResult {
  message: string;
  usedLang: SupportedCliLanguage;
}

// --- 这个仅内部使用 ---
function _t<D extends LogDomain>(
  domain: D,
  key: DomainMessageKeys[D],
  ...args: any[]
): TranslationResult {
  const messageSource = allMessages[domain]; // 类型是 MessageSourceSchema

  let langToUse: SupportedCliLanguage = currentLang;
  let langMessages = messageSource[currentLang]; // 类型是 LanguageMessages | undefined

  // 1. 尝试获取当前检测语言的消息定义
  let messageDefinition = langMessages?.[key as any]; // 使用可选链

  // 2. 如果当前语言没有这个键，或者当前语言的整个消息块都不存在，则回退到英文
  if (messageDefinition === undefined) {
    langToUse = "en";
    messageDefinition = messageSource.en[key as any];
  }

  const messageOrFn = messageDefinition;

  let finalMessage: string;
  if (typeof messageOrFn === "function") {
    finalMessage = messageOrFn(...args);
  } else if (typeof messageOrFn === "string") {
    finalMessage = messageOrFn;
  } else {
    // 如果连英文回退都没有找到键
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `   🚀 \u001b[33m[ I18N DEV WARNING ]\u001b[0m Missing translation for key: "${domain}.${String(key)}" in lang: "${currentLang}" (and also in default 'en')`,
      );
    }
    finalMessage = `${domain}.${String(key)}`;
  }
  return { message: finalMessage, usedLang: langToUse };
}

// --- 内部日志函数 _log ---
function _log(options: {
  level: keyof typeof LOG_LEVELS;
  message: string;
  domain?: LogDomain;
  usedLang?: SupportedCliLanguage;
}) {
  const { level, message, domain, usedLang } = options;

  const levelMeta = LOG_LEVELS[level];
  if (!levelMeta) {
    console.log(message);
    return;
  }

  let prefixContent = "";
  // 如果 usedLang 未提供 (例如在 VOLANTIS 调用中)，则回退到全局 currentLang
  // 这确保了即使是 VOLANTIS 级别，如果其前缀将来需要语言，也能获取到
  const langForPrefix = usedLang || currentLang;
  const langIdentifier = langForPrefix.toUpperCase();

  if (level === "VOLANTIS") {
    // 你选择的 VOLANTIS 特殊前缀格式
    prefixContent = `${levelMeta.color}[ ${level} Tips ]${RESET_COLOR}`;
    // 或者，如果也想包含语言：
    // prefixContent = `${levelMeta.color}[ ${level} Tips ${langIdentifier} ]${RESET_COLOR}`;
  } else {
    const domainMeta = domain ? LOG_DOMAINS[domain] : null;
    const domainIcon = domainMeta ? `${domainMeta.icon} ` : "";
    const domainLabel = domainMeta ? `${domainMeta.label} ` : "";
    prefixContent = `${domainIcon}${levelMeta.color}[ ${domainLabel}${level} ${langIdentifier} ]${RESET_COLOR}`;
  }

  const prefix = `   ${levelMeta.icon} ${prefixContent} `;

  switch (level) {
    case "ERROR":
      console.error(prefix + message);
      break;
    case "WARNING":
      console.warn(prefix + message);
      break;
    default:
      console.log(prefix + message);
      break;
  }
}

type LoggerFunction = {
  /**
   * Logs a message with the default 'VOLANTIS' style and icon.
   * This is a general purpose log for project-specific, non-critical information.
   *
   * @param message The raw string message to log.
   *
   * @example
   * Logger("Project initialization complete.");
   * // Output (example with CN lang):
   * //    🚀 [VOLANTIS Tips CN]: Project initialization complete.
   */
  (message: string): void;

  /**
   * Logs an ERROR level message for a specific domain.
   * Uses the '❌' icon and red color.
   * The messageKey will be translated based on the current language.
   *
   * @template D - A valid LogDomain (e.g., 'APP', 'COMPONENT', 'CONFIG').
   * @param {D} domain - The domain of the log message.
   * @param {DomainMessageKeys[D]} messageKey - The key for the message in the respective domain's message catalog.
   * @param {...any} messageArgs - Arguments to be passed to the message template function associated with the messageKey.
   *
   * @example
   * Logger.error('CONFIG', 'error_content_dir_not_found');
   * // Output (example with CN lang for 'CONFIG' domain):
   * //    ❌ 🔧 [CONFIG ERROR CN]: 项目根目录没有 './content' 文件夹目录。
   */
  error: <D extends LogDomain>(
    domain: D,
    messageKey: DomainMessageKeys[D],
    ...messageArgs: any[]
  ) => void;

  /**
   * Logs a WARNING level message for a specific domain.
   * Uses the '⚠️' icon and yellow color.
   * The messageKey will be translated.
   *
   * @template D - A valid LogDomain.
   * @param {D} domain - The domain of the log message.
   * @param {DomainMessageKeys[D]} messageKey - The key for the message.
   * @param {...any} messageArgs - Arguments for the message template.
   */
  warn: <D extends LogDomain>(
    domain: D,
    messageKey: DomainMessageKeys[D],
    ...messageArgs: any[]
  ) => void;

  /**
   * Logs an INFO level message for a specific domain.
   * Uses the 'ℹ️' icon and blue color.
   * The messageKey will be translated.
   *
   * @template D - A valid LogDomain.
   * @param {D} domain - The domain of the log message.
   * @param {DomainMessageKeys[D]} messageKey - The key for the message.
   * @param {...any} messageArgs - Arguments for the message template.
   */
  info: <D extends LogDomain>(
    domain: D,
    messageKey: DomainMessageKeys[D],
    ...messageArgs: any[]
  ) => void;

  /**
   * Logs a SUCCESS level message for a specific domain.
   * Uses the '✅' icon and green color.
   * The messageKey will be translated.
   *
   * @template D - A valid LogDomain.
   * @param {D} domain - The domain of the log message.
   * @param {DomainMessageKeys[D]} messageKey - The key for the message.
   * @param {...any} messageArgs - Arguments for the message template.
   */
  success: <D extends LogDomain>(
    domain: D,
    messageKey: DomainMessageKeys[D],
    ...messageArgs: any[]
  ) => void;

  /**
   * Logs a DEBUG level message for a specific domain.
   * Uses the '⚙️' icon and cyan color.
   * Output is conditional based on NODE_ENV or DEBUG_ASTRO_CONFIG.
   * The messageKey will be translated.
   *
   * @template D - A valid LogDomain.
   * @param {D} domain - The domain of the log message.
   * @param {DomainMessageKeys[D]} messageKey - The key for the message.
   * @param {...any} messageArgs - Arguments for the message template.
   */
  debug: <D extends LogDomain>(
    domain: D,
    messageKey: DomainMessageKeys[D],
    ...messageArgs: any[]
  ) => void;

  /**
   * Logs a message with a custom icon and no standard prefixing.
   * Useful for welcome messages or special announcements.
   *
   * @param {string} icon - The emoji or text icon to display.
   * @param {string} message - The raw string message to log.
   *
   * @example
   * Logger.say('🚀', "Volantis GO!");
   * // Output:
   * //    🚀  Volantis GO!!
   */
  say: (icon: string, message: string) => void;
};

// --- 创建 Logger 实例 ---
const loggerInstance: LoggerFunction = (message: string) => {
  _log({ level: "VOLANTIS", message });
};

// --- 附加方法到实例上 ---
loggerInstance.error = <D extends LogDomain>(
  domain: D,
  key: DomainMessageKeys[D],
  ...args: any[]
) => {
  const translation = _t(domain, key, ...args);
  _log({
    level: "ERROR",
    domain,
    message: translation.message,
    usedLang: translation.usedLang,
  });
};

loggerInstance.warn = <D extends LogDomain>(
  domain: D,
  key: DomainMessageKeys[D],
  ...args: any[]
) => {
  const translation = _t(domain, key, ...args);
  _log({
    level: "WARNING",
    domain,
    message: translation.message,
    usedLang: translation.usedLang,
  });
};

loggerInstance.info = <D extends LogDomain>(
  domain: D,
  key: DomainMessageKeys[D],
  ...args: any[]
) => {
  const translation = _t(domain, key, ...args);
  _log({
    level: "INFO",
    domain,
    message: translation.message,
    usedLang: translation.usedLang,
  });
};

loggerInstance.success = <D extends LogDomain>(
  domain: D,
  key: DomainMessageKeys[D],
  ...args: any[]
) => {
  const translation = _t(domain, key, ...args);
  _log({
    level: "SUCCESS",
    domain,
    message: translation.message,
    usedLang: translation.usedLang,
  });
};

loggerInstance.debug = <D extends LogDomain>(
  domain: D,
  key: DomainMessageKeys[D],
  ...args: any[]
) => {
  if (process.env.NODE_ENV === "development") {
    const translation = _t(domain, key, ...args);
    _log({
      level: "DEBUG",
      domain,
      message: translation.message,
      usedLang: translation.usedLang,
    });
  }
};
loggerInstance.say = (icon, message) => console.log(`   ${icon}  ${message}`);

/**
 * Volantis GO Logger for consistent and internationalized console output.
 *
 * @example
 * // Default call (VOLANTIS level, no domain)
 * Logger("Project setup starting...");
 * // Output:
 * //    🚀 [VOLANTIS Tips ]: Project setup starting...
 *
 * // Specific level and domain call (translates message key)
 * Logger.error('CONFIG', 'error_content_dir_not_found');
 * // Output (example with EN lang for 'CONFIG' domain and 'error_content_dir_not_found' key):
 * //    ❌ 🔧 [CONFIG ERROR EN]: Required directory './content' not found.
 *
 * Logger.warn('COMPONENT', 'warn_topnav_requires_two_elements');
 * // Output (example with EN lang for 'COMPONENT' domain):
 * //    ⚠️ 📦 [COMPONENT WARNING EN]: Component 'TopNav': The current theme requires at least two visible elements...
 *
 * // Fun "say" method with custom icon
 * Logger.say('👋', "Welcome to Volantis GO!");
 * // Output:
 * //    👋  Welcome to Volantis GO!
 *
 * @param {string} message - For default call: The message string to log (will be INFO level).
 */
export const Logger = loggerInstance;
