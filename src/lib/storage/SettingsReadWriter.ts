import { blobStorageAdapter, storageAdapter as storage } from "./storageAdapterAPI.svelte";
import { InternalWidget, Settings, SettingsSchema } from "../types";
import { InternalWidgetArraySchema } from "../types/widget.types";

const IMAGE_KEY = "mookbark_userWallpaper";

class SettingsReadWriter {
    #saveTimeout: ReturnType<typeof setTimeout> | null = null;

    private constructor() {}

    private static instance: SettingsReadWriter;

    public static getInstance(): SettingsReadWriter {
        if (!SettingsReadWriter.instance) {
            SettingsReadWriter.instance = new SettingsReadWriter();
        }
        return SettingsReadWriter.instance;
    }

    private validateData(
        settingsData: unknown,
        widgetsData: unknown,
    ): { settings: Settings; widgets: InternalWidget[] } {
        const settingsResult = SettingsSchema.safeParse(settingsData);

        if (!settingsResult.success) {
            console.warn("Invalid configuration format:", settingsResult.error);
            throw new Error("Settings validation failed.");
        }

        const widgetsResult = InternalWidgetArraySchema.safeParse(widgetsData);
        if (!widgetsResult.success) {
            console.error("Invalid widgets format:", widgetsResult.error);
            throw new Error("Widgets validation failed.");
        }

        return {
            settings: settingsResult.data,
            widgets: widgetsResult.data,
        };
    }

    async loadFromStorage(): Promise<{
        settings: Settings;
        widgets: InternalWidget[];
    }> {
        const settingsData = await storage.get(["settings"]);
        const widgetsData = await storage.get(["widgets"]);

        if (settingsData && widgetsData) {
            return this.validateData(
                settingsData["settings"],
                widgetsData["widgets"],
            );
        } else {
            throw new Error(
                "Unable to load from storage. Creating new one using default storage",
            );
        }
    }

    async loadFromRawJson(
        jsonString: string,
    ): Promise<{ settings: Settings; widgets: InternalWidget[] }> {
        const parsedData = JSON.parse(jsonString);
        return this.validateData(parsedData.settings, parsedData.widgets);
    }

    writeDebounced(
        currentSettings: Settings,
        currentWidgets: InternalWidget[],
    ): void {
        if (this.#saveTimeout) {
            clearTimeout(this.#saveTimeout);
        }
        this.#saveTimeout = setTimeout(() => {
            this.write(currentSettings, currentWidgets);
        }, 1000);
    }

    async write(
        currentSettings: Settings,
        currentWidgets: InternalWidget[],
    ): Promise<void> {
        await storage.set({
            widgets: currentWidgets,
            settings: currentSettings,
        });
    }


    async getUserWallpaper(): Promise<String> {
        const storedBlob = await blobStorageAdapter.get([IMAGE_KEY]);
        const imageBlob = storedBlob[IMAGE_KEY];

        if (!imageBlob) {
            throw new Error("No wallpaper image found.");
        }

        return URL.createObjectURL(imageBlob);
    }

    async setUserWallpaper(imageBlob: Blob): Promise<void> {
        try {
            await blobStorageAdapter.set({
                [IMAGE_KEY]: imageBlob
            });
            console.log("Wallpaper saved successfully.");
        } catch (error) {
            console.error("Failed to save wallpaper to IndexedDB:", error);
        }
    }

    async removeUserWallpaper(): Promise<void> {
        try {
            await blobStorageAdapter.remove([IMAGE_KEY]);
            console.log("Wallpaper removed successfully.");
        } catch (error) {
            console.error("Failed to remove wallpaper:", error);
        }
    }
}

export const settingsReadWrite = SettingsReadWriter.getInstance();
