/**
 * Storage Adapter
 * Automatically detects environment (Extension vs Browser) and normalizes
 * the API for JSON serializable data.
 */
export const storageAdapter = {
    async get(keys: string[]): Promise<Record<string, any>> {
        if (
            typeof chrome !== "undefined" &&
            chrome.storage &&
            chrome.storage.local
        ) {
            return await chrome.storage.local.get(keys);
        }

        const result: Record<string, any> = {};
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

    async set(items: Record<string, any>): Promise<void> {
        if (
            typeof chrome !== "undefined" &&
            chrome.storage &&
            chrome.storage.local
        ) {
            return await chrome.storage.local.set(items);
        }

        for (const [key, value] of Object.entries(items)) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    },
};

/**
 * Blob Storage Adapter
 * Designed for large files (Blobs/Files) using IndexedDB.
 */
const DB_NAME = "MookbarkBlobStorageDB";
const STORE_NAME = "blobs";
const DB_VERSION = 1;

function getDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => {
            request.result.createObjectStore(STORE_NAME);
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export const blobStorageAdapter = {
    async get(keys: string[]): Promise<Record<string, Blob>> {
        const db = await getDB();
        const result: Record<string, Blob> = {};

        await Promise.all(keys.map(key => {
            return new Promise<void>((resolve, reject) => {
                const transaction = db.transaction(STORE_NAME, "readonly");
                const store = transaction.objectStore(STORE_NAME);
                const request = store.get(key);

                request.onsuccess = () => {
                    if (request.result) {
                        result[key] = request.result;
                    }
                    resolve();
                };

                request.onerror = () => reject(request.error);
            });
        }));

        return result;
    },

    async set(items: Record<string, Blob>): Promise<void> {
        const db = await getDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, "readwrite");
            const store = transaction.objectStore(STORE_NAME);

            for (const [key, value] of Object.entries(items)) {
                store.put(value, key);
            }

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    },

    async remove(keys: string[]): Promise<void> {
        const db = await getDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, "readwrite");
            const store = transaction.objectStore(STORE_NAME);

            for (const key of keys) {
                store.delete(key);
            }

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    }
};
