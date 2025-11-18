export const cliMessages: Record<string, string | ((key: any) => string)> = {
  content_dir_not_found: `项目根目录没有 './content' 文件夹目录。`,
  content_dir_separation: `   ⤷ 我们实行用户内容和项目内容分离，以方便各自的维护工作。`,
  example_content_exists: `存在 './example_content' 示例目录。`,
  example_content_usage: `   ⤷ 您可以把 './example_content' 复制或重命名为 './content' 之后，开始旅程...`,
  example_content_not_found: `'./example_content' 示例目录未找到。请考虑手动创建 './content' 目录或重新克隆项目。`,
};

export default cliMessages;
