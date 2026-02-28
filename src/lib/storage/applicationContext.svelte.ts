import gridHelp from "svelte-grid/src/utils/helper.js";
import { defaultConfig } from "./defaultSettings.svelte.js";
import { InternalWidget, Settings } from "../types";
import { settingsReadWrite } from "./SettingsReadWriter";
import { WidgetsManager } from "./widgetsManager";
import { SettingsManager } from "./settingsManager";

class StorageState {
    widgets: InternalWidget[];
    settings: Settings;
}

const createId = (): string => "_" + Math.random().toString(36).substr(2, 9);

export class ApplicationContextSvelte {
    widgetsManager = new WidgetsManager([]);
    settingsManager = new SettingsManager();


    get libraryFormatWidgets(): any {
        const columns = this.settingsManager.numberOfColumns();
        return this.widgetsManager.getLibraryFormat(columns);
    }

    set libraryFormatWidgets(updatedLibraryWidgets: any[]) {
        const columns = this.settingsManager.numberOfColumns();
        this.widgetsManager.setLibraryFormat(updatedLibraryWidgets, columns);
    }

    isLoaded = $state<boolean>(false);

    constructor() {
        $effect(() => {
            if (!this.isLoaded) return;

            // Trigger the effect by reading signals
            $state.snapshot(this.widgetsManager.widgets);
            $state.snapshot(this.settingsManager.settings);

            const currentSettings = $state.snapshot(this.settingsManager.settings);
            const currentWidgets = $state.snapshot(this.widgetsManager.widgets);

            settingsReadWrite.writeDebounced(currentSettings, currentWidgets);
        });
    }

    async loadStorageOrDefault(): Promise<void> {
        try {
            const data = await settingsReadWrite.loadFromStorage();
            this.settingsManager.settings = data.settings;
            this.widgetsManager.widgets = data.widgets;
        } catch (error) {
            console.warn("Using default settings values");
            this.settingsManager.settings = defaultConfig.settings;
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
            const data = await settingsReadWrite.loadFromRawJson(jsonString);
            this.settingsManager.settings = data.settings;
            this.widgetsManager.widgets = data.widgets;
        } catch (error) {
            console.error(error);
            console.warn("Using default settings values");
            this.settingsManager.settings = defaultConfig.settings;
            this.widgetsManager.widgets = defaultConfig.widgets;
        } finally {
            this.isLoaded = true;
        }

        console.log("State successfully updated from import.");
    }

    exportJsonBlob(): Blob {
        const object: StorageState = {
            widgets: this.widgetsManager.widgets,
            settings: this.settingsManager.settings,
        };
        const jsonString = JSON.stringify(object, null, 2);
        return new Blob([jsonString], { type: "application/json" });
    }

    saveSnapshot(): void {
        this.widgetsManager.state.saveSnapshot();
        this.settingsManager.state.saveSnapshot();
    }

    restoreSnapshot(): void {
        this.widgetsManager.state.restoreSnapshot();
        this.settingsManager.state.restoreSnapshot();
    }

    clearSnapshot(): void {
        this.widgetsManager.state.clearSnapshot();
        this.settingsManager.state.clearSnapshot();
    }

    toggleActiveTheme(): void {
        this.settingsManager.toggleActiveTheme();
    }

    addWidget(widgetType: string): void {
        const columns = this.settingsManager.numberOfColumns();
        this.widgetsManager.addWidget(widgetType, columns);
    }
}

export const APPLICATION_KEY = Symbol("mookbark");
