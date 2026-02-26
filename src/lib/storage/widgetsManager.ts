import gridHelp from "svelte-grid/src/utils/helper.js";
import { SnapshotManager } from "./snapshotManager.svelte";
import { InternalWidget } from "../types";
import {
    fromInternalToWidgetToLib,
    fromLibToInternalWidget,
} from "../types/widget.types";
import { defaultConfig } from "./defaultSettings.svelte";

const createId = (): string => "_" + Math.random().toString(36).substr(2, 9);

export class WidgetsManager {
    state: SnapshotManager<InternalWidget[]>;

    constructor(initialWidgets: InternalWidget[]) {
        this.state = new SnapshotManager(initialWidgets);
    }

    get widgets(): InternalWidget[] {
        return this.state.current;
    }
    set widgets(widgets: InternalWidget[]) {
        this.state.current = widgets;
    }

    getLibraryFormat(columns: number) {
        return this.widgets.map((widget: InternalWidget) =>
            fromInternalToWidgetToLib(columns, widget),
        );
    }

    setLibraryFormat(updatedLibraryWidgets: InternalWidget[], columns: number) {
        this.widgets = updatedLibraryWidgets.map((libWidget) => {
            const originalWidget = this.widgets.find(
                (w) => w.id === libWidget.id,
            );
            return fromLibToInternalWidget(columns, libWidget, originalWidget);
        });
    }

    addWidget(type: string, columns: number): void {
        const id = createId();
        const newWidget: InternalWidget = {
            id,
            type,
            layout: defaultConfig.widgets[0].layout,
            data: { title: "Widget " + id, color: "#1d4ed8", links: [] },
        };

        const newWidgetLibFormat = fromInternalToWidgetToLib(
            columns,
            newWidget,
        );
        const findOutPosition = gridHelp.findSpace(
            newWidgetLibFormat,
            this.getLibraryFormat(columns),
            columns,
        );

        newWidget.layout.positionX = findOutPosition.x;
        newWidget.layout.positionY = findOutPosition.y;

        this.widgets.push(newWidget);
    }

    setLockState(value: boolean): void {
        this.widgets = this.widgets.map((w) => {
            return {
                ...w,
                layout: {
                    ...w.layout,
                    fixed: value,
                    resizable: !value,
                    draggable: !value,
                },
            };
        })
    }
}
