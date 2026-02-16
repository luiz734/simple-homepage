import gridHelp from "svelte-grid/src/utils/helper.js";

export const defaultItemsProps = {
    customResizer: true,
    customDragger: true,
    fixed: false,
    resizable: false,
    draggable: false,
    min: { w: 1, h: 1 },
};

export const defaultConfig = {
    settings: {
        themes: {
            light: "light",
            dark: "dark",
            active: "dark",
        },
        layout: {
            numberOfColumns: 6,
        },
    },
    widgets: [
        {
            id: 1,
            type: "shortcuts",
            6: gridHelp.item({ x: 0, y: 0, w: 2, h: 2, ...defaultItemsProps }),
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
//
// export const defaultConfig = {
//     settings: {
//         themes: {
//             light: "light",
//             dark: "dark",
//             active: "dark",
//         },
//         layout: {
//             numberOfColumns: 6,
//         },
//     },
//     widgets: [
//         {
//             id: 1,
//             type: "shortcuts",
//             6: gridHelp.item({ x: 0, y: 0, w: 2, h: 2, ...defaultItemsProps }),
//             data: {
//                 title: "Social Media",
//                 color: "#1d4ed8",
//                 links: [
//                     { name: "Twitter", url: "https://twitter.com" },
//                     { name: "Reddit", url: "https://reddit.com" },
//                     { name: "LinkedIn", url: "https://linkedin.com" },
//                 ],
//             },
//         },
//         {
//             id: 2,
//             type: "shortcuts",
//             6: gridHelp.item({ x: 2, y: 0, w: 2, h: 2, ...defaultItemsProps }),
//             data: {
//                 title: "Development",
//                 color: "#0f766e",
//                 links: [
//                     { name: "GitHub", url: "https://github.com" },
//                     {
//                         name: "Stack Overflow",
//                         url: "https://stackoverflow.com",
//                     },
//                     {
//                         name: "MDN Web Docs",
//                         url: "https://developer.mozilla.org",
//                     },
//                     { name: "Svelte", url: "https://svelte.dev" },
//                 ],
//             },
//         },
//         {
//             id: 3,
//             type: "shortcuts",
//             6: gridHelp.item({ x: 4, y: 0, w: 2, h: 2, ...defaultItemsProps }),
//             data: {
//                 title: "News",
//                 color: "#b91c1c",
//                 links: [
//                     {
//                         name: "Hacker News",
//                         url: "https://news.ycombinator.com",
//                     },
//                     { name: "TechCrunch", url: "https://techcrunch.com" },
//                     { name: "BBC", url: "https://bbc.com" },
//                 ],
//             },
//         },
//         {
//             id: 4,
//             type: "shortcuts",
//             6: gridHelp.item({ x: 0, y: 2, w: 4, h: 4, ...defaultItemsProps }),
//             data: {
//                 title: "Entertainment & Streaming",
//                 color: "#7e22ce",
//                 links: [
//                     { name: "YouTube", url: "https://youtube.com" },
//                     { name: "Netflix", url: "https://netflix.com" },
//                     { name: "Twitch", url: "https://twitch.tv" },
//                     { name: "Spotify", url: "https://spotify.com" },
//                     { name: "Disney+", url: "https://disneyplus.com" },
//                     { name: "Prime Video", url: "https://primevideo.com" },
//                 ],
//             },
//         },
//         {
//             id: 5,
//             type: "calculator",
//             6: gridHelp.item({ x: 4, y: 2, w: 2, h: 4, ...defaultItemsProps }),
//             data: {},
//         },
//         {
//             id: 6,
//             type: "shortcuts",
//             6: gridHelp.item({ x: 0, y: 6, w: 2, h: 2, ...defaultItemsProps }),
//             data: {
//                 title: "Finance",
//                 color: "#15803d",
//                 links: [
//                     { name: "CoinMarketCap", url: "https://coinmarketcap.com" },
//                     { name: "TradingView", url: "https://tradingview.com" },
//                 ],
//             },
//         },
//         {
//             id: 7,
//             type: "shortcuts",
//             6: gridHelp.item({ x: 2, y: 6, w: 2, h: 2, ...defaultItemsProps }),
//             data: {
//                 title: "Shopping",
//                 color: "#be185d",
//                 links: [
//                     { name: "Amazon", url: "https://amazon.com" },
//                     { name: "eBay", url: "https://ebay.com" },
//                 ],
//             },
//         },
//         {
//             id: 8,
//             type: "clock",
//             6: gridHelp.item({ x: 4, y: 6, w: 2, h: 2, ...defaultItemsProps }),
//             data: {},
//         },
//     ],
// };
