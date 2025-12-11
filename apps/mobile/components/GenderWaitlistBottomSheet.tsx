import React from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Dimensions,
    StyleSheet,
} from 'react-native';
import { Clock, X } from 'lucide-react-native';
import  Button from './Button' 

const { height } = Dimensions.get('window');

interface GenderWaitlistBottomSheetProps {
    visible: boolean;
    onClose: () => void;
    onContinue: () => void;
}

export default function GenderWaitlistBottomSheet({
    visible,
    onClose,
    onContinue,
}: GenderWaitlistBottomSheetProps) {
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
                            >
                                <X size={24} color="#000000" />
                            </TouchableOpacity>

                            {/* Content */}
                            <View className="px-6 py-8">
                                {/* Clock Icon */}
                                <View className="items-center mb-6">
                                    <View className="w-12 h-12 rounded-full bg-white items-center justify-center">
                                        <Clock size={26} color="#000000" />
                                    </View>
                                </View>

                                {/* Title */}
                                <Text className="text-white text-2xl font-PoppinsBold text-center mb-6">
                                    Active Waitlist
                                </Text>

                                {/* Description */}
                                <Text className="text-white text-center text-lg font-Poppins leading-7 mb-8">
                                    Currently there is a Gender Waitlist due to balancing reasons. If you want to register on the waitlist a full payment commitment is needed. If a spot is not secured you will be refunded.
                                </Text>

                                {/* Continue Button */}
                                <Button
                                    title="Continue with booking"
                                    onPress={onContinue}
                                    variant="primary"
                                    style={{
                                        marginBottom: 16,
                                    }}
                                />

                                {/* Head Back Button */}
                                <TouchableOpacity
                                    onPress={onClose}
                                    className="py-4"
                                >
                                    <Text className="text-[#B8457B] text-center text-lg font-PoppinsSemiBold">
                                        Head back
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}