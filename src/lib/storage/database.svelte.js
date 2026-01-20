import gridHelp from "svelte-grid/src/utils/helper.js";
import { defaultConfig, defaultItemsProps } from "./defaultSettings.svelte.js";
import { storageAdapter as storage } from "./storageAdapter.svelte.js";

const createId = () => "_" + Math.random().toString(36).substr(2, 9);


export class ApplicationState {
    // Saved in storage
    widgets = $state();
    settings = $state();

    // Allow undo action
    previousWidgets = $state(null);
    previousSettings = $state(null);

    isLoaded = $state(false);
    #saveTimeout = null;

    constructor() {
        $effect(() => {
            if (!this.isLoaded) return;

            // Trigger the effect
            $state.snapshot(this.widgets);
            $state.snapshot(this.settings);

            // We use a debouncing pattern to save changes after 1 second
            // This ensures to minimize calls to the chrome storage API
            this.scheduleSave();
        });
    }
    scheduleSave() {
        if (this.#saveTimeout) {
            clearTimeout(this.#saveTimeout);
        }
        this.#saveTimeout = setTimeout(() => {
            this.persistData();
        }, 1000);
    }

    async persistData() {
        const plainWidgets = $state.snapshot(this.widgets);
        const plainSettings = $state.snapshot(this.settings);

        await storage.set({ widgets: plainWidgets, settings: plainSettings });
        console.log("Storage updated (Debounced)");
        this.#saveTimeout = null;
    }

    async loadStorageOrDefault() {
        // Both returns object the correspondent key
        // So to access the data we use somethingData.something
        const widgetsData = await storage.get(["widgets"]);
        const settingsData = await storage.get(["settings"]);

        const storageWidgetsIsValid =
            widgetsData &&
            widgetsData.widgets &&
            Array.isArray(widgetsData.widgets);
        const storageSettingsIsValid =
            settingsData &&
            settingsData.settings &&
            !Array.isArray(settingsData.settings);
        // console.log(widgetsData);

        this.widgets = storageWidgetsIsValid
            ? widgetsData.widgets
            : defaultConfig.widgets;
        this.settings = storageSettingsIsValid
            ? settingsData.settings
            : defaultConfig.settings;

        // console.log($state.snapshot(this.widgets));
        this.isLoaded = true;
    }

    addWidget(type) {
        const id = createId();
        let newWidget = {
            id: id,
            type,
            6: gridHelp.item({
                x: 0,
                y: 0,
                w: 1,
                h: 2,
                ...defaultItemsProps,
            }),
            data: {
                title: "Widget " + id,
                color: "#1d4ed8",
                links: [],
            },
        };

        let findOutPosition = gridHelp.findSpace(newWidget, this.widgets, 6);
        newWidget = {
            ...newWidget,
            6: {
                ...newWidget[6],
                ...findOutPosition,
            },
        };
        this.widgets.push(newWidget);
    }

    updateWidgets(widgets) {
        this.widgets = widgets;
    }


    importState(importedData) {
        if (!importedData) {
            console.error(`Missing imported data for ${importedData}`);
            return;
        }

        // Create missing entries if necessary
        this.widgets =
            importedData.widgets === null
                ? defaultConfig.widgets
                : importedData.widgets;
        this.settings =
            importedData.settings === null
                ? defaultConfig.settings
                : importedData.settings;

        console.log("State successfully updated from import.");
    }

    exportJsonBlob() {
        const object = {
            widgets: this.widgets ? this.widgets : defaultConfig.widgets,
            settings: this.settings ? this.settings : defaultConfig.settings,
        };
        const jsonString = JSON.stringify(object, null, 2);
        return new Blob([jsonString], { type: "application/json" });
    }

    saveSnapshot() {
        this.previousWidgets = $state.snapshot(this.widgets);
        this.previousSettings = $state.snapshot(this.settings);
    }
    restoreSnapshot() {
        if (this.previousWidgets === null || this.previousSettings === null) {
            console.error("Can't restore invalid snapshot");
            return;
        }

        this.widgets = $state.snapshot(this.previousWidgets);
        this.settings = $state.snapshot(this.previousSettings);
    }
    clearSnapshot() {
        this.previousWidgets = null;
        this.previousSettings = null;
    }

    toggleActiveTheme() {
        const light = this.settings.themes.light;
        const dark = this.settings.themes.dark;
        const active = this.settings.themes.active;

        this.settings.themes.active = active === light ? dark : light;
    }
}

export const APPLICATION_KEY = Symbol("mookbark");
