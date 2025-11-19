import zh_CN from "./zh_CN";
import en_US from "./en_US";

export const cliMessages: Record<
  string,
  Record<string, string | ((arg?: any) => string)>
> = {
  zh_CN,
  en_US,
};

const LOG_LEVELS = {
  ERROR: { icon: "💥", color: "\u001b[31m" }, // Red
  WARNING: { icon: "⚠️", color: "\u001b[33m" }, // Yellow
  INFO: { icon: "ℹ️ ", color: "\u001b[34m" }, // Blue
  SUCCESS: { icon: "✅", color: "\u001b[32m" }, // Green
  DEBUG: { icon: "⚙️", color: "\u001b[36m" }, // Cyan
  VOLANTIS: { icon: "🚀", color: "\u001b[35m" },
  SAY: { icon: "📣", color: "\u001b[0m" },
} as const;

// 颜色重置代码
const RESET_COLOR = "\u001b[0m";

function detectCliLanguage(
  supported: string[],
  fallback: string = "en_US"
): string {
  const envLang = process.env.LANG;
  if (!envLang) return fallback;

  const langCodePart = envLang.split(".")[0];
  const parts = langCodePart.split(/[-_]/);

  let langKey = "";
  if (parts.length === 2) {
    langKey = `${parts[0].toLowerCase()}_${parts[1].toUpperCase()}`;
  } else {
    langKey = langCodePart.toLowerCase();
  }

  if (supported.includes(langKey)) return langKey;
  if (supported.includes(parts[0].toLowerCase())) return parts[0].toLowerCase();

  return fallback;
}

function createLogger() {
  const supported = Object.keys(cliMessages);
  const lang = detectCliLanguage(supported, "en_US");
  const dict = cliMessages[lang] || cliMessages["en_US"];

  function translate(key: string, arg?: any): string {
    const entry = dict[key];
    if (!entry) return key;
    if (typeof entry === "function") return entry(arg);
    return entry;
  }

  function format(level: keyof typeof LOG_LEVELS, msg?: string): string {
    const meta = LOG_LEVELS[level];

    const capitalizedLevel =
      level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();
    const totalPadding = 10 - capitalizedLevel.length;
    const leftPadding = Math.floor(totalPadding / 2);

    const paddedLevel = capitalizedLevel
      .padStart(capitalizedLevel.length + leftPadding, " ")
      .padEnd(10, " ");

    const formattedLevel = `[${paddedLevel}]`;

    return `${meta.icon} ${meta.color}${formattedLevel} ${
      msg || ""
    }${RESET_COLOR}`;
  }

  const logger = function (...args: any[]) {
    console.log(format("VOLANTIS", ...args));
  } as any;

  logger.info = (key: string, arg?: any) => {
    console.log(format("INFO", translate(key, arg)));
  };
  logger.warn = (key: string, arg?: any) => {
    console.warn(format("WARNING", translate(key, arg)));
  };
  logger.error = (key: string, arg?: any) => {
    console.error(format("ERROR", translate(key, arg)));
  };
  logger.success = (key: string, arg?: any) => {
    console.log(format("SUCCESS", translate(key, arg)));
  };
  logger.debug = (key: string, arg?: any) => {
    if (process.env.NODE_ENV === "development") {
      console.log(format("DEBUG", translate(key, arg)));
    }
  };
  logger.say = (...args: any[]) => {
    console.log(format("SAY", ...args));
  };
  logger.log = (...args: any[]) => {
    console.log(...args);
  };

  return logger;
}

export const Logger = createLogger();
