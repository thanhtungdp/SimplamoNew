import React from "react"
import { View, TouchableOpacity, TextStyle, ViewStyle } from "react-native"
import { Text } from "@/components/Text"
import { Icon } from "@/components/Icon"
import { UserAvatar } from "@/components/UserAvatar"
import { colors, spacing } from "@/theme"
import { Todo } from "@/types/Todo"

interface TodoItemProps {
    todo: Todo
    onPress: (id: string) => void
    onToggle: (id: string) => void
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onPress, onToggle }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    }

    const isDone = todo.status === "DONE"

    return (
        <TouchableOpacity style={$container} onPress={() => onPress(todo._id)}>
            {/* Checkbox */}
            <TouchableOpacity
                style={[$checkbox, isDone && $checkboxChecked]}
                onPress={() => onToggle(todo._id)}
            >
                {isDone && <Icon icon="check" size={16} color={colors.palette.neutral100} />}
            </TouchableOpacity>

            {/* Content */}
            <View style={$content}>
                {/* Title */}
                <Text
                    text={todo.title}
                    style={[$title, isDone && $titleDone]}
                    numberOfLines={2}
                />

                {/* Bottom Row: Date, Avatar, Name */}
                <View style={$bottomRow}>
                    {/* Date Badge */}
                    <View style={$dateBadge}>
                        <Text text={formatDate(todo.dueDate)} style={$dateText} />
                    </View>

                    {/* Avatar */}
                    <UserAvatar
                        name={todo.owner.fullName}
                        avatar={todo.owner.avatar}
                        size={28}
                        style={$avatar}
                    />

                    {/* Owner Name */}
                    <Text text={todo.owner.fullName} style={$ownerName} numberOfLines={1} />

                    {/* Overdue Indicator */}
                    {todo.isOverduedate === 1 && !isDone && (
                        <View style={$overdueIndicator} />
                    )}
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

const $checkbox: ViewStyle = {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: spacing.sm,
    marginTop: spacing.xs,
    justifyContent: "center",
    alignItems: "center",
}

const $checkboxChecked: ViewStyle = {
    backgroundColor: colors.palette.primary500,
    borderColor: colors.palette.primary500,
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

const $titleDone: TextStyle = {
    textDecorationLine: "line-through",
    color: colors.textDim,
}

const $bottomRow: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xs,
}

const $dateBadge: ViewStyle = {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.xs,
    borderWidth: 1,
    borderColor: colors.palette.angry500,
    marginRight: spacing.sm,
}

const $dateText: TextStyle = {
    fontSize: 12,
    color: colors.palette.angry500,
}

const $avatar: ViewStyle = {
    marginRight: spacing.xs,
}

const $ownerName: TextStyle = {
    fontSize: 14,
    color: colors.text,
    flex: 1,
}

const $overdueIndicator: ViewStyle = {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
    marginLeft: spacing.xs,
}
