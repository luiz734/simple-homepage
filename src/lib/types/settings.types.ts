import { z } from "zod";

export const ThemeSettingsSchema = z.object({
    light: z.string(),
    dark: z.string(),
    active: z.string(),
});

export type ThemeSettings = z.infer<typeof ThemeSettingsSchema>;

export const LayoutSettingsSchema = z.object({
    numberOfColumns: z.number(),
    gapX: z.number(),
    gapY: z.number(),
});

export type LayoutSettings = z.infer<typeof LayoutSettingsSchema>;

export const SettingsSchema = z.object({
    themes: ThemeSettingsSchema,
    layout: LayoutSettingsSchema,
})

export type Settings = z.infer<typeof SettingsSchema>;