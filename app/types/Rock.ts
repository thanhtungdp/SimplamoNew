/**
 * Goals (Rocks) Type Definitions
 * Based on Simplamo API: /eos-core/rocks
 */

export type RockStatus = "ON_TRACK" | "OFF_TRACK" | "DONE"
export type RockType = "company" | "individual"
export type MilestoneStatus = "ON_TRACK" | "OFF_TRACK" | "DONE"
export type MilestoneType = "MEASURABLE" | "TRACKED"
export type MilestoneUnit = "ACHIEVABLE" | "NUMBER" | "PERCENTAGE" | "CURRENCY"

export interface Owner {
    _id: string
    email: string
    fullName: string
    avatar: string
}

export interface MilestoneStep {
    _id: string
    title: string
    startDay: string
    endDay: string
    percentDone: number
}

export interface MilestoneRecord {
    percent: number
    description: string
    dateTime: string
    updatedById: string
}

export interface Milestone {
    _id: string
    title: string
    rockId: string
    priority: number
    status: MilestoneStatus
    dueDate: string
    createdAt: string
    updatedAt: string
    startDate: string
    description: string
    isDeleted: boolean
    assigneeId: string
    assignee: Owner
    ownerId: string
    type: MilestoneType
    unit?: MilestoneUnit
    fromValue?: number
    toValue?: number
    currentPercent: number | null
    steps: MilestoneStep[]
    records: MilestoneRecord[]
    isManualStatus: boolean
    linkAttachments: any[]
    currency?: string
    meetingId?: string | null
    isSendWarning?: boolean
    issueIds?: string[]
    todoIds?: string[]
    workspaceId?: string
}

export interface Rock {
    _id: string
    title: string
    teamId: string
    teamIds: string[]
    sessionShared: Record<string, any>
    dataSource: string
    companyId: string
    dueDate: string
    startDate?: string
    rockType: RockType
    status: RockStatus
    isArchived: boolean
    description: string
    linkType: string
    calculateForParent: boolean
    isDeleted: boolean
    isManualStatus: boolean
    sessionId: string
    sessionIds: string[]
    createdAt: string
    updatedAt: string
    ownerId: string
    rockOwner: Owner
    linkAttachments: any[]
    parentId: string
    strategyId: string
    percentDone?: number
    milestones: Milestone[]
    alignChildRocks: any[]
    doneMilestones: number
    totalMilestones: number
    progress: number
    priority: number
    totalComments: number
    sessionName: string
    weight?: number | null
}

export interface RockListParams {
    teamId?: string
    rock?: string
    pic?: string
    rangeStart?: string
    rangeEnd?: string
    sessionId?: string
}

export interface CreateRockInput {
    title: string
    teamId: string
    dueDate: string
    startDate?: string
    rockType: RockType
    status: RockStatus
    description?: string
    ownerId: string
    sessionId: string
}

export interface UpdateRockInput extends Partial<CreateRockInput> {
    // All fields from CreateRockInput are optional for updates
}

// Statistics for CEO dashboard
export interface RockStatistics {
    totalRocks: number
    onTrackRocks: number
    offTrackRocks: number
    doneRocks: number
    averageProgress: number
    totalMilestones: number
    doneMilestones: number
}
