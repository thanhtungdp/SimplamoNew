import React from "react"
import { View, Image, TextStyle, ViewStyle, ImageStyle } from "react-native"
import { Text } from "./Text"
import { colors, spacing } from "@/theme"

export interface UserAvatarProps {
    /**
     * User's full name (used for initials fallback)
     */
    name: string

    /**
     * Avatar image URL
     */
    avatar?: string

    /**
     * Size of the avatar (default: 32)
     */
    size?: number

    /**
     * Optional style override
     */
    style?: ViewStyle
}

/**
 * UserAvatar component
 * Displays user avatar image or initials fallback
 */
export function UserAvatar(props: UserAvatarProps) {
    const { name, avatar, size = 32, style } = props

    const getInitials = (fullName: string) => {
        const parts = fullName.trim().split(" ")
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        }
        return fullName.substring(0, 2).toUpperCase()
    }

    const containerSize = { width: size, height: size, borderRadius: size / 2 }
    const fontSize = Math.round(size * 0.4)

    return (
        <View style={[$container, containerSize, style]}>
            {avatar ? (
                <Image
                    source={{ uri: avatar }}
                    style={[$image, containerSize]}
                    resizeMode="cover"
                />
            ) : (
                <Text
                    text={getInitials(name)}
                    style={[$initialsText, { fontSize }]}
                />
            )}
        </View>
    )
}

const $container: ViewStyle = {
    backgroundColor: colors.palette.secondary500,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
}

const $image: ImageStyle = {
    width: "100%",
    height: "100%",
}

const $initialsText: TextStyle = {
    fontWeight: "600",
    color: colors.palette.neutral100,
}
