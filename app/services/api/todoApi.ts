import { ApiResponse } from "apisauce"
import { apiClient } from "./apiClient"
import { Todo, TodoListResponse, TodoListParams, CreateTodoInput, UpdateTodoInput, TodoStatus } from "@/types/Todo"

// Define API response types
export type GetTodosResult =
    | { kind: "ok"; data: TodoListResponse }
    | { kind: "error"; message: string }

export type GetTodoDetailResult =
    | { kind: "ok"; data: Todo }
    | { kind: "error"; message: string }

export type CreateTodosResult =
    | { kind: "ok"; data: Todo[] }
    | { kind: "error"; message: string }

export type UpdateTodoResult =
    | { kind: "ok"; data: Todo }
    | { kind: "error"; message: string }

export const todoApi = {
    /**
     * Get todos list with pagination and filters
     * Auth headers (token, tenant-id) are automatically included by apiClient
     */
    getTodos: async (params: TodoListParams = {}): Promise<GetTodosResult> => {
        try {
            const queryParams = {
                getAll: params.getAll ?? false,
                inMeeting: params.inMeeting ?? false,
                isArchived: params.isArchived ?? false,
                itemPerPage: params.itemPerPage ?? 50,
                page: params.page ?? 1,
                ...(params.teamIds && { teamIds: params.teamIds }),
            }

            const response: ApiResponse<TodoListResponse> = await apiClient.get(
                "/eos-core/todos",
                queryParams
            )

            if (!response.ok) {
                const errorData = response.data as any
                return { kind: "error", message: errorData?.message || "Failed to fetch todos" }
            }

            return { kind: "ok", data: response.data! }
        } catch (e) {
            return { kind: "error", message: "Network error" }
        }
    },

    /**
     * Get single todo detail
     */
    getTodoDetail: async (id: string): Promise<GetTodoDetailResult> => {
        try {
            const response: ApiResponse<Todo> = await apiClient.get(`/eos-core/todos/${id}`)

            if (!response.ok) {
                const errorData = response.data as any
                return { kind: "error", message: errorData?.message || "Failed to fetch todo" }
            }

            return { kind: "ok", data: response.data! }
        } catch (e) {
            return { kind: "error", message: "Network error" }
        }
    },

    /**
     * Create multiple todos
     */
    createTodos: async (todos: CreateTodoInput[]): Promise<CreateTodosResult> => {
        try {
            const response: ApiResponse<Todo[]> = await apiClient.post(
                "/eos-core/todos/many",
                todos
            )

            if (!response.ok) {
                const errorData = response.data as any
                return { kind: "error", message: errorData?.message || "Failed to create todos" }
            }

            return { kind: "ok", data: response.data! }
        } catch (e) {
            return { kind: "error", message: "Network error" }
        }
    },

    /**
     * Update todo
     */
    updateTodo: async (id: string, data: UpdateTodoInput): Promise<UpdateTodoResult> => {
        try {
            const response: ApiResponse<Todo> = await apiClient.patch(
                `/eos-core/todos/${id}`,
                data
            )

            if (!response.ok) {
                const errorData = response.data as any
                return { kind: "error", message: errorData?.message || "Failed to update todo" }
            }

            return { kind: "ok", data: response.data! }
        } catch (e) {
            return { kind: "error", message: "Network error" }
        }
    },

    /**
     * Toggle todo status (helper method)
     */
    toggleTodoStatus: async (id: string, currentStatus: TodoStatus): Promise<UpdateTodoResult> => {
        const newStatus: TodoStatus = currentStatus === "DONE" ? "ON_TRACK" : "DONE"
        return todoApi.updateTodo(id, { status: newStatus })
    },
}
