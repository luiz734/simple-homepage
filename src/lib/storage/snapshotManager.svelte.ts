export class SnapshotManager<T> {
    current = $state<T>();
    previous = $state<T | null>(null);

    constructor(initialValue: T) {
        this.current = initialValue;
    }

    saveSnapshot(): void {
        this.previous = $state.snapshot(this.current) as T;
    }

    restoreSnapshot(): void {
        if (this.previous === null) {
            console.error("Can't restore invalid snapshot");
            return;
        }
        this.current = $state.snapshot(this.previous) as T;
    }

    clearSnapshot(): void {
        this.previous = null;
    }
}
