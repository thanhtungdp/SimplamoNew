import React from "react"
import { View, TouchableOpacity, TextStyle, ViewStyle } from "react-native"
import { Text } from "@/components/Text"
import { UserAvatar } from "@/components/UserAvatar"
import { colors, spacing } from "@/theme"
import { Milestone } from "@/types/Rock"

interface MilestoneProgressItemProps {
    milestone: Milestone
    onPress: (milestone: Milestone) => void
}

export const MilestoneProgressItem: React.FC<MilestoneProgressItemProps> = ({ milestone, onPress }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    }

    const progress = milestone.currentPercent || 0
    const maxValue = milestone.toValue || 100
    const currentValue = milestone.fromValue !== undefined
        ? milestone.fromValue + ((maxValue - milestone.fromValue) * progress / 100)
        : (maxValue * progress / 100)

    const getProgressColor = () => {
        if (progress === 0) return colors.error
        if (progress < 50) return colors.palette.angry500
        if (progress < 100) return colors.palette.primary500
        return colors.palette.angry500
    }

    const getProgressBgColor = () => {
        if (progress === 0) return colors.palette.angry100
        if (progress < 50) return colors.palette.angry100
        if (progress < 100) return colors.palette.primary100
        return colors.palette.angry100
    }

    return (
        <TouchableOpacity style={$container} onPress={() => onPress(milestone)}>
            {/* Title */}
            <Text text={milestone.title} style={$title} numberOfLines={2} />

            {/* Date and Progress Badge Row */}
            <View style={$row}>
                <View style={$dateBadge}>
                    <Text text={formatDate(milestone.dueDate)} style={$dateText} />
                </View>

                <View style={[$progressBadge, { backgroundColor: getProgressBgColor() }]}>
                    <Text text={`${Math.round(progress)}%`} style={[$progressText, { color: getProgressColor() }]} />
                </View>
            </View>

            {/* Progress Bar with Labels */}
            <View style={$progressContainer}>
                {/* Value Labels */}
                <View style={$labelsRow}>
                    <Text text={milestone.fromValue?.toString() || "0"} style={$labelText} />
                    {milestone.type === "MEASURABLE" && milestone.unit === "NUMBER" && (
                        <Text text={Math.round(currentValue).toString()} style={[$labelText, $currentValue]} />
                    )}
                    <Text text={maxValue.toString()} style={$labelText} />
                </View>

                {/* Progress Bar */}
                <View style={$progressBar}>
                    <View style={[$progressFill, { width: `${progress}%`, backgroundColor: getProgressColor() }]}>
                        {/* Slider Thumb */}
                        <View style={[$thumb, { backgroundColor: getProgressColor() }]} />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const $container: ViewStyle = {
    padding: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
}

const $title: TextStyle = {
    fontSize: 15,
    color: colors.palette.angry500,
    marginBottom: spacing.sm,
    lineHeight: 22,
}

const $row: ViewStyle = {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
}

const $dateBadge: ViewStyle = {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.palette.angry500,
}

const $dateText: TextStyle = {
    fontSize: 12,
    color: colors.palette.angry500,
}

const $progressBadge: ViewStyle = {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.md,
}

const $progressText: TextStyle = {
    fontSize: 14,
    fontWeight: "600",
}

const $progressContainer: ViewStyle = {
    marginTop: spacing.xs,
}

const $labelsRow: ViewStyle = {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xxs,
}

const $labelText: TextStyle = {
    fontSize: 11,
    color: colors.textDim,
}

const $currentValue: TextStyle = {
    color: colors.text,
    fontWeight: "600",
}

const $progressBar: ViewStyle = {
    height: 8,
    backgroundColor: colors.palette.neutral200,
    borderRadius: 4,
    overflow: "visible",
    position: "relative",
}

const $progressFill: ViewStyle = {
    height: "100%",
    borderRadius: 4,
    position: "relative",
    justifyContent: "center",
    alignItems: "flex-end",
}

const $thumb: ViewStyle = {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.background,
    position: "absolute",
    right: -8,
}
