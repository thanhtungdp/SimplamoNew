/**
 * Todo (Task) Type Definitions
 * Based on Simplamo API: /eos-core/todos
 */

export type TodoStatus = "ON_TRACK" | "DONE"
export type TodoPriorityType = "HIGH" | ""

export interface Owner {
    _id: string
    fullName: string
    email: string
    avatar: string
}

export interface Issue {
    _id: string
    title: string
    teamId: string
    companyId: string
    rockId?: string
    categoryId?: string
    priority: number
    status: string
    isArchived: boolean
    interval: string
    description: string
    linkAttachments: any[]
    meetingId?: string
    createdAt: string
    updatedAt: string
    isDeleted: boolean
    ownerId: string
    issueOwner: Owner
}

export interface Todo {
    _id: string
    title: string
    teamId: string
    priority: number
    status: TodoStatus
    isArchived: boolean
    isPrivated: boolean
    isFromMeeting: boolean
    meetingId?: string
    description: string
    createdAt: string
    updatedAt: string
    isDeleted: boolean
    dueDate: string
    ownerId: string
    linkAttachments: any[]
    owner: Owner
    issueId?: string
    saveHistoryDescription: boolean
    priorityType: TodoPriorityType
    isSendWarning?: boolean
    doneAt?: string
    issue?: Issue
    isOverduedate: 0 | 1
    totalComments?: number
    companyId?: string
}

export interface TodoListResponse {
    items: Todo[]
    itemPerPage: number
    page: number
    total: number
}

export interface TodoListParams {
    getAll?: boolean
    inMeeting?: boolean
    isArchived?: boolean
    itemPerPage?: number
    page?: number
    teamIds?: string
}

export interface CreateTodoInput {
    ownerId: string
    teamId: string
    title: string
    description?: string
    dueDate: string
    status: TodoStatus
    linkAttachments?: any[]
    isPrivated?: boolean
    priorityType?: TodoPriorityType
    saveHistoryDescription?: boolean
}

export interface UpdateTodoInput extends Partial<CreateTodoInput> {
    // All fields from CreateTodoInput are optional for updates
}
