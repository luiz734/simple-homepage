import gridHelp from "svelte-grid/src/utils/helper.js";

const itemProps = {
    customResizer: true,
    customDragger: true,
    fixed: false,
    resizable: false,
    draggable: false,
    min: {w: 1, h: 1},
}


export let defaultData = {
    widgets: [
        {
            id: 1,
            type: "shortcuts",
            6: gridHelp.item({
                x: 0,
                y: 0,
                w: 2,
                h: 2,
                ...itemProps,
            }),
            data: {  // Can be anything. Depends on type
                title: "Social",
                links: [
                    {name: "Google", url: "https://www.google.com"},
                    {name: "Facebook", url: "https://www.facebook.com"},
                ]
            }
        },
        {
            id: 2,
            type: "shortcuts",
            6: gridHelp.item({
                x: 2,
                y: 2,
                w: 2,
                h: 4,
                ...itemProps,
            }),
            data: {  // Can be anything. Depends on type
                title: "Stuff",
                links: [
                    {name: "????", url: "https://www.google.com"},
                    {name: "Hello", url: "https://www.facebook.com"},
                ]
            }
        }
    ]
}


const createId = () => "_" + Math.random().toString(36).substr(2, 9);

export class ApplicationState {
    widgets = $state([]);

    constructor(initialWidgets = []) {
        this.widgets = initialWidgets;
    }

    addWidget(type, initialData) {
        this.widgets.push({
            id: createId(),
            type,
            columnLayout: { /* default layout */},
            data: initialData
        });
    }

    updateWidgets(widgets) {
        this.widgets = widgets;
    }

    updateShortcut(widgetId, shortcutData) {
        const widget = this.widgets.find(w => w.id === widgetId);
        if (widget) {
            widget.data = {...widget.data, ...shortcutData};
        }
    }
}

export const APPLICATION_KEY = Symbol('APPLICATION_KEY');