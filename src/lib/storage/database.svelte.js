import gridHelp from "svelte-grid/src/utils/helper.js";

const itemProps = {
    customResizer: true,
    customDragger: true,
    fixed: false,
    resizable: false,
    draggable: false,
    min: {w: 1, h: 1},
};

const defaultWidgets = {
    widgets: [
        // ROW 1: 3 widgets of equal size (2x2)
        {
            id: 1,
            type: "shortcuts",
            6: gridHelp.item({x: 0, y: 0, w: 2, h: 2, ...itemProps}),
            data: {
                title: "Social Media",
                color: "#1d4ed8", // blue-700
                links: [
                    {name: "Twitter", url: "https://twitter.com"},
                    {name: "Reddit", url: "https://reddit.com"},
                    {name: "LinkedIn", url: "https://linkedin.com"},
                ]
            }
        },
        {
            id: 2,
            type: "shortcuts",
            6: gridHelp.item({x: 2, y: 0, w: 2, h: 2, ...itemProps}),
            data: {
                title: "Development",
                color: "#0f766e", // teal-700
                links: [
                    {name: "GitHub", url: "https://github.com"},
                    {name: "Stack Overflow", url: "https://stackoverflow.com"},
                    {name: "MDN Web Docs", url: "https://developer.mozilla.org"},
                    {name: "Svelte", url: "https://svelte.dev"},
                ]
            }
        },
        {
            id: 3,
            type: "shortcuts",
            6: gridHelp.item({x: 4, y: 0, w: 2, h: 2, ...itemProps}),
            data: {
                title: "News",
                color: "#b91c1c", // red-700
                links: [
                    {name: "Hacker News", url: "https://news.ycombinator.com"},
                    {name: "TechCrunch", url: "https://techcrunch.com"},
                    {name: "BBC", url: "https://bbc.com"},
                ]
            }
        },

        // ROW 2: One wide widget (4x3) and one tall sidebar widget (2x5)
        {
            id: 4,
            type: "shortcuts",
            6: gridHelp.item({x: 0, y: 2, w: 4, h: 4, ...itemProps}),
            data: {
                title: "Entertainment & Streaming",
                color: "#7e22ce", // purple-700
                links: [
                    {name: "YouTube", url: "https://youtube.com"},
                    {name: "Netflix", url: "https://netflix.com"},
                    {name: "Twitch", url: "https://twitch.tv"},
                    {name: "Spotify", url: "https://spotify.com"},
                    {name: "Disney+", url: "https://disneyplus.com"},
                    {name: "Prime Video", url: "https://primevideo.com"},
                ]
            }
        },
        {
            id: 5,
            type: "calculator",
            6: gridHelp.item({x: 4, y: 2, w: 2, h: 4, ...itemProps}),
            data: {
                // title: "Reference & Tools",
                // color: "#c2410c", // orange-700
                // links: [
                //     {name: "Wikipedia", url: "https://wikipedia.org"},
                //     {name: "WolframAlpha", url: "https://wolframalpha.com"},
                //     {name: "Google Translate", url: "https://translate.google.com"},
                //     {name: "Figma", url: "https://figma.com"},
                //     {name: "ChatGPT", url: "https://chat.openai.com"},
                // ]
            }
        },

        // ROW 3: Two smaller widgets filling the space under the wide widget
        {
            id: 6,
            type: "shortcuts",
            6: gridHelp.item({x: 0, y: 6, w: 2, h: 2, ...itemProps}),
            data: {
                title: "Finance",
                color: "#15803d", // green-700
                links: [
                    {name: "CoinMarketCap", url: "https://coinmarketcap.com"},
                    {name: "TradingView", url: "https://tradingview.com"},
                ]
            }
        },
        {
            id: 7,
            type: "shortcuts",
            6: gridHelp.item({x: 2, y: 6, w: 2, h: 2, ...itemProps}),
            data: {
                title: "Shopping",
                color: "#be185d", // pink-700
                links: [
                    {name: "Amazon", url: "https://amazon.com"},
                    {name: "eBay", url: "https://ebay.com"},
                ]
            }
        },
        {
            id: 8,
            type: "clock",
            6: gridHelp.item({x: 4, y: 6, w: 2, h: 2, ...itemProps}),
            data: {}
        }
    ]
};

const defaultSettings = {
    themes: {
        light: "light",
        dark: "dark",
        active: "dark",
    }
}

const createId = () => "_" + Math.random().toString(36).substr(2, 9);


/**
 * Storage Adapter
 * Automatically detects environment (Extension vs Browser) and normalizes the API.
 */
const storage = {
    async get(keys) {
        // Check for Chrome Extension environment
        if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
            return await chrome.storage.local.get(keys);
        }

        // Fallback to LocalStorage (Web/Debug)
        const result = {};
        for (const key of keys) {
            const value = localStorage.getItem(key);
            if (value) {
                try {
                    result[key] = JSON.parse(value);
                } catch (e) {
                    console.error(`Error parsing ${key} from localStorage`, e);
                }
            }
        }
        return result; // Returns object { key: value } just like chrome.storage
    },

    async set(items) {
        if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
            return await chrome.storage.local.set(items);
        }

        // Fallback to LocalStorage
        for (const [key, value] of Object.entries(items)) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }
};

export class ApplicationState {
    widgets = $state([]);
    previousWidgets = $state([]);
    settings = $state([]);
    previousSettings = $state([]);

    isLoaded = $state(false); // 1. Add loading state
    #saveTimeout = null;

    constructor() {
        $effect(() => {
            if (!this.isLoaded) return;

            const _effectTrigger = this.widgets;
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
        // Snapshot only when actually saving
        const plainWidgets = $state.snapshot(this.widgets);
        const plainSettings = $state.snapshot(this.settings);
        await storage.set({ widgets: plainWidgets, settings: plainSettings });
        console.log("Storage updated (Debounced)");
        this.#saveTimeout = null;
    }


    async loadStorageOrDefault() {
        const widgetsData = await storage.get(["widgets"]);
        const settingsData = await storage.get(["settings"]);


        if (widgetsData && widgetsData.widgets && Array.isArray(widgetsData.widgets)) {
            this.widgets = widgetsData.widgets;
        } else {
            this.widgets = defaultWidgets.widgets;
        }

        if (settingsData && settingsData.settings && Array.isArray(settingsData.settings)) {
            this.settings = settingsData.settings;
        } else {
            this.settings = defaultSettings;
        }

        // Enable the effect only after data is set
        this.isLoaded = true;
    }

    addWidget(type) {
        // Correct structure for svelte-grid: layout keys at root
        const id = createId()
        let newWidget = {
            id: id,
            type,
            6: gridHelp.item({
                x: 0,
                y: 0, // Grid library usually auto-places if overlaps exist, or you calculate next free spot
                w: 1,
                h: 2,
                ...itemProps
            }),
            data: {
                title: "Widget " + id,
                color: "#1d4ed8", // blue-700
                links: [],
            }
        };

        let findOutPosition = gridHelp.findSpace(newWidget, this.widgets, 6);

        newWidget = {
            ...newWidget,
            6: {
                ...newWidget[6],
                ...findOutPosition
            }
        }
        this.widgets.push(newWidget);
    }

    updateWidgets(widgets) {
        this.widgets = widgets;
    }

    updateShortcut(widgetId, shortcutData) {
        const index = this.widgets.findIndex(w => w.id === widgetId);
        if (index !== -1) {
            this.widgets[index].data = {...this.widgets[index].data, ...shortcutData};
        }
    }

    importState(importedData) {
        if (!importedData) {
            console.error(`Missing imported data for ${importedData}`);
            return;
        }

        this.widgets = importedData.widgets === null ? defaultWidgets.widgets : importedData.widgets;
        this.settings = importedData.settings === null ? defaultSettings : importedData.settings;
        console.log('State successfully updated from import.');
    }

    exportJsonBlob() {
        const object = {
            widgets: this.widgets ? this.widgets : defaultWidgets.widgets,
            settings: this.settings ? this.settings : defaultSettings
        }
        const jsonString = JSON.stringify(object, null, 2);
        return new Blob([jsonString], {type: 'application/json'});
    }

    saveSnapshot() {
        this.previousWidgets =  structuredClone($state.snapshot(this.widgets));
        this.previousSettings =  structuredClone($state.snapshot(this.settings));
    }
    restoreSnapshot() {
        if (this.previousWidgets === null || this.previousSettings === null) {
            console.error('No snapshot found');
            return;
        }
        this.widgets = structuredClone($state.snapshot(this.previousWidgets));
        this.settings = structuredClone($state.snapshot(this.previousSettings))
    }
    clearSnapshot() {
        this.previousWidgets = null;
        this.previousSettings = null;
    }

    toggleActiveTheme() {
        console.log($state.snapshot(this));
        const light = this.settings.themes.light;
        const dark = this.settings.themes.dark;
        const active = this.settings.themes.active;

        this.settings.themes.active = active === light ? dark : light
    }
}

export const APPLICATION_KEY = Symbol('APPLICATION_KEY');