import gridHelp from "svelte-grid/src/utils/helper.js";

export const defaultConfig = {
    settings: {
        themes: {
            light: "light",
            dark: "dark",
            active: "dark",
        },
        layout: {
            numberOfColumns: 6,
            gapX: 6,
            gapY: 6,
            widgetsBorder: {
                useFromTheme: true,
                valuePx: 8.
            },
        },
    },
    widgets: [
        {
            id: 1,
            type: "shortcuts",
            layout: {
                positionX: 0,
                positionY: 0,
                width: 2,
                height: 20,
                customResizer: true,
                customDragger: true,
                fixed: false,
                resizable: true,
                draggable: true,
                minWidth: 1,
                minHeight: 1,
            },
            data: {
                title: "Social Media",
                color: "#1d4ed8",
                links: [
                    { name: "Twitter", url: "https://twitter.com" },
                    { name: "Reddit", url: "https://reddit.com" },
                    { name: "LinkedIn", url: "https://linkedin.com" },
                ],
            },
        },
    ],
};
