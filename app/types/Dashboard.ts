import { User } from "./User"

export interface Widget {
    _id: string
    name: string
    widgetType: string
    teamIds: string[]
    type?: string
    position: number[]
    ownerIds: string[]
    queryUrl: string
    createdAt: string
    updatedAt: string
    dashboardId: string
    companyId: string
    syncGlobalTime: boolean
    advancedFilter?: {
        sessions: any[]
        statuses: any[]
        types: any[]
        dateRange: string
    }
    includeMilestones?: boolean
    readOnly?: boolean
    groupBy?: string
    source?: string
    chartType?: string
    scorecardId?: string
    timeRange?: string
    meetingField?: string
    interval?: number
    includeArchived?: boolean
    timeStart?: string
    timeEnd?: string
    teamId?: string
}

export interface Dashboard {
    _id: string
    name: string
    createdAt: string
    isFeatured: boolean
    updatedAt: string
    ownerId: string
    userIds: string[]
    accessControl: string
    sharedIds: string[]
    usersAccessControl: Record<string, string>
    shareds: User[]
    owner: User
    widgets: Widget[]
    bookmark: boolean
    currentAccessControl: string
}
