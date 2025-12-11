import React from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import { AlertCircle, X } from 'lucide-react-native';
import Button from './Button';

interface CancelBookingModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description: string;
    confirmButtonText?: string;
    icon?: React.ReactNode;
}

export default function CancelBookingModal({
    visible,
    onClose,
    onConfirm,
    title = 'Cancel Booking',
    description,
    confirmButtonText = 'Continue with cancelation',
    icon,
}: CancelBookingModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View className="flex-1 justify-end bg-black/50">
                    <TouchableWithoutFeedback>
                        <View className="bg-[#101010] rounded-t-3xl relative border-t border-primary">
                            {/* Close Button */}
                            <TouchableOpacity
                                onPress={onClose}
                                className="w-12 h-12 rounded-full bg-white items-center justify-center"
                                style={{
                                    position: 'absolute',
                                    top: -10,
                                    right: 1,
                                    zIndex: 10,
                                }}
                                activeOpacity={0.8}
                            >
                                <X size={24} color="#000000" />
                            </TouchableOpacity>

                            {/* Content */}
                            <View className="px-6 py-8">
                                {/* Icon */}
                                <View className="items-center mb-6">
                                    <View className="w-16 h-16 rounded-full bg-white items-center justify-center">
                                        {icon || <AlertCircle size={32} color="#000000" strokeWidth={2} />}
                                    </View>
                                </View>

                                {/* Title */}
                                <Text className="text-white text-2xl font-PoppinsBold text-center mb-4">
                                    {title}
                                </Text>

                                {/* Description */}
                                <Text className="text-white text-center text-base font-PoppinsRegular leading-6 mb-8">
                                    {description}
                                </Text>

                                {/* Confirm Button */}
                                <Button
                                    title={confirmButtonText}
                                    onPress={onConfirm}
                                    variant="primary"
                                    style={{
                                        marginBottom: 16,
                                        marginLeft: 10,
                                        marginRight: 10,
                                        shadowColor: '#B8457B',
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.3,
                                        shadowRadius: 8,
                                        elevation: 8,
                                    }}
                                />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}