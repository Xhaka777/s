import React from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    Image,
    StatusBar,
} from 'react-native';
import { X } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import Button from './Button';

const { width, height } = Dimensions.get('window');

const QuestionnaireModal = ({ visible, onClose, onContinue, category }) => {
    const borderWidth = 1.5;
    const borderRadius = 24;
    const modalWidth = width - 40;
    const modalHeight = 320;

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            statusBarTranslucent={true}
            onRequestClose={onClose}
        >
            <StatusBar backgroundColor="rgba(0, 0, 0, 0.7)" barStyle="light-content" />

            <View style={styles.overlay}>
                <View style={styles.modalWrapper}>
                    
                    {/* Gradient Border Container - Pink gradient at TOP */}
                    <LinearGradient
                        colors={['#99225E', '#000000', '#000000']} // Pink at top, black at bottom
                        locations={[0, 0.2, 1]} // Pink takes up first 20% (top area)
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
                            {/* Content Section */}
                            <View style={styles.contentContainer}>
                                {/* Success Icon */}
                                <View style={styles.successIcon}>
                                    <Image
                                        source={require('../assets/icons/Subtract.png')}
                                        style={{ width: 24, height: 24 }}
                                        resizeMode="contain"
                                    />
                                </View>

                                {/* Text Content */}
                                <View style={styles.textContainer}>
                                    <Text style={styles.title}>Congratulations</Text>
                                    
                                    <View style={styles.messageContainer}>
                                        <Text style={styles.messageText}>
                                            You have successfully complete answers for{' '}
                                            <Text style={styles.categoryText}>{category}</Text>
                                            . We recommend to order answers according to what matters most to you.
                                        </Text>
                                    </View>
                                </View>

                                {/* Continue Button */}
                                <View style={styles.buttonContainer}>
                                    <Button
                                        title="Let's do this"
                                        variant="primary"
                                        onPress={onContinue}
                                        style={styles.buttonStyle}
                                    />
                                </View>
                            </View>
                        </View>
                    </LinearGradient>

                    {/* Close Button */}
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                        activeOpacity={0.8}
                    >
                        <View style={styles.closeIcon}>
                            <X size={20} color="#000000" strokeWidth={2} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

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
        // This creates the gradient border - pink at TOP
    },
    modalContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
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
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 28,
        paddingVertical: 28,
    },
    successIcon: {
        width: 40,
        height: 40,
        backgroundColor: '#FFFFFF',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 28, // Add proper spacing below icon
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24, // Add spacing before button
    },
    title: {
        fontSize: 24,
        fontWeight: '500',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 16,
        fontFamily: 'Poppins',
        lineHeight: 32,
    },
    messageContainer: {
        width: '100%',
        maxWidth: 280,
        justifyContent: 'center',
    },
    messageText: {
        fontSize: 16,
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 24,
        fontFamily: 'Poppins',
        fontWeight: '400',
    },
    categoryText: {
        color: '#EC4899',
        fontSize: 16,
        fontWeight: '400',
        fontFamily: 'Poppins',
        lineHeight: 24,
    },
    buttonContainer: {
        width: '100%',
    },
    buttonStyle: {
        width: '100%',
        height: 56,
    },
});

export default QuestionnaireModal;