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
    Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

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
    const borderWidth = 1.5;
    const borderRadius = 12;
    const modalWidth = width - 40;
    const modalHeight = 500;

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            statusBarTranslucent={true}
        >
            <StatusBar backgroundColor="rgba(0, 0, 0, 0.7)" barStyle="light-content" />

            <View style={styles.overlay}>
                <View style={styles.modalWrapper}>
                    
                    {/* Gradient Border Container */}
                    <LinearGradient
                        colors={['#000000', '#000000', '#99225E']}
                        locations={[0, 0.8, 1]}
                        style={[
                            styles.borderContainer,
                            {
                                width: modalWidth,
                                height: modalHeight,
                                borderRadius: borderRadius,
                            }
                        ]}
                    >
                        {/* Inner Modal Container */}
                        <View style={[
                            styles.modalContainer,
                            {
                                width: modalWidth - (borderWidth * 2),
                                height: modalHeight - (borderWidth * 2),
                                borderRadius: borderRadius - borderWidth,
                                margin: borderWidth,
                            }
                        ]}>
                            {/* Video/Image Background Area */}
                            <View style={[styles.videoContainer, { borderTopLeftRadius: borderRadius - borderWidth, borderTopRightRadius: borderRadius - borderWidth }]}>
                                <ImageBackground
                                    source={require('../assets/images/main-welcome.jpg')}
                                    style={styles.videoBg}
                                    resizeMode="cover"
                                >
                                    <View style={styles.gradientOverlay} />
                                </ImageBackground>
                            </View>

                            <View style={styles.playButtonContainer}>
                                <TouchableOpacity style={styles.playButton} activeOpacity={0.8}>
                                    <Image
                                        source={require('../assets/icons/man.png')}
                                        resizeMode='contain'
                                        style={{ width: 35, height: 35 }}
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Content Section */}
                            <View style={styles.contentContainer}>
                                <Text style={styles.welcomeTitle}>Welcome Message</Text>
                                <Text style={styles.welcomeDescription}>
                                    Lipsum generator: Lorem Ipsum - All
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
                    </LinearGradient>

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
    modalWrapper: {
        position: 'relative',
        width: width - 40,
        alignItems: 'flex-end',
    },
    borderContainer: {
        // This creates the gradient border
    },
    modalContainer: {
        backgroundColor: '#1A1A1A',
        overflow: 'hidden',
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: -12,
        right: -5,
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
        overflow: 'hidden',
    },
    videoBg: {
        flex: 1,
        width: '100%',
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    playButtonContainer: {
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: [{ translateX: -32 }, { translateY: -32 }],
        zIndex: 5,
    },
    playButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255, 255, 255, 0.69)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 6,
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
        fontFamily: 'Inter',
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
        fontFamily: 'Poppins',
    },
});