import { validateTheme } from "@/helpers/lib/config";

export const THEME: string = validateTheme();

export const STICKY_TO_FIXED_THEMES = ["base"];
