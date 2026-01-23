import gridHelp from "svelte-grid/src/utils/helper.js";
import { defaultConfig, defaultItemsProps } from "./defaultSettings.svelte.js";
import { storageAdapter as storage } from "./storageAdapter.svelte.js";

// --- Interfaces ---

interface Link {
    name: string;
    url: string;
}

interface InternalWidget {
    id: string | number;
    type: string;

    // Optional props often managed by gridHelp or defaults
    fixed?: boolean;
    resizable?: boolean;
    draggable?: boolean;

    // Positioning (can be root level or nested depending on grid lib version)
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    minimumWidth?: number;
    minimumHeight?: number;

    readonly customResizer?: boolean;
    readonly customDragger?: boolean;

    data: Record<string, any>;

    // Index signature to allow svelte-grid column keys (e.g., "6": { ... })
    [key: number]: any;
}

interface ExternalLibraryWidget {
    id: string | number;
    type: string;

    // Optional props often managed by gridHelp or defaults
    fixed?: boolean;
    resizable?: boolean;
    draggable?: boolean;

    // Positioning (can be root level or nested depending on grid lib version)
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    minimumWidth?: number;
    minimumHeight?: number;

    readonly customResizer?: boolean;
    readonly customDragger?: boolean;

    data: Record<string, any>;
    [key: number]: any;
}

interface ThemeSettings {
    light: string;
    dark: string;
    active: string;
}

interface LayoutSettings {
    numberOfColumns: number;
}

interface Settings {
    themes: ThemeSettings;
    layout: LayoutSettings;
}

interface StorageData {
    widgets?: InternalWidget[];
    settings?: Settings;
}

// --- Implementation ---

const createId = (): string => "_" + Math.random().toString(36).substr(2, 9);

export class ApplicationContextSvelte {
    // State initialization
    widgets = $state<InternalWidget[]>([]);
    settings = $state<Settings>();

    // Undo/Redo state
    previousWidgets = $state<InternalWidget[] | null>(null);
    previousSettings = $state<Settings | null>(null);

    isLoaded = $state<boolean>(false);
    #saveTimeout: ReturnType<typeof setTimeout> | null = null;

    constructor() {
        $effect(() => {
            if (!this.isLoaded) return;

            // Trigger the effect by reading signals
            $state.snapshot(this.widgets);
            $state.snapshot(this.settings);

            // Debounce save
            this.scheduleSave();
        });
    }

    scheduleSave(): void {
        if (this.#saveTimeout) {
            clearTimeout(this.#saveTimeout);
        }
        this.#saveTimeout = setTimeout(() => {
            this.persistData();
        }, 1000);
    }

    async persistData(): Promise<void> {
        // Create clean snapshots for storage
        const plainWidgets = $state.snapshot(this.widgets);
        const plainSettings = $state.snapshot(this.settings);

        await storage.set({ widgets: plainWidgets, settings: plainSettings });
        console.log("Storage updated (Debounced)");
        this.#saveTimeout = null;
    }

    async loadStorageOrDefault(): Promise<void> {
        // storage.get returns generic objects, we cast them implicitly or validate
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

        this.widgets = storageWidgetsIsValid
            ? (widgetsData.widgets as InternalWidget[])
            : (defaultConfig.widgets as InternalWidget[]);

        this.settings = storageSettingsIsValid
            ? (settingsData.settings as Settings)
            : (defaultConfig.settings as Settings);

        this.isLoaded = true;
    }

    addWidget(type: string): void {
        const id = createId();

        let newWidget: InternalWidget = {
            id: id,
            type,
            // 6 is the specific column configuration for svelte-grid
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

        // gridHelp.findSpace is untyped, returns layout object
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

    updateWidgets(widgets: InternalWidget[]): void {
        this.widgets = widgets;
    }

    importState(importedData: StorageData): void {
        if (!importedData) {
            console.error(`Missing imported data`);
            return;
        }

        // Create missing entries if necessary using default fallback
        this.widgets =
            importedData.widgets == null
                ? (defaultConfig.widgets as InternalWidget[])
                : importedData.widgets;

        this.settings =
            importedData.settings == null
                ? (defaultConfig.settings as Settings)
                : importedData.settings;

        console.log("State successfully updated from import.");
    }

    exportJsonBlob(): Blob {
        const object: StorageData = {
            widgets: this.widgets ? this.widgets : defaultConfig.widgets,
            settings: this.settings ? this.settings : defaultConfig.settings,
        };
        const jsonString = JSON.stringify(object, null, 2);
        return new Blob([jsonString], { type: "application/json" });
    }

    saveSnapshot(): void {
        this.previousWidgets = $state.snapshot(this.widgets);
        this.previousSettings = $state.snapshot(this.settings);
    }

    restoreSnapshot(): void {
        if (this.previousWidgets === null || this.previousSettings === null) {
            console.error("Can't restore invalid snapshot");
            return;
        }

        this.widgets = $state.snapshot(this.previousWidgets);
        this.settings = $state.snapshot(this.previousSettings);
    }

    clearSnapshot(): void {
        this.previousWidgets = null;
        this.previousSettings = null;
    }

    toggleActiveTheme(): void {
        if (!this.settings) return;

        const light = this.settings.themes.light;
        const dark = this.settings.themes.dark;
        const active = this.settings.themes.active;

        this.settings.themes.active = active === light ? dark : light;
    }
}

export const APPLICATION_KEY = Symbol("mookbark");