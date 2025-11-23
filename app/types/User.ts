export interface Tenant {
    _id: string
    name: string
    key: string
    model: string
    dbHost: string
    dbName: string
    dbUser: string
    organizationalNumber: number
    industry: string
    timeSpentEOS: string
    hasCoach: boolean
    website: string
    logo: string
    hearAboutUsFrom: string
    updateProfilePicture: boolean
    changeLogoOfWorkSpace: boolean
    createTeam: boolean
    createVTO: boolean
    setUpAC: boolean
    createRocks: boolean
    runFirstMeeting: boolean
    isActive: boolean
    isSendNotiWarningTrialing: boolean
    createdAt: string
    updatedAt: string
    timeZone: number
    lastActivity: string
    dataOptional: {
        isTryNewFormDesign: boolean
    }
}

export interface Subscription {
    status: string
    expiredAt: string
    subscriptionType: string
}

export interface MagicLinkCode {
    digitCode: string
    expiredAt: string
}

export interface LastReleaseNote {
    _bsontype: string
    id: {
        type: string
        data: number[]
    }
}

export interface User {
    _id: string
    email: string
    fullName: string
    avatar: string
    phone: string
    birthday: string
    address: string
    bio: string
    language: string
    lastUpdatePassword: string
    lastActivity: string
    hasKnowledgeWeb: boolean
    hasKnowledgeMobile: boolean | null
    lastLogin: string
    employeeCode: string
    lastReleaseNote: LastReleaseNote
    isTryNewLayout: boolean
    isVerify: boolean
    isAcceptInvite: boolean
    isVerifyRegister: boolean
    isSetPassword: boolean
    isActive: boolean
    isFullFillData: boolean
    role: string
    magicLinkCode: MagicLinkCode
    privateApps: any[]
    createdAt: string
    updatedAt: string
    subscription: Subscription
    tenant: Tenant
}
