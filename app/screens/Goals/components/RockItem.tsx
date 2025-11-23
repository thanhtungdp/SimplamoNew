import React from "react"
import { View, TouchableOpacity, TextStyle, ViewStyle } from "react-native"
import { Text } from "@/components/Text"
import { Icon } from "@/components/Icon"
import { UserAvatar } from "@/components/UserAvatar"
import { colors, spacing } from "@/theme"
import { Rock } from "@/types/Rock"

interface RockItemProps {
    rock: Rock
    onPress: (id: string) => void
}

export const RockItem: React.FC<RockItemProps> = ({ rock, onPress }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "DONE":
                return colors.palette.angry500 // Green
            case "ON_TRACK":
                return colors.palette.primary500 // Blue
            case "OFF_TRACK":
                return colors.error // Red
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

    const progressPercent = rock.progress || 0

    return (
        <TouchableOpacity style={$container} onPress={() => onPress(rock._id)}>
            {/* Collapse Icon */}
            <Icon icon="caretRight" size={16} color={colors.textDim} style={$collapseIcon} />

            {/* Content */}
            <View style={$content}>
                {/* Title */}
                <Text
                    text={rock.title}
                    style={$title}
                    numberOfLines={2}
                />

                {/* Bottom Row */}
                <View style={$bottomRow}>
                    {/* Date */}
                    <View style={$dateContainer}>
                        <Icon icon="components" size={14} color={colors.textDim} />
                        <Text text={formatDate(rock.dueDate)} style={$dateText} />
                    </View>

                    {/* Avatar */}
                    <UserAvatar
                        name={rock.rockOwner.fullName}
                        avatar={rock.rockOwner.avatar}
                        size={24}
                        style={$avatar}
                    />

                    {/* Owner Name */}
                    <Text text={rock.rockOwner.fullName} style={$ownerName} numberOfLines={1} />

                    {/* Progress Badge */}
                    <View style={[$progressBadge, { backgroundColor: getStatusColor(rock.status) }]}>
                        <Text text={`${progressPercent}%`} style={$progressText} />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const $container: ViewStyle = {
    flexDirection: "row",
    padding: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: "flex-start",
}

const $collapseIcon: ViewStyle = {
    marginRight: spacing.xs,
    marginTop: spacing.xxs,
}

const $content: ViewStyle = {
    flex: 1,
}

const $title: TextStyle = {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: spacing.xs,
}

const $bottomRow: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xs,
}

const $dateContainer: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    marginRight: spacing.sm,
}

const $dateText: TextStyle = {
    fontSize: 12,
    color: colors.textDim,
    marginLeft: spacing.xxs,
}

const $avatar: ViewStyle = {
    marginRight: spacing.xs,
}

const $ownerName: TextStyle = {
    fontSize: 12,
    color: colors.text,
    flex: 1,
}

const $progressBadge: ViewStyle = {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.xs,
    marginLeft: spacing.xs,
}

const $progressText: TextStyle = {
    fontSize: 12,
    fontWeight: "600",
    color: colors.palette.neutral100,
}
