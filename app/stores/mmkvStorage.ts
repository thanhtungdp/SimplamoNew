import { MMKV } from "react-native-mmkv"

// Initialize MMKV
export const storage = new MMKV()

// Create MMKV storage wrapper for Zustand
export const zustandStorage = {
    setItem: (name: string, value: string) => storage.set(name, value),
    getItem: (name: string) => storage.getString(name) ?? null,
    removeItem: (name: string) => storage.delete(name),
}
