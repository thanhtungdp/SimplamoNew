import { ApiResponse } from "apisauce"
import { apiClient } from "./apiClient"
import { Dashboard } from "@/types/Dashboard"

// Define API response types
export type GetDashboardsResult =
    | { kind: "ok"; dashboards: Dashboard[] }
    | { kind: "error"; message: string }

export const dashboardApi = {
    /**
     * Get all dashboards
     * Auth headers (token, tenant) are automatically included by apiClient
     */
    getDashboards: async (): Promise<GetDashboardsResult> => {
        try {
            const response: ApiResponse<Dashboard[]> = await apiClient.get("/auth/dashboards")

            if (!response.ok) {
                const errorData = response.data as any
                return { kind: "error", message: errorData?.message || "Failed to fetch dashboards" }
            }

            return { kind: "ok", dashboards: response.data || [] }
        } catch (e) {
            return { kind: "error", message: "Network error" }
        }
    },
}
