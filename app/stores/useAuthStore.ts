import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { zustandStorage } from "./mmkvStorage"
import { authApi } from "@/services/api/authApi"
import { apiClient } from "@/services/api/apiClient"
import { User } from "@/types/User"

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
                    // Set auth in apiClient for all future requests
                    apiClient.setAuth(result.token, tenant)

                    set({
                        token: result.token,
                        isAuthenticated: true,
                        tenant: tenant,
                        isLoading: false
                    })

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

                const result = await authApi.getProfile()

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
                if (state?.token && state?.tenant) {
                    apiClient.setAuth(state.token, state.tenant)
                }
            }
        }
    )
)
