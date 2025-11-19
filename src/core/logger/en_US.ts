export const cliMessages: Record<string, string | ((key: any) => string)> = {
  // --- Astro Config Errors/Infos ---
  Astro_Config_content_dir_not_found_error: `The './content' directory was not found in the project root.`,
  Astro_Config_content_dir_separation: `   ⤷ We keep user content separate from project source for easier maintenance.`,
  Astro_Config_example_content_exists: `Found the example directory './example_content'.`,
  Astro_Config_example_content_usage: `   ⤷ You can copy or rename it to './content' to get started.`,
  Astro_Config_example_content_not_found: `The './example_content' directory was not found. Please create the './content' directory manually or re-clone the project.`,
  Astro_Config_site_config_not_found_error: (filePath) =>
    `Required configuration file '${filePath}' not found.`,
  Astro_Config_ensure_site_config_exists: `   ⤷ Please ensure the 'site.config.ts' file exists and is in the correct location.`,
  Astro_Config_example_site_config_exists: `Found an example 'site.config.ts' in './example_content/config/'.`,
  Astro_Config_copy_example_site_config: `   ⤷ You can copy it to './content/config/'.`,
  Astro_Config_example_site_config_not_found: `Example 'site.config.ts' not found in './example_content/config/'. If you haven't made custom changes, please run 'git pull' to sync the latest example files.`,
  Astro_Config_load_failed_title_error: (filePath) =>
    `Failed to dynamically import "${filePath}" with TypeScript.`,
  Astro_Config_load_failed_ensure_file_error: `   ⤷ Please ensure the file exists and is valid TypeScript/JavaScript.`,
  Astro_Config_load_failed_original_error: (e) => `   ⤷ Original error: ${e}`,
};

export default cliMessages;
