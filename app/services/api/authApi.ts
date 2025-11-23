import { ApiResponse } from "apisauce"
import { apiClient } from "./apiClient"
import { User } from "@/types/User"

// Define API response types
export type LoginResult = { kind: "ok"; token: string } | { kind: "error"; message: string }
export type ProfileResult = { kind: "ok"; user: User } | { kind: "error"; message: string }

export const authApi = {
    /**
     * Login endpoint
     * Note: Login doesn't use apiClient.setAuth yet since we don't have the token
     */
    login: async (email: string, password: string, tenant: string = "default"): Promise<LoginResult> => {
        try {
            const response: ApiResponse<any> = await apiClient.post(
                "/auth/users/login",
                { email, password },
                { headers: { "tenant-id": tenant } }
            )

            if (!response.ok) {
                return { kind: "error", message: response.data?.message || "Login failed" }
            }

            const token = response.data?.token
            if (!token) {
                return { kind: "error", message: "No token received" }
            }

            return { kind: "ok", token }
        } catch (e) {
            return { kind: "error", message: "Network error" }
        }
    },

    /**
     * Get profile endpoint
     * Uses apiClient which already has auth headers set
     */
    getProfile: async (): Promise<ProfileResult> => {
        try {
            const response: ApiResponse<any> = await apiClient.get("/auth/users/me")

            if (!response.ok) {
                return { kind: "error", message: response.data?.message || "Failed to fetch profile" }
            }

            return { kind: "ok", user: response.data }
        } catch (e) {
            return { kind: "error", message: "Network error" }
        }
    },

    /**
     * Logout - clears auth from apiClient
     */
    logout: () => {
        apiClient.clearAuth()
    },
}
