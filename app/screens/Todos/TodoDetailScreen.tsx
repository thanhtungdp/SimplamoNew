import React, { useEffect, useState } from "react"
import { View, ScrollView, TextStyle, ViewStyle, ActivityIndicator } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Screen } from "@/components/Screen"
import { Header } from "@/components/Header"
import { Text } from "@/components/Text"
import { colors, spacing } from "@/theme"
import { AppStackParamList } from "@/navigators/navigationTypes"
import { todoApi } from "@/services/api/todoApi"
import { Todo } from "@/types/Todo"

type Props = NativeStackScreenProps<AppStackParamList, "TodoDetail">

export const TodoDetailScreen: React.FC<Props> = ({ route, navigation }) => {
    const { todoId } = route.params
    const [todo, setTodo] = useState<Todo | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchTodoDetail()
    }, [todoId])

    const fetchTodoDetail = async () => {
        setIsLoading(true)
        setError(null)

        const result = await todoApi.getTodoDetail(todoId)

        if (result.kind === "ok") {
            setTodo(result.data)
        } else {
            setError(result.message)
        }

        setIsLoading(false)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "DONE":
                return colors.palette.angry500 // Green success color
            case "ON_TRACK":
                return colors.palette.primary500
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
            default:
                return status
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    }

    // Strip HTML tags for simple display (you can use a proper HTML renderer later)
    const stripHtml = (html: string) => {
        return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ")
    }

    if (isLoading) {
        return (
            <Screen preset="fixed" safeAreaEdges={["top", "bottom"]}>
                <Header title="Chi tiết" leftIcon="back" onLeftPress={() => navigation.goBack()} />
                <View style={$loadingContainer}>
                    <ActivityIndicator size="large" color={colors.tint} />
                </View>
            </Screen>
        )
    }

    if (error || !todo) {
        return (
            <Screen preset="fixed" safeAreaEdges={["top", "bottom"]}>
                <Header title="Chi tiết" leftIcon="back" onLeftPress={() => navigation.goBack()} />
                <View style={$errorContainer}>
                    <Text text={error || "Không tìm thấy todo"} style={$errorText} />
                </View>
            </Screen>
        )
    }

    return (
        <Screen preset="fixed" safeAreaEdges={["bottom"]} contentContainerStyle={$screenContent}>
            <Header title={todo.title} leftIcon="back" onLeftPress={() => navigation.goBack()} />

            <ScrollView style={$scrollView} contentContainerStyle={$scrollContent}>
                {/* Title and Status */}
                <View style={$headerSection}>
                    <Text text={todo.title} preset="heading" style={$title} />

                    <View style={[$statusBadge, { backgroundColor: getStatusColor(todo.status) }]}>
                        <Text text={getStatusLabel(todo.status)} style={$statusText} />
                    </View>
                </View>

                {/* Description Section */}
                <View style={$section}>
                    <Text text="Mô tả" preset="subheading" style={$sectionTitle} />
                    <View style={$sectionContent}>
                        <Text text={stripHtml(todo.description) || "Không có mô tả"} style={$descriptionText} />
                    </View>
                </View>

                {/* Chi tiết Section */}
                <View style={$section}>
                    <Text text="Chi tiết" preset="subheading" style={$sectionTitle} />
                    <View style={$sectionContent}>
                        <View style={$detailRow}>
                            <Text text="Người thực hiện:" style={$detailLabel} />
                            <Text text={todo.owner.fullName} style={$detailValue} />
                        </View>
                        <View style={$detailRow}>
                            <Text text="Hạn chót:" style={$detailLabel} />
                            <Text text={formatDate(todo.dueDate)} style={$detailValue} />
                        </View>
                        {todo.priorityType && (
                            <View style={$detailRow}>
                                <Text text="Độ ưu tiên:" style={$detailLabel} />
                                <Text text={todo.priorityType} style={$detailValue} />
                            </View>
                        )}
                        {todo.issue && (
                            <View style={$detailRow}>
                                <Text text="Vấn đề liên quan:" style={$detailLabel} />
                                <Text text={todo.issue.title} style={$detailValue} />
                            </View>
                        )}
                    </View>
                </View>

                {/* Trường khác Section */}
                <View style={$section}>
                    <Text text="Trường khác" preset="subheading" style={$sectionTitle} />
                    <View style={$sectionContent}>
                        <View style={$detailRow}>
                            <Text text="Ngày tạo:" style={$detailLabel} />
                            <Text text={formatDate(todo.createdAt)} style={$detailValue} />
                        </View>
                        <View style={$detailRow}>
                            <Text text="Cập nhật lần cuối:" style={$detailLabel} />
                            <Text text={formatDate(todo.updatedAt)} style={$detailValue} />
                        </View>
                    </View>
                </View>

                {/* Comments Section - Placeholder */}
                <View style={$section}>
                    <Text text="Nhận xét" preset="subheading" style={$sectionTitle} />
                    <View style={$sectionContent}>
                        <Text text="Tính năng bình luận sẽ được triển khai sau" style={$placeholderText} />
                    </View>
                </View>
            </ScrollView>
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

const $section: ViewStyle = {
    marginTop: spacing.md,
}

const $sectionTitle: TextStyle = {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.palette.neutral200,
}

const $sectionContent: ViewStyle = {
    padding: spacing.lg,
    backgroundColor: colors.background,
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

const $placeholderText: TextStyle = {
    color: colors.textDim,
    fontStyle: "italic",
    textAlign: "center",
}
