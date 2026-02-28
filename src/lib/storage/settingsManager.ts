import { SnapshotManager } from "./snapshotManager.svelte";
import { InternalWidget, Settings } from "../types";


export class SettingsManager {
    state: SnapshotManager<Settings>;

    constructor() {
        this.state = new SnapshotManager(null);
    }

    get settings(): Settings {
        return this.state.current;
    }
    set settings(settings: Settings) {
        this.state.current = settings;
    }

    toggleActiveTheme(): void {
        const light = this.settings.themes.light;
        const dark = this.settings.themes.dark;
        const active = this.settings.themes.active;

        this.settings.themes.active = active === light ? dark : light;
    }

    numberOfColumns(): number {
        return this.settings.layout.numberOfColumns;
    }
}