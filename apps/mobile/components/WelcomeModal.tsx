import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Dimensions,
    ImageBackground,
    StatusBar,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface WelcomeModalProps {
    visible: boolean;
    onClose: () => void;
    onContinue: () => void;
}

export default function WelcomeModal({
    visible,
    onClose,
    onContinue,
}: WelcomeModalProps) {
    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            statusBarTranslucent={true}
        >
            <StatusBar backgroundColor="rgba(0, 0, 0, 0.7)" barStyle="light-content" />

            {/* Background Overlay */}
            <View style={styles.overlay}>

                <View style={styles.modalWrapper}>
                    {/* Modal Container */}
                    <View style={styles.modalContainer}>

                        {/* Video/Image Background Area */}
                        <View style={styles.videoContainer}>
                            <ImageBackground
                                source={require('../assets/images/main-welcome.jpg')} // Add your background image
                                style={styles.videoBg}
                                resizeMode="cover"
                            >
                                <View style={styles.gradientOverlay} />

                            </ImageBackground>
                        </View>

                        <View style={styles.playButtonContainer}>
                            <TouchableOpacity style={styles.playButton} activeOpacity={0.8}>
                                <View style={styles.playIcon} />
                            </TouchableOpacity>
                        </View>

                        {/* Content Section */}
                        <View style={styles.contentContainer}>
                            <Text style={styles.welcomeTitle}>Welcome Message</Text>
                            <Text style={styles.welcomeDescription}>
                                Lipsum generator: Lorem Ipsum - All the facts
                                {'\n'}Lipsum generator: Lorem Ipsum - All the facts
                            </Text>

                            {/* Continue Button */}
                            <TouchableOpacity
                                style={styles.continueButton}
                                onPress={onContinue}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.continueButtonText}>Continue</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                        activeOpacity={0.8}
                    >
                        <View style={styles.closeIcon}>
                            <Text style={styles.closeText}>×</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalContainer: {
        width: width - 40,
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#B8457B',
        overflow: 'hidden',
        maxHeight: height * 0.85,
    },
    modalWrapper: {
        position: 'relative',
        width: width - 40,
        alignItems: 'flex-end',
    },
    closeButton: {
        position: 'absolute',
        top: -12, // floats above the top border
        right: -5, // aligned with right side
        zIndex: 10,
    },
    closeIcon: {
        width: 35,
        height: 35,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },

    closeText: {
        fontSize: 26,
        fontWeight: '400',
        color: '#000',
        lineHeight: 26,
    },

    videoContainer: {
        height: 280,
        position: 'relative',
    },
    videoBg: {
        flex: 1,
        width: '100%',
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        // You can replace this with a proper gradient if needed
    },
    playButtonContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -32 }, { translateY: -32 }],
        zIndex: 5,
    },

    playButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 6,
    },

    playIcon: {
        width: 0,
        height: 0,
        borderTopWidth: 10,
        borderBottomWidth: 10,
        borderLeftWidth: 16,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: '#FFFFFF',
        marginLeft: 4,
    },

    profileContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
    profileButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#B8457B',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    profileText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    contentContainer: {
        padding: 24,
        alignItems: 'center',
    },
    welcomeTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 16,
        fontFamily: 'Inter', // Make sure to add Inter font to your project
    },
    welcomeDescription: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
        fontFamily: 'Inter',
    },
    continueButton: {
        backgroundColor: '#B8457B',
        borderRadius: 50,
        paddingVertical: 16,
        paddingHorizontal: 48,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    continueButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Poppins', // Make sure to add Poppins font to your project
    },
    privacyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 24,
        gap: 12,
    },
    privacyIcon: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    shieldIcon: {
        fontSize: 16,
    },
    privacyText: {
        flex: 1,
        fontSize: 14,
        color: '#FFFFFF',
        fontFamily: 'Poppins',
        lineHeight: 18,
    },
});