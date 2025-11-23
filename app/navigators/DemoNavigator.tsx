import { TextStyle, ViewStyle } from "react-native"
import { createNativeBottomTabNavigator } from "@bottom-tabs/react-navigation"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Icon } from "@/components/Icon"
import { EpisodeProvider } from "@/context/EpisodeContext"
import { translate } from "@/i18n/translate"
import { DemoCommunityScreen } from "@/screens/DemoCommunityScreen"
import { DemoDebugScreen } from "@/screens/DemoDebugScreen"
import { DemoPodcastListScreen } from "@/screens/DemoPodcastListScreen"
import { DemoShowroomScreen } from "@/screens/DemoShowroomScreen/DemoShowroomScreen"
import * as Screens from "@/screens"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import type { DemoTabParamList } from "./navigationTypes"

const Tab = createNativeBottomTabNavigator<DemoTabParamList>()

/**
 * This is the main navigator for the demo screens with a native bottom tab bar.
 * Each tab is a stack navigator with its own set of screens.
 * 
 * Uses native iOS UITabBarController with translucent blur effect (liquid glass).
 *
 * More info: https://callstackincubator.github.io/react-native-bottom-tabs/
 * @returns {JSX.Element} The rendered `DemoNavigator`.
 */
export function DemoNavigator() {
  const { bottom } = useSafeAreaInsets()
  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  return (
    <EpisodeProvider>
      <Tab.Navigator
        tabBarActiveTintColor={colors.tint}
        tabBarInactiveTintColor={colors.tintInactive}
        tabBarStyle={themed($tabBar)}
        tabLabelStyle={themed($tabBarLabel)}
        // Enable translucent blur effect (liquid glass) on iOS
        translucent={true}
      >
        <Tab.Screen
          name="TodoList"
          component={Screens.TodoListScreen}
          options={{
            tabBarLabel: translate("demoNavigator:todoListTab"),
            // Use SF Symbol for iOS native rendering
            tabBarIcon: () => ({ sfSymbol: "tray.fill" }),
          }}
        />

        <Tab.Screen
          name="GoalList"
          component={Screens.GoalListScreen}
          options={{
            tabBarLabel: translate("demoNavigator:goalListTab"),
            // Use SF Symbol for iOS native rendering
            tabBarIcon: () => ({ sfSymbol: "target" }),
          }}
        />

        {/* <Tab.Screen
          name="DemoCommunity"
          component={DemoCommunityScreen}
          options={{
            tabBarLabel: translate("demoNavigator:communityTab"),
            // Use SF Symbol for iOS native rendering
            tabBarIcon: () => ({ sfSymbol: "person.3" }),
          }}
        /> */}

        {/* <Tab.Screen
          name="DemoPodcastList"
          component={DemoPodcastListScreen}
          options={{
            tabBarLabel: translate("demoNavigator:podcastListTab"),
            // Use SF Symbol for iOS native rendering
            tabBarIcon: () => ({ sfSymbol: "mic" }),
          }}
        /> */}

        <Tab.Screen
          name="DashboardList"
          component={Screens.DashboardListScreen}
          options={{
            tabBarLabel: translate("demoNavigator:dashboardListTab"),
            // Use SF Symbol for iOS native rendering
            tabBarIcon: () => ({ sfSymbol: "chart.bar" }),
          }}
        />



        <Tab.Screen
          name="DemoDebug"
          component={DemoDebugScreen}
          options={{
            tabBarLabel: translate("demoNavigator:debugTab"),
            // Use SF Symbol for iOS native rendering
            tabBarIcon: () => ({ sfSymbol: "ant" }),
          }}
        />
        <Tab.Screen
          name="DemoShowroom"
          component={DemoShowroomScreen}
          options={{
            tabBarLabel: translate("demoNavigator:componentsTab"),
            // Use SF Symbol for iOS native rendering
            tabBarIcon: () => ({ sfSymbol: "square.grid.2x2" }),
          }}
        />

      </Tab.Navigator>
    </EpisodeProvider>
  )
}

const $tabBar: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
})

const $tabBarLabel: ThemedStyle<{
  fontFamily?: string
  fontSize?: number
  fontWeight?: string
}> = ({ typography }) => ({
  fontSize: 12,
  fontFamily: typography.primary.medium,
  fontWeight: "500",
})
