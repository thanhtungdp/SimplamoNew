import React, { useEffect } from "react"
import { View, FlatList, RefreshControl, TextStyle, ViewStyle } from "react-native"
import { Screen } from "@/components/Screen"
import { Header } from "@/components/Header"
import { Text } from "@/components/Text"
import { colors, spacing } from "@/theme"
import { DemoTabScreenProps } from "@/navigators/navigationTypes"
import { useRockStore } from "@/stores/useRockStore"
import { RockItem } from "./components/RockItem"
import { StatisticsCard } from "./components/StatisticsCard"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export const GoalListScreen: React.FC<DemoTabScreenProps<"GoalList">> = ({ navigation }) => {
    // Zustand store (individual selectors)
    const rocks = useRockStore((state) => state.rocks)
    const isLoading = useRockStore((state) => state.isLoading)
    const statistics = useRockStore((state) => state.statistics)
    const fetchRocks = useRockStore((state) => state.fetchRocks)

    const { bottom } = useSafeAreaInsets()

    useEffect(() => {
        // Fetch rocks on mount
        // You can pass teamId and sessionId here if needed
        fetchRocks({ teamId: "60fd7f693e81570057440b4f" })
    }, [])

    const handleRockPress = (rockId: string) => {
        navigation.navigate("GoalDetail", { rockId })
    }

    const handleRefresh = () => {
        fetchRocks({ teamId: "60fd7f693e81570057440b4f" })
    }

    return (
        <Screen preset="fixed" safeAreaEdges={["bottom"]} contentContainerStyle={$screenContent}>
            <Header title="Mục tiêu" />

            <FlatList
                data={rocks}
                renderItem={({ item }) => (
                    <RockItem
                        rock={item}
                        onPress={handleRockPress}
                    />
                )}
                keyExtractor={(item) => item._id}
                contentContainerStyle={[$listContent, { paddingBottom: bottom + spacing.lg }]}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
                }
                ListHeaderComponent={<StatisticsCard statistics={statistics} />}
                ListEmptyComponent={
                    !isLoading ? (
                        <View style={$emptyContainer}>
                            <Text text="Không có mục tiêu nào" style={$emptyText} />
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
