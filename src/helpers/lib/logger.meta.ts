// 日志级别的元数据
export const LOG_LEVELS = {
  ERROR: { icon: "❌", color: "\u001b[31m" }, // Red
  WARNING: { icon: "⚠️", color: "\u001b[33m" }, // Yellow
  INFO: { icon: "ℹ️", color: "\u001b[34m" }, // Blue
  SUCCESS: { icon: "✅", color: "\u001b[32m" }, // Green
  DEBUG: { icon: "⚙️", color: "\u001b[36m" }, // Cyan
  VOLANTIS: { icon: '🚀', color: '\u001b[35m' },
} as const;

// 日志领域的元数据
export const LOG_DOMAINS = {
  APP: { icon: "🚀", label: "App" },
  THEME: { icon: "🎨", label: "Theme" },
  CONFIG: { icon: "🔧", label: "Config" },
  COMPONENT: { icon: "📦", label: "Component" },
  API: { icon: "📡", label: "API" },
  BUILD: { icon: "🏗️", label: "Build" },
} as const;

// 颜色重置代码
export const RESET_COLOR = "\u001b[0m";
