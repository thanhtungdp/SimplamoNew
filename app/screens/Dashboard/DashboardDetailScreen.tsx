import React, { useState, useEffect, useRef } from "react"
import { View, ViewStyle, StyleSheet, Dimensions, Animated } from "react-native"
import { WebView } from "react-native-webview"
import { Screen } from "@/components/Screen"
import { Header } from "@/components/Header"
import { useAuthStore } from "@/stores/useAuthStore"
import { colors } from "@/theme"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackParamList } from "@/navigators/navigationTypes"
import { useSafeAreaInsets } from "react-native-safe-area-context"

type Props = NativeStackScreenProps<AppStackParamList, "DashboardDetail">

const { width } = Dimensions.get("window")

import Config from "@/config"

// ...

export const DashboardDetailScreen: React.FC<Props> = ({ route, navigation }) => {
    const { dashboardId, name } = route.params
    const token = useAuthStore((state) => state.token)
    const tenant = useAuthStore((state) => state.tenant)
    const [isLoading, setIsLoading] = useState(true)
    const { top } = useSafeAreaInsets()

    // Cleaned up URL construction
    const url = `https://${tenant}.${Config.WEB_URL_DOMAIN}/dashboard/${dashboardId}?hide_sidebar=true&hide_header=true&hide_ai=true`

    // Inject cookie via header for the initial request
    const headers = {
        Cookie: `AUTH=${token}`,
    }

    // Also inject cookie via JavaScript to ensure it persists for client-side requests
    const injectedJavaScript = `
      document.cookie = "AUTH=${token}; path=/; secure; samesite=strict";
      true;
    `

    // Animation for skeleton
    const opacity = useRef(new Animated.Value(0.3)).current

    useEffect(() => {
        if (isLoading) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(opacity, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacity, {
                        toValue: 0.3,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ])
            ).start()
        }
    }, [isLoading])

    const SkeletonItem = ({ style }: { style: ViewStyle }) => (
        <Animated.View style={[style, { opacity, backgroundColor: colors.palette.neutral300 }]} />
    )

    return (
        <Screen preset="fixed" safeAreaEdges={["bottom"]} contentContainerStyle={$screenContent}>
            <Header
                title={name}
                leftIcon="back"
                onLeftPress={() => navigation.goBack()}
            />
            <WebView
                source={{ uri: url, headers }}
                style={$webview}
                onLoadStart={() => setIsLoading(true)}
                onLoadEnd={() => {
                    setTimeout(() => {
                        setIsLoading(false)
                    }, 1500)
                }}
                domStorageEnabled={true}
                cacheEnabled={true} // Caching is enabled
                startInLoadingState={false}
                sharedCookiesEnabled={true}
                injectedJavaScriptBeforeContentLoaded={injectedJavaScript}
                javaScriptEnabled={true}
            />

            {isLoading && (
                <View style={$skeletonContainer}>
                    {/* Pattern 1: Rectangle + Rectangle */}
                    <View style={$skeletonRow}>
                        <SkeletonItem style={$skeletonRectangle} />
                        <SkeletonItem style={$skeletonRectangle} />
                    </View>

                    {/* Pattern 2: Rectangle */}
                    <SkeletonItem style={$skeletonFullRectangle} />

                    {/* Repeat Pattern 1: Rectangle + Rectangle */}
                    <View style={$skeletonRow}>
                        <SkeletonItem style={$skeletonRectangle} />
                        <SkeletonItem style={$skeletonRectangle} />
                    </View>

                    {/* Repeat Pattern 2: Rectangle */}
                    <SkeletonItem style={$skeletonFullRectangle} />

                </View>
            )}
        </Screen>
    )
}

const $screenContent: ViewStyle = {
    flex: 1,
}

const $webview: ViewStyle = {
    flex: 1,
    backgroundColor: colors.background,
}

const $skeletonContainer: ViewStyle = {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
    padding: 20,
    zIndex: 1,
    marginTop: 100, // Adjust for header
}

const $skeletonRow: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 10,
}

const $skeletonRectangle: ViewStyle = {
    height: 80,
    flex: 1,
    borderRadius: 8,
}

const $skeletonFullRectangle: ViewStyle = {
    height: 120,
    width: "100%",
    borderRadius: 8,
    marginBottom: 15,
}

const $skeletonCircle: ViewStyle = {
    width: 60,
    height: 60,
    borderRadius: 30,
}

const $skeletonSquare: ViewStyle = {
    width: 60,
    height: 60,
    borderRadius: 8,
}
