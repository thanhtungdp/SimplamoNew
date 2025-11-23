import React, { useEffect } from "react"
import { View, FlatList, RefreshControl, TextStyle, ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Screen } from "@/components/Screen"
import { Header } from "@/components/Header"
import { Text } from "@/components/Text"
import { colors, spacing } from "@/theme"
import { DemoTabScreenProps } from "@/navigators/navigationTypes"
import { useTodoStore } from "@/stores/useTodoStore"
import { useAuthStore } from "@/stores/useAuthStore"
import { TodoItem } from "./components/TodoItem"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export const TodoListScreen: React.FC<DemoTabScreenProps<"TodoList">> = ({ navigation }) => {
    // Zustand store (individual selectors)
    const todos = useTodoStore((state) => state.todos)
    const isLoading = useTodoStore((state) => state.isLoading)
    const fetchTodos = useTodoStore((state) => state.fetchTodos)
    const toggleTodoStatus = useTodoStore((state) => state.toggleTodoStatus)
    const loadMore = useTodoStore((state) => state.loadMore)
    const total = useTodoStore((state) => state.total)

    // Auth store
    const user = useAuthStore((state) => state.user)

    const { bottom } = useSafeAreaInsets()

    useEffect(() => {
        // Fetch todos on mount
        // You can pass teamIds here if needed
        fetchTodos()
    }, [])

    const handleTodoPress = (todoId: string) => {
        navigation.navigate("TodoDetail", { todoId })
    }

    const handleToggle = (todoId: string) => {
        toggleTodoStatus(todoId)
    }

    const handleRefresh = () => {
        fetchTodos()
    }

    const handleLoadMore = () => {
        if (todos.length < total && !isLoading) {
            loadMore()
        }
    }

    return (
        <Screen preset="fixed" safeAreaEdges={["bottom"]} contentContainerStyle={$screenContent}>
            <Header title="Hành động" />

            <FlatList
                data={todos}
                renderItem={({ item }) => (
                    <TodoItem
                        todo={item}
                        onPress={handleTodoPress}
                        onToggle={handleToggle}
                    />
                )}
                keyExtractor={(item) => item._id}
                contentContainerStyle={[$listContent, { paddingBottom: bottom + spacing.lg }]}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
                }
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={
                    !isLoading ? (
                        <View style={$emptyContainer}>
                            <Text text="Không có hành động nào" style={$emptyText} />
                        </View>
                    ) : null
                }
            />
        </Screen>
    )
}

const $screenContent: ViewStyle = {
    flex: 1,
}

const $listContent: ViewStyle = {
    flexGrow: 1,
}

const $emptyContainer: ViewStyle = {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.xxl,
}

const $emptyText: TextStyle = {
    color: colors.textDim,
    fontSize: 16,
}
