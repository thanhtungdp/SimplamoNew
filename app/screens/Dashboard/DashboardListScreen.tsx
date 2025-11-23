import React, { useEffect } from "react"
import { View, FlatList, TouchableOpacity, RefreshControl, TextStyle, ViewStyle } from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useDashboardStore } from "@/stores/useDashboardStore"
import { Dashboard } from "@/types/Dashboard"
import { DemoTabScreenProps } from "@/navigators/navigationTypes"
import { colors, spacing } from "@/theme"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Icon } from "@/components/Icon"

export const DashboardListScreen: React.FC<DemoTabScreenProps<"DashboardList">> = ({ navigation }) => {
    // Zustand store (individual selectors)
    const dashboards = useDashboardStore((state) => state.dashboards)
    const isLoading = useDashboardStore((state) => state.isLoading)
    const fetchDashboards = useDashboardStore((state) => state.fetchDashboards)

    console.log(dashboards)

    const { bottom } = useSafeAreaInsets()

    useEffect(() => {
        fetchDashboards()
    }, [])

    const handlePress = (dashboard: Dashboard) => {
        navigation.navigate("DashboardDetail", { dashboardId: dashboard._id, name: dashboard.name })
    }

    const renderItem = ({ item }: { item: Dashboard }) => (
        <TouchableOpacity style={$item} onPress={() => handlePress(item)}>
            <View style={$itemContent}>
                <Text style={$itemName}>{item.name}</Text>
                {item.isFeatured && <Icon icon="heart" color={colors.palette.primary500} size={20} />}
            </View>
        </TouchableOpacity>
    )

    return (
        <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$screenContent}>
            <View style={$header}>
                <Text preset="heading" text="Dashboards" />
            </View>
            <FlatList
                data={dashboards}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={[$listContent, { paddingBottom: bottom + spacing.lg }]}
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchDashboards} />}
                ListEmptyComponent={
                    !isLoading ? <Text style={$emptyText} text="No dashboards found" /> : null
                }
            />
        </Screen>
    )
}

const $screenContent: ViewStyle = {
    flex: 1,
}

const $header: ViewStyle = {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
}

const $listContent: ViewStyle = {
    paddingHorizontal: spacing.lg,
}

const $item: ViewStyle = {
    backgroundColor: colors.palette.neutral100,
    padding: spacing.md,
    borderRadius: spacing.sm,
    marginBottom: spacing.sm,
}

const $itemContent: ViewStyle = {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
}

const $itemName: TextStyle = {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
}

const $emptyText: TextStyle = {
    textAlign: "center",
    marginTop: spacing.xl,
    color: colors.textDim,
}
