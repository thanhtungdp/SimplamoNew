import React, { useEffect, useState } from "react"
import { View, ScrollView, TextStyle, ViewStyle, ActivityIndicator } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Screen } from "@/components/Screen"
import { Header } from "@/components/Header"
import { Text } from "@/components/Text"
import { colors, spacing } from "@/theme"
import { AppStackParamList } from "@/navigators/navigationTypes"
import { rockApi } from "@/services/api/rockApi"
import { Rock, Milestone } from "@/types/Rock"
import { MilestoneProgressItem } from "./components/MilestoneProgressItem"
import { CheckInModal } from "./components/CheckInModal"

type Props = NativeStackScreenProps<AppStackParamList, "GoalDetail">

export const GoalDetailScreen: React.FC<Props> = ({ route, navigation }) => {
    const { rockId } = route.params
    const [rock, setRock] = useState<Rock | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null)
    const [isModalVisible, setIsModalVisible] = useState(false)

    useEffect(() => {
        fetchRockDetail()
    }, [rockId])

    const fetchRockDetail = async () => {
        setIsLoading(true)
        setError(null)

        const result = await rockApi.getRockDetail(rockId)

        if (result.kind === "ok") {
            setRock(result.data)
        } else {
            setError(result.message)
        }

        setIsLoading(false)
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    }

    const stripHtml = (html: string) => {
        return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ")
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "DONE":
                return colors.palette.angry500
            case "ON_TRACK":
                return colors.palette.primary500
            case "OFF_TRACK":
                return colors.error
            default:
                return colors.palette.neutral500
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "DONE":
                return "Hoàn thành"
            case "ON_TRACK":
                return "Đang thực hiện"
            case "OFF_TRACK":
                return "Chưa thực hiện"
            default:
                return status
        }
    }

    const getMilestoneStatusLabel = (status: string) => {
        switch (status) {
            case "DONE":
                return "Hoàn thành"
            case "ON_TRACK":
                return "Đang thực hiện"
            case "OFF_TRACK":
                return "Chưa thực hiện"
            default:
                return status
        }
    }

    const handleMilestonePress = (milestone: Milestone) => {
        setSelectedMilestone(milestone)
        setIsModalVisible(true)
    }

    const handleCheckInSubmit = async (milestoneId: string, percent: number, description: string) => {
        // TODO: Implement API call to update milestone progress
        console.log("Check-in:", { milestoneId, percent, description })

        // Refresh rock data after update
        await fetchRockDetail()
    }

    const renderMilestone = (milestone: Milestone) => {
        return (
            <MilestoneProgressItem
                key={milestone._id}
                milestone={milestone}
                onPress={handleMilestonePress}
            />
        )
    }

    if (isLoading) {
        return (
            <Screen preset="fixed" safeAreaEdges={["bottom"]} contentContainerStyle={$screenContent}>
                <Header title="Chi tiết mục tiêu" leftIcon="back" onLeftPress={() => navigation.goBack()} />
                <View style={$loadingContainer}>
                    <ActivityIndicator size="large" color={colors.tint} />
                </View>
            </Screen>
        )
    }

    if (error || !rock) {
        return (
            <Screen preset="fixed" safeAreaEdges={["bottom"]} contentContainerStyle={$screenContent}>
                <Header title="Chi tiết mục tiêu" leftIcon="back" onLeftPress={() => navigation.goBack()} />
                <View style={$errorContainer}>
                    <Text text={error || "Không tìm thấy mục tiêu"} style={$errorText} />
                </View>
            </Screen>
        )
    }

    return (
        <Screen preset="fixed" safeAreaEdges={["bottom"]} contentContainerStyle={$screenContent}>
            <Header title="Cập nhật Mục tiêu" leftIcon="back" onLeftPress={() => navigation.goBack()} />

            <ScrollView style={$scrollView} contentContainerStyle={$scrollContent}>
                {/* Title and Status */}
                <View style={$headerSection}>
                    <Text text={rock.title} preset="heading" style={$title} />

                    <View style={[$statusBadge, { backgroundColor: getStatusColor(rock.status) }]}>
                        <Text text={getStatusLabel(rock.status)} style={$statusText} />
                    </View>
                </View>

                {/* Tabs */}
                <View style={$tabsContainer}>
                    <View style={[$tab, $tabActive]}>
                        <Text text="Tổng Quan" style={[$tabText, $tabTextActive]} />
                    </View>
                    <View style={$tab}>
                        <Text text="Chi Tiết" style={$tabText} />
                    </View>
                </View>

                {/* Progress */}
                <View style={$section}>
                    <Text text={`${rock.progress || 0}%`} preset="heading" style={$progressText} />
                    <View style={$progressBar}>
                        <View style={[$progressFill, { width: `${rock.progress || 0}%` }]} />
                    </View>
                    <Text text={`${rock.doneMilestones}/${rock.totalMilestones} cột mốc hoàn thành`} style={$progressLabel} />
                </View>

                {/* Milestones */}
                <View style={$section}>
                    <Text text="Cột mốc" preset="subheading" style={$sectionTitle} />
                    {rock.milestones.length > 0 ? (
                        rock.milestones.map(renderMilestone)
                    ) : (
                        <Text text="Chưa có cột mốc nào" style={$emptyMilestoneText} />
                    )}
                </View>

                {/* Description */}
                <View style={$section}>
                    <Text text="Mô tả" preset="subheading" style={$sectionTitle} />
                    <View style={$sectionContent}>
                        <Text text={stripHtml(rock.description) || "Không có mô tả"} style={$descriptionText} />
                    </View>
                </View>

                {/* Details */}
                <View style={$section}>
                    <Text text="Chi tiết" preset="subheading" style={$sectionTitle} />
                    <View style={$sectionContent}>
                        <View style={$detailRow}>
                            <Text text="Người chịu trách nhiệm:" style={$detailLabel} />
                            <Text text={rock.rockOwner.fullName} style={$detailValue} />
                        </View>
                        <View style={$detailRow}>
                            <Text text="Hạn chót:" style={$detailLabel} />
                            <Text text={formatDate(rock.dueDate)} style={$detailValue} />
                        </View>
                        {rock.startDate && (
                            <View style={$detailRow}>
                                <Text text="Ngày bắt đầu:" style={$detailLabel} />
                                <Text text={formatDate(rock.startDate)} style={$detailValue} />
                            </View>
                        )}
                        <View style={$detailRow}>
                            <Text text="Loại:" style={$detailLabel} />
                            <Text text={rock.rockType === "company" ? "Công ty" : "Cá nhân"} style={$detailValue} />
                        </View>
                        <View style={$detailRow}>
                            <Text text="Phiên:" style={$detailLabel} />
                            <Text text={rock.sessionName} style={$detailValue} />
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Check-in Modal */}
            <CheckInModal
                visible={isModalVisible}
                milestone={selectedMilestone}
                onClose={() => setIsModalVisible(false)}
                onSubmit={handleCheckInSubmit}
            />
        </Screen>
    )
}

const $screenContent: ViewStyle = {
    flex: 1,
}

const $scrollView: ViewStyle = {
    flex: 1,
}

const $scrollContent: ViewStyle = {
    paddingBottom: spacing.xl,
}

const $loadingContainer: ViewStyle = {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
}

const $errorContainer: ViewStyle = {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
}

const $errorText: TextStyle = {
    color: colors.error,
    textAlign: "center",
}

const $headerSection: ViewStyle = {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
}

const $title: TextStyle = {
    marginBottom: spacing.sm,
}

const $statusBadge: ViewStyle = {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.sm,
}

const $statusText: TextStyle = {
    color: colors.palette.neutral100,
    fontSize: 14,
    fontWeight: "600",
}

const $tabsContainer: ViewStyle = {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
}

const $tab: ViewStyle = {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: "center",
}

const $tabActive: ViewStyle = {
    borderBottomWidth: 2,
    borderBottomColor: colors.palette.primary500,
}

const $tabText: TextStyle = {
    fontSize: 14,
    color: colors.textDim,
}

const $tabTextActive: TextStyle = {
    color: colors.palette.primary500,
    fontWeight: "600",
}

const $section: ViewStyle = {
    marginTop: spacing.md,
    padding: spacing.lg,
}

const $progressText: TextStyle = {
    textAlign: "center",
    marginBottom: spacing.xs,
}

const $progressBar: ViewStyle = {
    height: 8,
    backgroundColor: colors.palette.neutral200,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: spacing.xs,
}

const $progressFill: ViewStyle = {
    height: "100%",
    backgroundColor: colors.palette.primary500,
}

const $progressLabel: TextStyle = {
    textAlign: "center",
    fontSize: 12,
    color: colors.textDim,
}

const $sectionTitle: TextStyle = {
    marginBottom: spacing.sm,
}

const $sectionContent: ViewStyle = {
    marginTop: spacing.sm,
}

const $descriptionText: TextStyle = {
    lineHeight: 24,
    color: colors.text,
}

const $detailRow: ViewStyle = {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
}

const $detailLabel: TextStyle = {
    color: colors.textDim,
    flex: 1,
}

const $detailValue: TextStyle = {
    color: colors.text,
    flex: 2,
    textAlign: "right",
}

const $milestoneItem: ViewStyle = {
    padding: spacing.md,
    backgroundColor: colors.palette.neutral100,
    borderRadius: spacing.sm,
    marginBottom: spacing.sm,
}

const $milestoneHeader: ViewStyle = {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.xs,
}

const $milestoneTitle: TextStyle = {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
    marginRight: spacing.sm,
}

const $milestoneBadge: ViewStyle = {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.xs,
}

const $milestoneBadgeText: TextStyle = {
    fontSize: 12,
    fontWeight: "600",
    color: colors.palette.neutral100,
}

const $milestoneDetails: ViewStyle = {
    flexDirection: "row",
    justifyContent: "space-between",
}

const $milestoneDate: TextStyle = {
    fontSize: 12,
    color: colors.textDim,
}

const $milestoneAssignee: TextStyle = {
    fontSize: 12,
    color: colors.text,
}

const $emptyMilestoneText: TextStyle = {
    color: colors.textDim,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: spacing.md,
}
