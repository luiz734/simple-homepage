import gridHelp from "svelte-grid/src/utils/helper.js";
import { defaultConfig, defaultItemsProps } from "./defaultSettings.svelte.js";
import { Settings, InternalWidget } from "../types";
import { settingsManager } from "./SettingsReadWriter";
import {
    fromInternalToWidgetToLib,
    fromLibToInternalWidget,
} from "../types/widget.types";


class StorageState {
    widgets: InternalWidget[];
    settings: Settings;
}

const createId = (): string => "_" + Math.random().toString(36).substr(2, 9);

export class ApplicationContextSvelte {
    // State initialization
    widgets = $state<InternalWidget[]>([]);
    #settings = $state<Settings>();
    set settings(settings: Settings) {
        // if (this.isLoaded) {
        //     const oldColumns = this.#settings.layout.numberOfColumns;
        //     this.#settings = settings;
        //     if (oldColumns !== this.#settings.layout.numberOfColumns) {
        //         this.reorganizeWidgets();
        //     }
        // } else {
        //
        // }
        this.#settings = settings;
    }
    get settings(): Settings {
        return this.#settings;
    }

    // libraryFormatWidgets = $derived(
    //     this.widgets.map((widget: InternalWidget) =>
    //         fromInternalToWidgetToLib(this.settings?.layout?.numberOfColumns || 1, widget)
    //     )
    // );


    get libraryFormatWidgets() {
        const columns = this.settings.layout.numberOfColumns;
        return this.widgets.map((widget: InternalWidget) =>
            fromInternalToWidgetToLib(columns, widget)
        );
    }
    set libraryFormatWidgets(updatedLibraryWidgets: any[]) {
        const columns = this.settings.layout.numberOfColumns;
        let newWidgets = updatedLibraryWidgets.map((libWidget) => {
            // Find the original widget to preserve data properties not managed by the grid
            const originalWidget = this.widgets.find(w => w.id === libWidget.id);
            return fromLibToInternalWidget(columns, libWidget, originalWidget);
        });
        this.widgets = newWidgets;
        const foo = 1;
    }


    // Undo/Redo state
    previousWidgets = $state<InternalWidget[] | null>(null);
    previousSettings = $state<Settings | null>(null);

    isLoaded = $state<boolean>(false);

    constructor() {
        $effect(() => {
            if (!this.isLoaded) return;

            // Trigger the effect by reading signals
            $state.snapshot(this.widgets);
            $state.snapshot(this.settings);

            const currentSettings = $state.snapshot(this.settings);
            const currentWidgets = $state.snapshot(this.widgets);
            settingsManager.writeDebounced(currentSettings, currentWidgets);
        });
    }

    async loadStorageOrDefault(): Promise<void> {
        try {
            const data = await settingsManager.loadFromStorage();
            this.settings = data.settings;
            this.widgets = data.widgets;
        } catch (error) {
            console.warn("Using default settings values");
            this.settings = defaultConfig.settings;
            this.widgets = defaultConfig.widgets;
        } finally {
            this.isLoaded = true;
        }
    }

    addWidget(type: string): void {
        const id = createId();
        const columns = this.settings.layout.numberOfColumns;

        let newWidget: InternalWidget = {
            id: id,
            type: type,
            layout: {
                positionX: 0,
                positionY: 0,
                width: 1,
                height: 8,
                minHeight: 1,
                minWidth: 1,
                customResizer: true,
                customDragger: true,
                fixed: false,
                resizable: true,
                draggable: true,
            },
            data: {
                title: "Widget " + id,
                color: "#1d4ed8",
                links: [],
            },
        };

        let newWidgetLibFormat = fromInternalToWidgetToLib(columns, newWidget);

        // gridHelp.findSpace is untyped, returns layout object
        let findOutPosition = gridHelp.findSpace(newWidgetLibFormat, this.libraryFormatWidgets, columns);

        // newWidget = {
        //     ...newWidget,
        //     layout: {
        //         ...newWidget.layout,
        //         positionX: findOutPosition.x,
        //         positionY: findOutPosition.y,
        //     },
        // };
        newWidget.layout.positionX = findOutPosition.x;
        newWidget.layout.positionY = findOutPosition.y;

        this.widgets.push(newWidget);
    }

    updateWidgets(widgets: InternalWidget[]): void {
        this.widgets = widgets;
    }

    async importStateFromJsonString(jsonString: string): Promise<void> {
        try {
            const data = await settingsManager.loadFromRawJson(jsonString);
            this.settings = data.settings;
            this.widgets = data.widgets;
        } catch (error) {
            console.error(error);
            console.warn("Using default settings values");
            this.settings = defaultConfig.settings;
            this.widgets = defaultConfig.widgets;
        } finally {
            this.isLoaded = true;
        }

        console.log("State successfully updated from import.");
    }

    exportJsonBlob(): Blob {
        const object: StorageState = {
            widgets: this.widgets,
            settings: this.settings
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

    // reorganizeWidgets(): void {
        // const cols = this.settings.layout.numberOfColumns;
        // let organizedWidgets = gridHelp.adjust(this.libraryFormatWidgets, cols);
        //
        // let normalizedWidgets = gridHelp.normalize(this.libraryFormatWidgets, cols);
        // let organizedAndNormalized = gridHelp.normalize(organizedWidgets, cols);
        //
        // let x = [];
        // for (let i = 0; i < organizedWidgets.length; i++) {
        //     x.push({
        //         "normalized": normalizedWidgets[i][cols],
        //         "organized": organizedWidgets[i][cols],
        //         "normalizedAndNormalized": organizedAndNormalized[i][cols],
        //     })
        // }
        //
        // this.libraryFormatWidgets = organizedAndNormalized;
    // }
}

export const APPLICATION_KEY = Symbol("mookbark");