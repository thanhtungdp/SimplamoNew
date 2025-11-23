import { create } from "zustand"
import { rockApi } from "@/services/api/rockApi"
import { Rock, RockListParams, RockStatistics } from "@/types/Rock"

interface RockState {
    rocks: Rock[]
    isLoading: boolean
    error: string | null
    statistics: RockStatistics | null

    // Actions
    fetchRocks: (params?: RockListParams) => Promise<void>
    clearRocks: () => void
    clearError: () => void
}

export const useRockStore = create<RockState>((set, get) => ({
    rocks: [],
    isLoading: false,
    error: null,
    statistics: null,

    fetchRocks: async (params = {}) => {
        set({ isLoading: true, error: null })

        const result = await rockApi.getRocks({
            ...params,
            sessionId: '68633314432acf296ed56ef6'
        })

        if (result.kind === "ok") {
            const statistics = rockApi.calculateStatistics(result.data)
            set({
                rocks: result.data,
                statistics,
                isLoading: false,
            })
        } else {
            set({ error: result.message, isLoading: false })
        }
    },

    clearRocks: () => set({ rocks: [], statistics: null }),

    clearError: () => set({ error: null }),
}))
