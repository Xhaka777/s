import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Image,
} from 'react-native';
import { AuthStackParamList } from '../navigation';
import { useNavigation } from '@react-navigation/native';

interface SuccessModalProps {
    visible: boolean;
    onClose: () => void;
    onContinue?: () => void; // ← CHANGE THIS: Make it optional with ?
    title?: string;
    message?: string;
    buttonText?: string;
}

type SuccessModalNavigationProp = NativeStackNavigationProp<
    AuthStackParamList,
    'SignUp'
>;

const SuccessModal: React.FC<SuccessModalProps> = ({
    visible,
    onClose,
    onContinue,
    title = "Thank you",
    message = "Code successfully verified!",
    buttonText = "Let's Setup your profile"
}) => {
    const navigation = useNavigation<SuccessModalNavigationProp>();

    const handleContinue = () => {
        onClose();
        if (onContinue) {
            onContinue();
        } else {
            // This will now execute when onContinue is not provided
            navigation.navigate('ProfileSetupScreen');
        }
    }

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.successModalOverlay}>
                <View style={styles.successModalContent}>
                    <View style={styles.successModalBody}>
                        <View style={styles.successIconContainer}>
                            <View style={styles.successIcon}>
                                <Image
                                    source={require('../assets/icons/Subtract.png')}
                                    style={{ width: 24, height: 24 }}
                                    resizeMode="contain"
                                />
                            </View>
                        </View>
                        <Text style={styles.successTitle}>{title}</Text>
                        <Text style={styles.successMessage}>{message}</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.setupProfileButton}
                        onPress={handleContinue}
                    >
                        <Text style={styles.setupProfileButtonText}>{buttonText}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    successModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.06)',
        justifyContent: 'flex-end',
    },
    successModalContent: {
        width: '100%',
        height: 256,
        paddingHorizontal: 28,
        paddingVertical: 28,
        backgroundColor: '#1a1a1a',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderTopWidth: 1.5,
        borderTopColor: '#B8457B',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
    },
    successModalBody: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 10,
    },
    successIconContainer: {
        width: 40,
        height: 40,
        paddingHorizontal: 5.11,
        paddingVertical: 4,
        backgroundColor: '#FFFFFF',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    successIcon: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmark: {
        fontSize: 16,
        color: '#22C55E',
        fontWeight: 'bold',
    },
    successTitle: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '500',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
        lineHeight: 32,
    },
    successMessage: {
        width: 288,
        textAlign: 'center',
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'normal',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
        lineHeight: 22,
    },
    setupProfileButton: {
        width: '100%',
        paddingHorizontal: 24,
        paddingVertical: 14,
        backgroundColor: '#B8457B',
        borderRadius: 50,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 2,
        elevation: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    setupProfileButtonText: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
        lineHeight: 20,
    },
});

export default SuccessModal;