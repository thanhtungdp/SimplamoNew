import { create } from "zustand"
import { dashboardApi } from "@/services/api/dashboardApi"
import { Dashboard } from "@/types/Dashboard"

interface DashboardState {
    dashboards: Dashboard[]
    isLoading: boolean
    error: string | null

    // Actions
    fetchDashboards: () => Promise<void>
    setDashboards: (dashboards: Dashboard[]) => void
    clearDashboards: () => void
    clearError: () => void
}

export const useDashboardStore = create<DashboardState>((set) => ({
    dashboards: [],
    isLoading: false,
    error: null,

    fetchDashboards: async () => {
        set({ isLoading: true, error: null })

        const result = await dashboardApi.getDashboards()

        if (result.kind === "ok") {
            set({ dashboards: result.dashboards, isLoading: false })
        } else {
            set({ error: result.message, isLoading: false })
        }
    },

    setDashboards: (dashboards) => set({ dashboards }),

    clearDashboards: () => set({ dashboards: [], error: null }),

    clearError: () => set({ error: null }),
}))
