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
    widgetsBorder: WidgetBorderSettingsSchema,
    rowHeight: z.number(),
});

export type LayoutSettings = z.infer<typeof LayoutSettingsSchema>;

export const AppearanceSettingsSchema = z.object({
    widgetBlurPx: z.number(),
    widgetOpacity: z.number(),
})
export type AppearanceSettings = z.infer<typeof AppearanceSettingsSchema>;


export const WallpaperSettingsVariantSchema = z.object({
    url: z.string(),
    color: z.string(),
    opacity: z.number(),
});
export type WallpaperSettingsVariant = z.infer<typeof WallpaperSettingsVariantSchema>;

export const WallpaperSettingsSchema = z.object({
    light: WallpaperSettingsVariantSchema,
    dark: WallpaperSettingsVariantSchema,
});

export type WallpaperSettings = z.infer<typeof WallpaperSettingsSchema>;


export const SettingsSchema = z.object({
    themes: ThemeSettingsSchema,
    layout: LayoutSettingsSchema,
    appearance: AppearanceSettingsSchema,
    wallpaper: WallpaperSettingsSchema,
});

export type Settings = z.infer<typeof SettingsSchema>;