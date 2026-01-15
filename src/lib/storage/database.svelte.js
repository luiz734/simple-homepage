import gridHelp from "svelte-grid/src/utils/helper.js";

const itemProps = {
    customResizer: true,
    customDragger: true,
    fixed: false,
    resizable: false,
    draggable: false,
    min: {w: 1, h: 1},
};

export let defaultData = {
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
            6: gridHelp.item({x: 4, y: 2, w: 2, h: 5, ...itemProps}),
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
            6: gridHelp.item({x: 4, y: 7, w: 2, h: 1, ...itemProps}),
            data: {
            }
        }
    ]
};

const createId = () => "_" + Math.random().toString(36).substr(2, 9);

export class ApplicationState {
    // Svelte 5 state initialization
    widgets = $state([]);

    constructor(initialWidgets = []) {
        this.widgets = initialWidgets;
    }

    addWidget(type, initialData) {
        // Correct structure for svelte-grid: layout keys at root
        this.widgets.push({
            id: createId(),
            type,
            6: gridHelp.item({
                x: 0,
                y: 0, // Grid library usually auto-places if overlaps exist, or you calculate next free spot
                w: 2,
                h: 2,
                ...itemProps
            }),
            data: initialData
        });
    }

    updateWidgets(widgets) {
        this.widgets = widgets;
    }

    updateShortcut(widgetId, shortcutData) {
        const index = this.widgets.findIndex(w => w.id === widgetId);
        if (index !== -1) {
            // In Svelte 5, deep mutation of state proxies works automatically
            this.widgets[index].data = {...this.widgets[index].data, ...shortcutData};
        }
    }
}

export const APPLICATION_KEY = Symbol('APPLICATION_KEY');