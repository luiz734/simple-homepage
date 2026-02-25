import { z } from "zod";

export const ThemeSettingsSchema = z.object({
    light: z.string(),
    dark: z.string(),
    active: z.string(),
});

export type ThemeSettings = z.infer<typeof ThemeSettingsSchema>;

export const WidgetBorderSettingsSchema = z.object({
    useFromTheme: z.boolean(),
    valuePx: z.number(),
});
export type WidgetBorderSettings = z.infer<typeof WidgetBorderSettingsSchema>;

export const LayoutSettingsSchema = z.object({
    numberOfColumns: z.number(),
    gapX: z.number(),
    gapY: z.number(),
    widgetsBorder: WidgetBorderSettingsSchema
});

export type LayoutSettings = z.infer<typeof LayoutSettingsSchema>;

export const SettingsSchema = z.object({
    themes: ThemeSettingsSchema,
    layout: LayoutSettingsSchema,
})

export type Settings = z.infer<typeof SettingsSchema>;