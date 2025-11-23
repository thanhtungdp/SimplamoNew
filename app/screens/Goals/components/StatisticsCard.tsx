import React from "react"
import { View, TextStyle, ViewStyle } from "react-native"
import { Text } from "@/components/Text"
import { colors, spacing } from "@/theme"
import { RockStatistics } from "@/types/Rock"

interface StatisticsCardProps {
    statistics: RockStatistics | null
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({ statistics }) => {
    if (!statistics) return null

    return (
        <View style={$container}>
            <Text text="Tổng Quan" preset="subheading" style={$title} />

            <View style={$statsGrid}>
                {/* Total Rocks */}
                <View style={$statItem}>
                    <Text text={statistics.totalRocks.toString()} style={$statValue} />
                    <Text text="Tổng mục tiêu" style={$statLabel} />
                </View>

                {/* On Track */}
                <View style={$statItem}>
                    <Text text={statistics.onTrackRocks.toString()} style={[$statValue, { color: colors.palette.primary500 }]} />
                    <Text text="Đang thực hiện" style={$statLabel} />
                </View>

                {/* Done */}
                <View style={$statItem}>
                    <Text text={statistics.doneRocks.toString()} style={[$statValue, { color: colors.palette.angry500 }]} />
                    <Text text="Hoàn thành" style={$statLabel} />
                </View>

                {/* Off Track */}
                <View style={$statItem}>
                    <Text text={statistics.offTrackRocks.toString()} style={[$statValue, { color: colors.error }]} />
                    <Text text="Chưa thực hiện" style={$statLabel} />
                </View>

                {/* Average Progress */}
                <View style={$statItem}>
                    <Text text={`${statistics.averageProgress}%`} style={$statValue} />
                    <Text text="Tiến độ TB" style={$statLabel} />
                </View>

                {/* Milestones */}
                <View style={$statItem}>
                    <Text text={`${statistics.doneMilestones}/${statistics.totalMilestones}`} style={$statValue} />
                    <Text text="Cột mốc" style={$statLabel} />
                </View>
            </View>
        </View>
    )
}

const $container: ViewStyle = {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
}

const $title: TextStyle = {
    marginBottom: spacing.sm,
}

const $statsGrid: ViewStyle = {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -spacing.xs,
}

const $statItem: ViewStyle = {
    width: "33.33%",
    padding: spacing.xs,
    alignItems: "center",
    marginBottom: spacing.sm,
}

const $statValue: TextStyle = {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xxs,
}

const $statLabel: TextStyle = {
    fontSize: 11,
    color: colors.textDim,
    textAlign: "center",
}
