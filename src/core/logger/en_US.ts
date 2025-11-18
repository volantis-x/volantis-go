export const cliMessages: Record<string, string | ((key: any) => string)> = {
  content_dir_not_found: `Required directory './content' not found.`,
  content_dir_separation: `   ⤷ This project separates user content from the main project files.`,
  example_content_exists: `An './example_content' directory exists.`,
  example_content_usage: `   ⤷ You can copy or rename './example_content' to './content' to get started...`,
  example_content_not_found: `The './example_content' directory was not found. Consider creating './content' manually or cloning the project.`,
};

export default cliMessages;
