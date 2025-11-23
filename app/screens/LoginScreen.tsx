import React, { useState, useEffect } from "react"
import { ViewStyle, TextStyle, View, Alert } from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { Button } from "@/components/Button"
import { useAuthStore } from "@/stores/useAuthStore"
import { spacing } from "@/theme/spacing"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export const LoginScreen = () => {
  const { bottom } = useSafeAreaInsets()
  const [tenant, setTenant] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const login = useAuthStore((state) => state.login)
  const isLoading = useAuthStore((state) => state.isLoading)
  const error = useAuthStore((state) => state.error)
  const clearError = useAuthStore((state) => state.clearError)

  // Clear errors when unmounting
  useEffect(() => {
    return () => clearError()
  }, [])

  const handleLogin = async () => {
    setIsSubmitted(true)

    if (!email || !password || !tenant) return

    const success = await login(email, password, tenant)
    if (success) {
      // Navigation is handled by AppNavigator based on auth state
    } else {
      Alert.alert("Login Failed", error || "Something went wrong")
    }
  }

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <View style={$container}>
        <Text testID="login-heading" tx="loginScreen:logIn" preset="heading" style={$signIn} />
        <Text tx="loginScreen:tapToLogIn" preset="subheading" style={$enterDetails} />

        <TextField
          value={tenant}
          onChangeText={setTenant}
          containerStyle={$textField}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect={false}
          label="Workspace"
          placeholder="Enter your workspace"
          helper={isSubmitted && !tenant ? "Workspace is required" : undefined}
          status={isSubmitted && !tenant ? "error" : undefined}
        />

        <TextField
          value={email}
          onChangeText={setEmail}
          containerStyle={$textField}
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          keyboardType="email-address"
          labelTx="loginScreen:emailFieldLabel"
          placeholderTx="loginScreen:emailFieldPlaceholder"
          helper={isSubmitted && !email ? "Email is required" : undefined}
          status={isSubmitted && !email ? "error" : undefined}
        />

        <TextField
          value={password}
          onChangeText={setPassword}
          containerStyle={$textField}
          autoCapitalize="none"
          autoComplete="password"
          autoCorrect={false}
          secureTextEntry={true}
          labelTx="loginScreen:passwordFieldLabel"
          placeholderTx="loginScreen:passwordFieldPlaceholder"
          helper={isSubmitted && !password ? "Password is required" : undefined}
          status={isSubmitted && !password ? "error" : undefined}
          onSubmitEditing={handleLogin}
        />

        <Button
          testID="login-button"
          tx="loginScreen:logIn"
          style={$tapButton}
          preset="reversed"
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading && <Text text="Loading..." style={{ color: "white" }} />}
        </Button>
      </View>
    </Screen>
  )
}

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
  flex: 1,
  justifyContent: "center",
}

const $container: ViewStyle = {
  flex: 1,
  justifyContent: "center",
}

const $signIn: TextStyle = {
  marginBottom: spacing.sm,
}

const $enterDetails: TextStyle = {
  marginBottom: spacing.lg,
}

const $textField: ViewStyle = {
  marginBottom: spacing.lg,
}

const $tapButton: ViewStyle = {
  marginTop: spacing.xs,
}
