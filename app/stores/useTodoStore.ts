import { create } from "zustand"
import { todoApi } from "@/services/api/todoApi"
import { Todo, TodoListParams } from "@/types/Todo"

interface TodoState {
    todos: Todo[]
    isLoading: boolean
    error: string | null
    currentPage: number
    total: number
    itemPerPage: number

    // Actions
    fetchTodos: (params?: TodoListParams) => Promise<void>
    loadMore: () => Promise<void>
    toggleTodoStatus: (id: string) => Promise<void>
    clearTodos: () => void
    clearError: () => void
}

export const useTodoStore = create<TodoState>((set, get) => ({
    todos: [],
    isLoading: false,
    error: null,
    currentPage: 1,
    total: 0,
    itemPerPage: 50,

    fetchTodos: async (params = {}) => {
        set({ isLoading: true, error: null })

        const result = await todoApi.getTodos({
            ...params,
            teamIds: '60fd7f693e81570057440b4f',
            page: 1,
            itemPerPage: get().itemPerPage,
        })

        if (result.kind === "ok") {
            set({
                todos: result.data.items,
                total: result.data.total,
                currentPage: result.data.page,
                itemPerPage: result.data.itemPerPage,
                isLoading: false,
            })
        } else {
            set({ error: result.message, isLoading: false })
        }
    },

    loadMore: async () => {
        const { currentPage, total, todos, itemPerPage, isLoading } = get()

        // Don't load if already loading or no more items
        if (isLoading || todos.length >= total) return

        set({ isLoading: true })

        const result = await todoApi.getTodos({
            page: currentPage + 1,
            itemPerPage,
        })

        if (result.kind === "ok") {
            set({
                todos: [...todos, ...result.data.items],
                currentPage: result.data.page,
                isLoading: false,
            })
        } else {
            set({ error: result.message, isLoading: false })
        }
    },

    toggleTodoStatus: async (id: string) => {
        const todo = get().todos.find((t) => t._id === id)
        if (!todo) return

        // Optimistic update
        set({
            todos: get().todos.map((t) =>
                t._id === id
                    ? { ...t, status: t.status === "DONE" ? "ON_TRACK" : "DONE" }
                    : t
            ),
        })

        const result = await todoApi.toggleTodoStatus(id, todo.status)

        if (result.kind === "error") {
            // Revert on error
            set({
                todos: get().todos.map((t) => (t._id === id ? todo : t)),
                error: result.message,
            })
        }
    },

    clearTodos: () => set({ todos: [], currentPage: 1, total: 0 }),

    clearError: () => set({ error: null }),
}))
