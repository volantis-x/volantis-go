/**
 * 标准化 URL (强制目录模式 / 尾部斜杠)
 * @param url 原始 URL (可以是路径，也可以是完整链接)
 * @returns 规范化后的 URL
 */
export function normalizeUrl(url: string): string {
  if (!url) return "";

  // 1. 跳过外部链接、锚点、协议相关链接
  if (
    url.startsWith("http") ||
    url.startsWith("//") ||
    url.startsWith("#") ||
    url.startsWith("mailto:") ||
    url.startsWith("tel:")
  ) {
    return url;
  }

  // 2. 移除查询参数 (?) 和哈希 (#) 以便判断扩展名
  const [pathStr] = url.split(/[?#]/);

  // 3. 核心逻辑：如果不是以 / 结尾，且不是文件资源(无后缀)，则补上 /
  if (
    url !== "/" &&
    !url.endsWith("/") &&
    !pathStr.split("/").pop()?.includes(".")
  ) {
    return `${url}/`;
  }

  return url;
}
