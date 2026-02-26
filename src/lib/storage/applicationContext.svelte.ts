import gridHelp from "svelte-grid/src/utils/helper.js";
import { defaultConfig } from "./defaultSettings.svelte.js";
import { InternalWidget, Settings } from "../types";
import { settingsManager } from "./SettingsReadWriter";
import { WidgetsManager } from "./widgetsManager";

class StorageState {
    widgets: InternalWidget[];
    settings: Settings;
}

const createId = (): string => "_" + Math.random().toString(36).substr(2, 9);

export class ApplicationContextSvelte {
    widgetsManager = new WidgetsManager([]);
    settings = $state<Settings>();

    get libraryFormatWidgets(): any {
        const columns = this.settings.layout.numberOfColumns;
        return this.widgetsManager.getLibraryFormat(columns);
    }

    set libraryFormatWidgets(updatedLibraryWidgets: any[]) {
        const columns = this.settings.layout.numberOfColumns;
        this.widgetsManager.setLibraryFormat(updatedLibraryWidgets, columns);
    }

    // Undo/Redo state
    previousSettings = $state<Settings | null>(null);

    isLoaded = $state<boolean>(false);

    constructor() {
        $effect(() => {
            if (!this.isLoaded) return;

            // Trigger the effect by reading signals
            $state.snapshot(this.widgetsManager.widgets);
            $state.snapshot(this.settings);

            const currentSettings = $state.snapshot(this.settings);
            const currentWidgets = $state.snapshot(this.widgetsManager.widgets);

            settingsManager.writeDebounced(currentSettings, currentWidgets);
        });
    }

    async loadStorageOrDefault(): Promise<void> {
        try {
            const data = await settingsManager.loadFromStorage();
            this.settings = data.settings;
            this.widgetsManager.widgets = data.widgets;
        } catch (error) {
            console.warn("Using default settings values");
            this.settings = defaultConfig.settings;
            this.widgetsManager.widgets = defaultConfig.widgets;
        } finally {
            this.isLoaded = true;
        }
    }

    setWidgetsLock(isLocked: boolean): void {
        this.widgetsManager.setLockState(isLocked);
    }

    async importStateFromJsonString(jsonString: string): Promise<void> {
        try {
            const data = await settingsManager.loadFromRawJson(jsonString);
            this.settings = data.settings;
            this.widgetsManager.widgets = data.widgets;
        } catch (error) {
            console.error(error);
            console.warn("Using default settings values");
            this.settings = defaultConfig.settings;
            this.widgetsManager.widgets = defaultConfig.widgets;
        } finally {
            this.isLoaded = true;
        }

        console.log("State successfully updated from import.");
    }

    exportJsonBlob(): Blob {
        const object: StorageState = {
            widgets: this.widgetsManager.widgets,
            settings: this.settings,
        };
        const jsonString = JSON.stringify(object, null, 2);
        return new Blob([jsonString], { type: "application/json" });
    }

    saveSnapshot(): void {
        this.widgetsManager.state.saveSnapshot();
        this.previousSettings = $state.snapshot(this.settings);
    }

    restoreSnapshot(): void {
        if (this.previousSettings === null) {
            console.error("Can't restore invalid snapshot");
            return;
        }
        this.widgetsManager.state.restoreSnapshot();
        this.settings = $state.snapshot(this.previousSettings);
    }

    clearSnapshot(): void {
        this.widgetsManager.state.clearSnapshot();
        this.previousSettings = null;
    }

    toggleActiveTheme(): void {
        if (!this.settings) return;

        const light = this.settings.themes.light;
        const dark = this.settings.themes.dark;
        const active = this.settings.themes.active;

        this.settings.themes.active = active === light ? dark : light;
    }

    addWidget(widgetType: string): void {
        const columns = this.settings.layout.numberOfColumns;
        this.widgetsManager.addWidget(widgetType, columns);
    }
}

export const APPLICATION_KEY = Symbol("mookbark");
