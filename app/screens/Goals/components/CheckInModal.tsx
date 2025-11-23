import React, { useState } from "react"
import { View, Modal, TextInput, TouchableOpacity, TextStyle, ViewStyle, ScrollView } from "react-native"
import { Text } from "@/components/Text"
import { Icon } from "@/components/Icon"
import { colors, spacing } from "@/theme"
import { Milestone } from "@/types/Rock"

interface CheckInModalProps {
    visible: boolean
    milestone: Milestone | null
    onClose: () => void
    onSubmit: (milestoneId: string, percent: number, description: string) => void
}

export const CheckInModal: React.FC<CheckInModalProps> = ({ visible, milestone, onClose, onSubmit }) => {
    const [percent, setPercent] = useState("")
    const [description, setDescription] = useState("")

    if (!milestone) return null

    const handleSubmit = () => {
        const percentValue = parseFloat(percent)
        if (!isNaN(percentValue) && percentValue >= 0 && percentValue <= 100) {
            onSubmit(milestone._id, percentValue, description)
            setPercent("")
            setDescription("")
            onClose()
        }
    }

    const currentProgress = milestone.currentPercent || 0
    const maxValue = milestone.toValue || 100

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={$modalOverlay}>
                <View style={$modalContent}>
                    {/* Header */}
                    <View style={$header}>
                        <TouchableOpacity onPress={onClose}>
                            <Icon icon="x" size={24} color={colors.text} />
                        </TouchableOpacity>
                        <Text text="Cập nhật tiến độ" preset="subheading" style={$headerTitle} />
                        <View style={{ width: 24 }} />
                    </View>

                    <ScrollView style={$scrollView}>
                        {/* Milestone Title */}
                        <Text text={milestone.title} style={$milestoneTitle} />

                        {/* Current Progress */}
                        <View style={$currentProgressContainer}>
                            <Text text="Tiến độ hiện tại" style={$label} />
                            <Text text={`${Math.round(currentProgress)}%`} preset="heading" style={$currentProgressText} />
                        </View>

                        {/* Progress Input */}
                        <View style={$inputContainer}>
                            <Text text="Tiến độ mới (%)" style={$label} />
                            <TextInput
                                style={$input}
                                value={percent}
                                onChangeText={setPercent}
                                placeholder={`Nhập từ 0 đến 100`}
                                keyboardType="numeric"
                                placeholderTextColor={colors.textDim}
                            />
                        </View>

                        {/* Description Input */}
                        <View style={$inputContainer}>
                            <Text text="Ghi chú (tùy chọn)" style={$label} />
                            <TextInput
                                style={[$input, $textArea]}
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Nhập ghi chú..."
                                multiline
                                numberOfLines={4}
                                placeholderTextColor={colors.textDim}
                            />
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity style={$submitButton} onPress={handleSubmit}>
                            <Text text="Cập nhật" style={$submitButtonText} />
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    )
}

const $modalOverlay: ViewStyle = {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
}

const $modalContent: ViewStyle = {
    backgroundColor: colors.background,
    borderTopLeftRadius: spacing.lg,
    borderTopRightRadius: spacing.lg,
    maxHeight: "80%",
    paddingBottom: spacing.xl,
}

const $header: ViewStyle = {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
}

const $headerTitle: TextStyle = {
    flex: 1,
    textAlign: "center",
}

const $scrollView: ViewStyle = {
    padding: spacing.lg,
}

const $milestoneTitle: TextStyle = {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.lg,
    lineHeight: 24,
}

const $currentProgressContainer: ViewStyle = {
    alignItems: "center",
    padding: spacing.lg,
    backgroundColor: colors.palette.neutral100,
    borderRadius: spacing.md,
    marginBottom: spacing.lg,
}

const $currentProgressText: TextStyle = {
    color: colors.palette.primary500,
    marginTop: spacing.xs,
}

const $inputContainer: ViewStyle = {
    marginBottom: spacing.lg,
}

const $label: TextStyle = {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs,
}

const $input: ViewStyle = {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.sm,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
}

const $textArea: ViewStyle = {
    height: 100,
    textAlignVertical: "top",
}

const $submitButton: ViewStyle = {
    backgroundColor: colors.palette.primary500,
    padding: spacing.md,
    borderRadius: spacing.sm,
    alignItems: "center",
    marginTop: spacing.md,
}

const $submitButtonText: TextStyle = {
    color: colors.palette.neutral100,
    fontSize: 16,
    fontWeight: "600",
}
