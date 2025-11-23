import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { MMKV } from "react-native-mmkv"
import { authApi } from "../services/api/authApi"

import { User } from "../types/User"

// Initialize MMKV
export const storage = new MMKV()

// Create MMKV storage wrapper for Zustand
const zustandStorage = {
    setItem: (name: string, value: string) => storage.set(name, value),
    getItem: (name: string) => storage.getString(name) ?? null,
    removeItem: (name: string) => storage.delete(name),
}

interface AuthState {
    token: string | null
    isAuthenticated: boolean
    user: User | null
    tenant: string | null
    isLoading: boolean
    error: string | null

    // Actions
    login: (email: string, password: string, tenant: string) => Promise<boolean>
    logout: () => void
    getProfile: () => Promise<void>
    clearError: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            token: null,
            isAuthenticated: false,
            user: null,
            tenant: null,
            isLoading: false,
            error: null,

            login: async (email, password, tenant) => {
                set({ isLoading: true, error: null })

                const result = await authApi.login(email, password, tenant)

                if (result.kind === "ok") {
                    set({
                        token: result.token,
                        isAuthenticated: true,
                        tenant: tenant,
                        isLoading: false
                    })

                    // Set tenant header for future requests
                    authApi.setTenantHeader(tenant)

                    // Fetch profile after successful login
                    get().getProfile()
                    return true
                } else {
                    set({
                        isLoading: false,
                        error: result.message
                    })
                    return false
                }
            },

            logout: () => {
                authApi.logout()
                set({
                    token: null,
                    isAuthenticated: false,
                    user: null,
                    tenant: null,
                    error: null
                })
            },

            getProfile: async () => {
                const { token } = get()
                if (!token) return

                const result = await authApi.getProfile(token)

                if (result.kind === "ok") {
                    set({ user: result.user })
                }
            },

            clearError: () => set({ error: null }),
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => zustandStorage),
            partialize: (state) => ({
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                user: state.user,
                tenant: state.tenant
            }),
            onRehydrateStorage: () => (state) => {
                if (state?.tenant) {
                    authApi.setTenantHeader(state.tenant)
                }
            }
        }
    )
)
