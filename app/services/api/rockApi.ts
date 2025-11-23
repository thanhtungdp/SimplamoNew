import { ApiResponse } from "apisauce"
import { apiClient } from "./apiClient"
import { Rock, RockListParams, CreateRockInput, UpdateRockInput, RockStatistics } from "@/types/Rock"

// Define API response types
export type GetRocksResult =
    | { kind: "ok"; data: Rock[] }
    | { kind: "error"; message: string }

export type GetRockDetailResult =
    | { kind: "ok"; data: Rock }
    | { kind: "error"; message: string }

export type CreateRockResult =
    | { kind: "ok"; data: Rock }
    | { kind: "error"; message: string }

export type UpdateRockResult =
    | { kind: "ok"; data: Rock }
    | { kind: "error"; message: string }

export const rockApi = {
    /**
     * Get rocks list with filters
     * Auth headers (token, tenant-id) are automatically included by apiClient
     */
    getRocks: async (params: RockListParams = {}): Promise<GetRocksResult> => {
        try {
            const queryParams = {
                rock: params.rock ?? "",
                pic: params.pic ?? "",
                rangeStart: params.rangeStart ?? "",
                rangeEnd: params.rangeEnd ?? "",
                ...(params.teamId && { teamId: params.teamId }),
                ...(params.sessionId && { sessionId: params.sessionId }),
            }

            const response: ApiResponse<Rock[]> = await apiClient.get(
                "/eos-core/rocks",
                queryParams
            )

            if (!response.ok) {
                const errorData = response.data as any
                return { kind: "error", message: errorData?.message || "Failed to fetch rocks" }
            }

            return { kind: "ok", data: response.data! }
        } catch (e) {
            return { kind: "error", message: "Network error" }
        }
    },

    /**
     * Get single rock detail
     */
    getRockDetail: async (id: string): Promise<GetRockDetailResult> => {
        try {
            const response: ApiResponse<Rock> = await apiClient.get(`/eos-core/rocks/${id}`)

            if (!response.ok) {
                const errorData = response.data as any
                return { kind: "error", message: errorData?.message || "Failed to fetch rock" }
            }

            return { kind: "ok", data: response.data! }
        } catch (e) {
            return { kind: "error", message: "Network error" }
        }
    },

    /**
     * Create rock
     */
    createRock: async (rock: CreateRockInput): Promise<CreateRockResult> => {
        try {
            const response: ApiResponse<Rock> = await apiClient.post(
                "/eos-core/rocks",
                rock
            )

            if (!response.ok) {
                const errorData = response.data as any
                return { kind: "error", message: errorData?.message || "Failed to create rock" }
            }

            return { kind: "ok", data: response.data! }
        } catch (e) {
            return { kind: "error", message: "Network error" }
        }
    },

    /**
     * Update rock
     */
    updateRock: async (id: string, data: UpdateRockInput): Promise<UpdateRockResult> => {
        try {
            const response: ApiResponse<Rock> = await apiClient.patch(
                `/eos-core/rocks/${id}`,
                data
            )

            if (!response.ok) {
                const errorData = response.data as any
                return { kind: "error", message: errorData?.message || "Failed to update rock" }
            }

            return { kind: "ok", data: response.data! }
        } catch (e) {
            return { kind: "error", message: "Network error" }
        }
    },

    /**
     * Calculate statistics from rocks
     */
    calculateStatistics: (rocks: Rock[]): RockStatistics => {
        const totalRocks = rocks.length
        const onTrackRocks = rocks.filter(r => r.status === "ON_TRACK").length
        const offTrackRocks = rocks.filter(r => r.status === "OFF_TRACK").length
        const doneRocks = rocks.filter(r => r.status === "DONE").length

        const totalProgress = rocks.reduce((sum, r) => sum + (r.progress || 0), 0)
        const averageProgress = totalRocks > 0 ? Math.round(totalProgress / totalRocks) : 0

        const totalMilestones = rocks.reduce((sum, r) => sum + r.totalMilestones, 0)
        const doneMilestones = rocks.reduce((sum, r) => sum + r.doneMilestones, 0)

        return {
            totalRocks,
            onTrackRocks,
            offTrackRocks,
            doneRocks,
            averageProgress,
            totalMilestones,
            doneMilestones,
        }
    },
}
