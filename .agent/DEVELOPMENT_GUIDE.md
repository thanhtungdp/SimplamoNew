# Feature Development Guide - SimplamoNew

> **This guide defines the standard workflow for developing ANY new feature in this mobile application.**

## 🎯 Feature Development Lifecycle

Every new feature MUST follow these steps in order:

### Step 1: Planning & Design
### Step 2: Type/Model Definition
### Step 3: API Integration
### Step 4: Storage & Caching Strategy
### Step 5: Screen Implementation
### Step 6: Testing & Verification
### Step 7: Technical Documentation

---

## 📋 Step 1: Planning & Design

### 1.1 Create Implementation Plan

**File**: `implementation_plan.md`

**Required Sections**:
```markdown
# [Feature Name] Implementation Plan

## Overview
- Brief description of the feature
- User problem being solved
- Expected outcomes

## UI/UX Design

### Wireframes/Mockups
- Include screenshots or design links
- Describe user flows
- List all screens needed

### Design Specifications
- Colors, spacing, typography
- Animations and transitions
- Loading states and error states

## User Review Required
- Breaking changes
- Design decisions requiring approval
- API changes or new endpoints

## Proposed Changes
[List all files to be created/modified, grouped by component]

## Verification Plan
- How to test the feature
- Expected behaviors
```

### 1.2 Get User Approval
- Present the implementation plan
- Discuss UI/UX design
- Iterate based on feedback
- **DO NOT proceed without approval**

---

## 🏗️ Step 2: Type/Model Definition

**Always start with types first!**

### 2.1 Create Type Definitions

**Location**: `app/types/[FeatureName].ts`

**Example**:
```typescript
// app/types/Dashboard.ts

/**
 * Dashboard entity from API
 */
export interface Dashboard {
  _id: string
  name: string
  createdAt: string
  isFeatured: boolean
  widgets: Widget[]
}

/**
 * Widget entity
 */
export interface Widget {
  _id: string
  name: string
  widgetType: string
  config: Record<string, any>
}

/**
 * API response types
 */
export interface DashboardsResponse {
  data: Dashboard[]
  total: number
}
```

### 2.2 Type Definition Checklist
- [ ] All API response types defined
- [ ] Entity interfaces documented
- [ ] Nullable fields properly typed (`field?: type`)
- [ ] Enums for fixed values
- [ ] JSDoc comments for complex types

---

## 🔌 Step 3: API Integration

### 3.1 Create API Service

**Location**: `app/services/api/[featureName]Api.ts`

**Template**:
```typescript
import { ApiResponse } from "apisauce"
import { api } from "./api"
import { Dashboard, DashboardsResponse } from "@/types/Dashboard"

export type DashboardsResult = 
  | { kind: "ok"; data: Dashboard[] }
  | { kind: "error"; message: string }

export const dashboardApi = {
  /**
   * Fetch all dashboards for the current user
   */
  getDashboards: async (): Promise<DashboardsResult> => {
    try {
      const response: ApiResponse<DashboardsResponse> = await api.get("/auth/dashboards")
      
      if (!response.ok) {
        return { 
          kind: "error", 
          message: response.data?.message || "Failed to fetch dashboards" 
        }
      }
      
      return { kind: "ok", data: response.data.data }
    } catch (e) {
      return { kind: "error", message: "Network error" }
    }
  },
}
```

### 3.2 API Integration Checklist
- [ ] Use `Config.API_URL` for base URL
- [ ] Proper error handling (try/catch)
- [ ] Result types with `kind` discriminator
- [ ] JSDoc comments for each function
- [ ] Type-safe responses

### 3.3 Configuration Management

**Always use config for URLs and domains**:

```typescript
// app/config/config.base.ts
export interface ConfigBaseProps {
  API_URL: string
  WEB_URL_DOMAIN: string
}

// Usage in code
import Config from "@/config"
const url = `https://${tenant}.${Config.WEB_URL_DOMAIN}/path`
```

---

## 💾 Step 4: Storage & Caching Strategy

### 4.1 Evaluate Caching Needs

**Questions to ask**:
1. Does this data need to persist offline?
2. Should data survive app restarts?
3. How often does data change?
4. What's the data size?

### 4.2 Storage Options

#### Option A: Zustand Store (with MMKV persistence)

**When to use**: Authentication state, user preferences, small datasets

```typescript
// app/stores/useFeatureStore.ts
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { zustandStorage } from "./mmkvStorage"

interface FeatureState {
  data: SomeType[]
  isLoading: boolean
  
  // Actions
  setData: (data: SomeType[]) => void
  clearData: () => void
}

export const useFeatureStore = create<FeatureState>()(
  persist(
    (set) => ({
      data: [],
      isLoading: false,
      
      setData: (data) => set({ data }),
      clearData: () => set({ data: [] }),
    }),
    {
      name: "feature-storage",
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        data: state.data,
      }),
    }
  )
)
```

#### Option B: React State (no persistence)

**When to use**: Temporary UI state, form inputs, ephemeral data

```typescript
const [data, setData] = useState<SomeType[]>([])
```

#### Option C: WebView Cache

**When to use**: Web content that should load faster on repeat visits

```typescript
<WebView
  cacheEnabled={true}
  domStorageEnabled={true}
  sharedCookiesEnabled={true}
/>
```

### 4.3 Caching Checklist
- [ ] Identified what needs caching
- [ ] Chosen appropriate storage method
- [ ] Implemented cache invalidation strategy
- [ ] Tested offline behavior (if applicable)

---

## 🎨 Step 5: Screen Implementation

### 5.1 Folder Structure

**CRITICAL**: For each new module, create a dedicated folder

```
app/screens/
├── [FeatureName]/              # ✅ Create folder for feature
│   ├── [FeatureName]ListScreen.tsx
│   ├── [FeatureName]DetailScreen.tsx
│   ├── components/             # Feature-specific components
│   │   ├── [FeatureName]Card.tsx
│   │   └── [FeatureName]Filter.tsx
│   └── index.ts               # Export all screens
```

**Example**: Dashboard Feature
```
app/screens/
├── Dashboard/
│   ├── DashboardListScreen.tsx
│   ├── DashboardDetailScreen.tsx
│   ├── components/
│   │   ├── DashboardCard.tsx
│   │   └── DashboardSkeleton.tsx
│   └── index.ts
```

### 5.2 Screen Template

```typescript
import React, { useState, useEffect } from "react"
import { View, ViewStyle, FlatList } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Screen } from "@/components/Screen"
import { Header } from "@/components/Header"
import { useAuthStore } from "@/stores/useAuthStore"
import { colors } from "@/theme"
import { AppStackParamList } from "@/navigators/navigationTypes"
import { featureApi } from "@/services/api/featureApi"
import { FeatureType } from "@/types/Feature"

type Props = NativeStackScreenProps<AppStackParamList, "FeatureList">

export const FeatureListScreen: React.FC<Props> = ({ navigation }) => {
  // 1. State
  const [data, setData] = useState<FeatureType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // 2. Store (individual selectors only!)
  const token = useAuthStore((state) => state.token)
  const userId = useAuthStore((state) => state.user?._id)
  
  // 3. Data fetching
  useEffect(() => {
    fetchData()
  }, [])
  
  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    
    const result = await featureApi.getData()
    
    if (result.kind === "ok") {
      setData(result.data)
    } else {
      setError(result.message)
    }
    
    setIsLoading(false)
  }
  
  // 4. Handlers
  const handleItemPress = (item: FeatureType) => {
    navigation.navigate("FeatureDetail", { id: item._id })
  }
  
  // 5. Render
  return (
    <Screen preset="fixed" safeAreaEdges={["top", "bottom"]}>
      <Header title="Feature" />
      
      {isLoading && <LoadingSkeleton />}
      
      {error && <ErrorMessage message={error} onRetry={fetchData} />}
      
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <FeatureCard item={item} onPress={() => handleItemPress(item)} />
        )}
        keyExtractor={(item) => item._id}
      />
    </Screen>
  )
}

// 6. Styles
const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}
```

### 5.3 Navigation Integration

#### Update Navigation Types
```typescript
// app/navigators/navigationTypes.ts

export type AppStackParamList = {
  // ... existing routes
  FeatureList: undefined
  FeatureDetail: { id: string; name: string }
}
```

#### Add to Navigator
```typescript
// app/navigators/AppNavigator.tsx

<Stack.Screen
  name="FeatureDetail"
  component={Screens.FeatureDetailScreen}
  options={{ headerShown: false }}
/>
```

### 5.4 Internationalization

**Add translations**:
```typescript
// app/i18n/en.ts

export default {
  // ... existing translations
  featureScreen: {
    title: "Features",
    emptyState: "No features found",
    errorLoading: "Failed to load features",
  },
}
```

**Use in components**:
```typescript
import { translate } from "@/i18n/translate"

<Text>{translate("featureScreen:title")}</Text>
```

### 5.5 Screen Implementation Checklist
- [ ] Created feature folder in `app/screens/[FeatureName]/`
- [ ] Implemented all screens
- [ ] Added to navigation types
- [ ] Integrated with navigator
- [ ] Added translations
- [ ] Implemented loading states (skeleton loaders)
- [ ] Implemented error states
- [ ] Added proper TypeScript types
- [ ] Used individual Zustand selectors

---

## 🧪 Step 6: Testing & Verification

### 6.1 Manual Testing

**Test Checklist**:
- [ ] Happy path works (normal user flow)
- [ ] Loading states display correctly
- [ ] Error states display correctly
- [ ] Empty states display correctly
- [ ] Navigation works (back button, deep links)
- [ ] Data persists correctly (if cached)
- [ ] Offline behavior (if applicable)
- [ ] Pull-to-refresh works (if applicable)

### 6.2 Platform Testing
- [ ] iOS simulator
- [ ] Android emulator (if applicable)
- [ ] Physical device (if available)

### 6.3 Edge Cases
- [ ] No internet connection
- [ ] API returns error
- [ ] Empty data set
- [ ] Large data set (performance)
- [ ] Rapid navigation (race conditions)

---

## 📝 Step 7: Technical Documentation

### 7.1 Create Walkthrough

**File**: `walkthrough.md`

**Required Sections**:
```markdown
# [Feature Name] - Implementation Walkthrough

## What Was Implemented

### Screens
- **[FeatureName]ListScreen**: Description
- **[FeatureName]DetailScreen**: Description

### API Integration
- Endpoint: `GET /api/feature`
- Response handling
- Error handling

### State Management
- Zustand store (if applicable)
- Caching strategy

### UI/UX Features
- Loading states (skeleton loaders)
- Error handling
- Empty states

## File Changes

### New Files
- `app/types/Feature.ts`
- `app/services/api/featureApi.ts`
- `app/screens/Feature/FeatureListScreen.tsx`
- `app/screens/Feature/FeatureDetailScreen.tsx`

### Modified Files
- `app/navigators/navigationTypes.ts`
- `app/navigators/AppNavigator.tsx`
- `app/i18n/en.ts`

## Verification Steps

1. Log in to the app
2. Navigate to Feature screen
3. Verify list loads correctly
4. Tap on an item
5. Verify detail screen loads
6. Test back navigation

## Screenshots

![Feature List](path/to/screenshot1.png)
![Feature Detail](path/to/screenshot2.png)

## Known Issues / Future Improvements
- List any limitations
- Suggest future enhancements
```

### 7.2 Update README (if needed)

Add feature to main README if it's a major addition.

---

## 🚨 Critical Rules & Best Practices

### Zustand State Management

**✅ CORRECT** - Individual selectors:
```typescript
const token = useAuthStore((state) => state.token)
const user = useAuthStore((state) => state.user)
```

**❌ WRONG** - Object destructuring (causes infinite loops):
```typescript
const { token, user } = useAuthStore((state) => ({ 
  token: state.token, 
  user: state.user 
}))
```

### Configuration

**✅ CORRECT** - Use config:
```typescript
import Config from "@/config"
const url = `https://${tenant}.${Config.WEB_URL_DOMAIN}/dashboard/${id}`
```

**❌ WRONG** - Hardcoded URLs:
```typescript
const url = `https://${tenant}.simplamo.com/dashboard/${id}`
```

### Folder Organization

**✅ CORRECT** - Feature folders:
```
app/screens/
├── Dashboard/
│   ├── DashboardListScreen.tsx
│   └── DashboardDetailScreen.tsx
```

**❌ WRONG** - Flat structure:
```
app/screens/
├── DashboardListScreen.tsx
├── DashboardDetailScreen.tsx
├── ProfileScreen.tsx
├── SettingsScreen.tsx
```

### Loading States

**✅ CORRECT** - Animated skeleton loaders:
```typescript
const SkeletonItem = ({ style }: { style: ViewStyle }) => (
  <Animated.View style={[style, { opacity }]} />
)
```

**❌ WRONG** - Just ActivityIndicator:
```typescript
{isLoading && <ActivityIndicator />}
```

### Navigation Types

**✅ CORRECT** - Properly typed:
```typescript
type Props = NativeStackScreenProps<AppStackParamList, "ScreenName">
const { param } = route.params
```

**❌ WRONG** - Untyped navigation:
```typescript
const MyScreen = ({ route, navigation }: any) => {
  // ...
}
```

---

## 📚 Project Architecture Reference

### Tech Stack
- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Stack + Native Bottom Tabs)
- **State Management**: Zustand with MMKV persistence
- **API Client**: Apisauce
- **Styling**: Themed styles with dark mode support
- **Icons**: SF Symbols (iOS native) + custom PNG assets

### Project Structure
```
app/
├── components/          # Reusable UI components
├── config/             # Environment configuration
├── i18n/               # Internationalization
├── navigators/         # Navigation setup
├── screens/            # Screen components (organized by feature)
│   ├── [Feature1]/
│   ├── [Feature2]/
│   └── index.ts
├── services/           # API services
│   └── api/
├── stores/            # Zustand stores
├── theme/             # Theme configuration
└── types/             # TypeScript types
```

---

## 🔧 Common Patterns

### API Error Handling
```typescript
try {
  const response = await api.get("/endpoint")
  if (!response.ok) {
    return { 
      kind: "error", 
      message: response.data?.message || "Unknown error" 
    }
  }
  return { kind: "ok", data: response.data }
} catch (e) {
  return { kind: "error", message: "Network error" }
}
```

### Skeleton Loader Animation
```typescript
const opacity = useRef(new Animated.Value(0.3)).current

useEffect(() => {
  if (isLoading) {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { 
          toValue: 1, 
          duration: 800, 
          useNativeDriver: true 
        }),
        Animated.timing(opacity, { 
          toValue: 0.3, 
          duration: 800, 
          useNativeDriver: true 
        }),
      ])
    ).start()
  }
}, [isLoading])
```

### WebView with Cookie Injection
```typescript
const headers = { Cookie: `AUTH=${token}` }

const injectedJavaScript = `
  document.cookie = "AUTH=${token}; path=/; secure; samesite=strict";
  true;
`

<WebView
  source={{ uri: url, headers }}
  injectedJavaScriptBeforeContentLoaded={injectedJavaScript}
  cacheEnabled={true}
  domStorageEnabled={true}
  sharedCookiesEnabled={true}
/>
```

---

## 🐛 Troubleshooting

### "Maximum update depth exceeded"
- **Cause**: Object selector in Zustand
- **Fix**: Use individual selectors

### "Module not found" after installing package
- **Cause**: Native module not linked
- **Fix**: Run `npx expo run:ios` to rebuild

### WebView not loading
- Check cookie injection
- Verify URL construction
- Check network permissions

### Navigation type errors
- Update `navigationTypes.ts`
- Ensure params match route definition

---

## ✅ Pre-Implementation Checklist

Before starting ANY new feature, ensure:

- [ ] Implementation plan created and approved
- [ ] UI/UX design reviewed and approved
- [ ] Types/models defined in `app/types/`
- [ ] API service created in `app/services/api/`
- [ ] Caching strategy determined
- [ ] Feature folder created in `app/screens/[FeatureName]/`
- [ ] Navigation types updated
- [ ] Translations added
- [ ] Testing plan defined

---

## 📖 Resources

- [React Navigation Docs](https://reactnavigation.org/)
- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [Expo Docs](https://docs.expo.dev/)
- [React Native WebView](https://github.com/react-native-webview/react-native-webview)
- [Apisauce](https://github.com/infinitered/apisauce)

### Tech Stack
- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Stack + Native Bottom Tabs)
- **State Management**: Zustand with MMKV persistence
- **API Client**: Apisauce
- **Styling**: Themed styles with dark mode support
- **Icons**: SF Symbols (iOS native) + custom PNG assets

### Project Structure
```
app/
├── components/          # Reusable UI components
├── config/             # Environment configuration
├── i18n/               # Internationalization
├── navigators/         # Navigation setup
├── screens/            # Screen components
├── services/           # API services
│   └── api/           # API endpoints
├── stores/            # Zustand stores
├── theme/             # Theme configuration
└── types/             # TypeScript types
```

## Development Workflow

### 1. Planning Phase
Before implementing any feature:

1. **Create Implementation Plan** (`implementation_plan.md`)
   - Define the problem and goals
   - List all files to be modified/created
   - Document breaking changes or design decisions
   - Outline verification steps

2. **Create Task Checklist** (`task.md`)
   - Break down into component-level tasks
   - Track progress with `[ ]`, `[/]`, `[x]`

3. **Get User Approval**
   - Present the plan for review
   - Iterate based on feedback

### 2. Implementation Guidelines

#### API Integration
```typescript
// 1. Define types in app/types/
export interface Dashboard {
  _id: string
  name: string
  isFeatured: boolean
}

// 2. Create API service in app/services/api/
export const dashboardApi = {
  getDashboards: async (): Promise<DashboardsResult> => {
    const response = await api.get("/auth/dashboards")
    // Handle response
  }
}

// 3. Use config for URLs
import Config from "@/config"
const url = `https://${tenant}.${Config.WEB_URL_DOMAIN}/path`
```

#### State Management (Zustand)
```typescript
// Always select state properties individually to avoid re-render loops
const token = useAuthStore((state) => state.token)
const tenant = useAuthStore((state) => state.tenant)

// ❌ NEVER do this (causes infinite loops):
const { token, tenant } = useAuthStore((state) => ({ 
  token: state.token, 
  tenant: state.tenant 
}))
```

#### Navigation
```typescript
// 1. Define types in navigationTypes.ts
export type AppStackParamList = {
  ScreenName: { param1: string; param2: number }
}

// 2. Use typed navigation
type Props = NativeStackScreenProps<AppStackParamList, "ScreenName">

// 3. Navigate with params
navigation.navigate("ScreenName", { param1: "value", param2: 123 })
```

#### Screens
```typescript
// Standard screen structure
export const MyScreen: React.FC<Props> = ({ route, navigation }) => {
  // 1. Extract route params
  const { param1 } = route.params
  
  // 2. Get state (individual selectors)
  const token = useAuthStore((state) => state.token)
  
  // 3. Local state
  const [isLoading, setIsLoading] = useState(false)
  
  // 4. Effects and handlers
  useEffect(() => {
    // Fetch data
  }, [])
  
  // 5. Render
  return (
    <Screen preset="fixed">
      <Header title="Title" leftIcon="back" onLeftPress={() => navigation.goBack()} />
      {/* Content */}
    </Screen>
  )
}
```

#### Styling
```typescript
// Use themed styles
const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}

// For dynamic styles, use themed function
const $themed: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
})
```

#### Skeleton Loaders
```typescript
// Use Animated API for smooth loading states
const opacity = useRef(new Animated.Value(0.3)).current

useEffect(() => {
  if (isLoading) {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    ).start()
  }
}, [isLoading])

const SkeletonItem = ({ style }: { style: ViewStyle }) => (
  <Animated.View style={[style, { opacity, backgroundColor: colors.palette.neutral300 }]} />
)
```

### 3. Configuration Management

#### Environment-Specific Config
```typescript
// config.base.ts - Base configuration
export interface ConfigBaseProps {
  API_URL: string
  WEB_URL_DOMAIN: string
}

// config.dev.ts - Development overrides
export default {
  API_URL: "https://api.simplamo.net/api",
  WEB_URL_DOMAIN: "simplamo.net",
}
```

### 4. Internationalization
```typescript
// Add translations to app/i18n/en.ts
demoNavigator: {
  dashboardListTab: "Dashboard",
}

// Use in components
translate("demoNavigator:dashboardListTab")
```

### 5. Icons
- **Native Tabs**: Use SF Symbols for iOS
  ```typescript
  tabBarIcon: () => ({ sfSymbol: "chart.bar" })
  ```
- **Components**: Use Icon component with registered icons
  ```typescript
  <Icon icon="heart" color={colors.tint} size={20} />
  ```

### 6. WebView Integration
```typescript
// Cookie injection
const headers = { Cookie: `AUTH=${token}` }

const injectedJavaScript = `
  document.cookie = "AUTH=${token}; path=/; secure; samesite=strict";
  true;
`

<WebView
  source={{ uri: url, headers }}
  injectedJavaScriptBeforeContentLoaded={injectedJavaScript}
  cacheEnabled={true}
  domStorageEnabled={true}
  sharedCookiesEnabled={true}
/>
```

### 7. Verification Phase

After implementation:

1. **Test Functionality**
   - Run the app (`yarn ios` / `yarn android`)
   - Test all user flows
   - Verify API integration

2. **Create Walkthrough** (`walkthrough.md`)
   - Document what was implemented
   - Include verification steps
   - Add screenshots/recordings if UI changes

3. **Code Review Checklist**
   - [ ] No lint errors
   - [ ] Types are properly defined
   - [ ] State selectors are individual (not objects)
   - [ ] Config used for URLs/domains
   - [ ] Translations added
   - [ ] Navigation types updated
   - [ ] Error handling implemented

## Common Patterns

### API Error Handling
```typescript
try {
  const response = await api.get("/endpoint")
  if (!response.ok) {
    return { kind: "error", message: response.data?.message || "Unknown error" }
  }
  return { kind: "ok", data: response.data }
} catch (e) {
  return { kind: "error", message: "Network error" }
}
```

### Loading States
```typescript
const [isLoading, setIsLoading] = useState(false)

const fetchData = async () => {
  setIsLoading(true)
  try {
    // Fetch data
  } finally {
    setIsLoading(false)
  }
}
```

### Safe Area Handling
```typescript
import { useSafeAreaInsets } from "react-native-safe-area-context"

const { top, bottom } = useSafeAreaInsets()

<Screen preset="fixed" safeAreaEdges={["bottom"]}>
  {/* Content */}
</Screen>
```

## Best Practices

1. **Always use TypeScript types** - Define interfaces for all data structures
2. **Individual Zustand selectors** - Avoid object destructuring in selectors
3. **Config for environment values** - Never hardcode URLs or domains
4. **Translations for all text** - Support internationalization from the start
5. **Native icons for tabs** - Use SF Symbols for better iOS integration
6. **Skeleton loaders for async content** - Better UX than spinners
7. **Error boundaries** - Graceful error handling
8. **Proper navigation typing** - Type-safe navigation params

## Troubleshooting

### Common Issues

1. **"Maximum update depth exceeded"**
   - Cause: Object selector in Zustand
   - Fix: Use individual selectors

2. **"Module not found" after installing package**
   - Cause: Native module not linked
   - Fix: Run `npx expo run:ios` to rebuild

3. **WebView not loading**
   - Check cookie injection
   - Verify URL construction
   - Check network permissions

4. **Navigation type errors**
   - Update `navigationTypes.ts`
   - Ensure params match route definition

## Resources

- [React Navigation Docs](https://reactnavigation.org/)
- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [Expo Docs](https://docs.expo.dev/)
- [React Native WebView](https://github.com/react-native-webview/react-native-webview)
