import { ApiResponse, create } from "apisauce"
import Config from "../../config"

import { User } from "../../types/User"

// Define API response types
export type LoginResult = { kind: "ok"; token: string } | { kind: "error"; message: string }
export type ProfileResult = { kind: "ok"; user: User } | { kind: "error"; message: string }

// Create API instance
const api = create({
    baseURL: Config.API_URL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
    timeout: 30000,
})

export const authApi = {
    // Login endpoint
    login: async (email: string, password: string, tenant: string = "default"): Promise<LoginResult> => {
        try {
            const response: ApiResponse<any> = await api.post(
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

    // Get profile endpoint
    getProfile: async (token: string): Promise<ProfileResult> => {
        try {
            api.setHeader("Authorization", `Bearer ${token}`)
            const response: ApiResponse<any> = await api.get("/auth/users/me")

            if (!response.ok) {
                return { kind: "error", message: response.data?.message || "Failed to fetch profile" }
            }

            return { kind: "ok", user: response.data }
        } catch (e) {
            return { kind: "error", message: "Network error" }
        }
    },

    // Logout (optional, mostly client-side but good to have)
    logout: () => {
        api.deleteHeader("Authorization")
        api.deleteHeader("tenant-id")
    },

    setTenantHeader: (tenant: string) => {
        api.setHeader("tenant-id", tenant)
    }
}
