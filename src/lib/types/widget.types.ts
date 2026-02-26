import { z } from "zod";
import gridHelp from "svelte-grid/src/utils/helper.js";

export const WidgetLayoutSchema = z.object({
    positionX: z.number(),
    positionY: z.number(),
    width: z.number(),
    height: z.number(),
    minHeight: z.number(),
    minWidth: z.number(),
    customResizer: z.boolean().readonly(),
    customDragger: z.boolean().readonly(),
    fixed: z.boolean(),
    resizable: z.boolean(),
    draggable: z.boolean(),
});

export type WidgetLayout = z.infer<typeof WidgetLayoutSchema>;

export const InternalWidgetSchema = z.object({
    id: z.union([z.string(), z.number()]),
    type: z.string(),
    layout: WidgetLayoutSchema,
    data: z.record(z.string(), z.any()),
});

export type InternalWidget = z.infer<typeof InternalWidgetSchema>;

export const InternalWidgetArraySchema = z.array(InternalWidgetSchema);

export function fromInternalToWidgetToLib(
    column: number,
    widget: InternalWidget,
): Record<any, ReturnType<typeof gridHelp.item>> {
    return {
        [column]: gridHelp.item({
            x: widget.layout.positionX,
            y: widget.layout.positionY,
            w: widget.layout.width,
            h: widget.layout.height,
            customResizer: widget.layout.customResizer,
            customDragger: widget.layout.customDragger,
            fixed: widget.layout.fixed,
            resizable: widget.layout.resizable,
            draggable: widget.layout.draggable,
            min: {
                h: widget.layout.minHeight,
                w: widget.layout.minWidth,
            },
        }),
        id: widget.id,
        type: widget.type,
        data: {
            ...widget.data,
        },
    };
}

export function fromLibToInternalWidget(
    column: number,
    libWidget: any,
    originalWidget?: InternalWidget,
): InternalWidget {
    if (!originalWidget) {
        throw new Error(
            `Widget ID ${libWidget.id} not found during reverse mapping.`,
        );
    }

    const libLayout = libWidget[column];
    return {
        data: libWidget.data,
        id: libWidget.id,
        type: libWidget.type,
        layout: {
            ...originalWidget.layout,
            positionX: libLayout.x,
            positionY: libLayout.y,
            width: libLayout.w,
            height: libLayout.h,
            minHeight: libLayout.min.h,
            minWidth: libLayout.min.w,
        },
    };
}
