/**
 * Storage Adapter
 * Automatically detects environment (Extension vs Browser) and normalizes the API.
 */
export const storageAdapter = {
    async get(keys) {
        // Check for Chrome Extension environment
        if (
            typeof chrome !== "undefined" &&
            chrome.storage &&
            chrome.storage.local
        ) {
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
        if (
            typeof chrome !== "undefined" &&
            chrome.storage &&
            chrome.storage.local
        ) {
            return await chrome.storage.local.set(items);
        }

        // Fallback to LocalStorage
        for (const [key, value] of Object.entries(items)) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    },
};
