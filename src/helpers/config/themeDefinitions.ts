import { validateTheme } from "@/helpers/lib/config";

export const THEME: string = validateTheme();

export const FIXED_TO_STICKY_THEMES = ["base"];
