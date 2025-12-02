import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StatusBar,
    SafeAreaView,
    Platform,
    Alert,
    Dimensions,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Plus, Shield } from 'lucide-react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import ImagePicker from 'react-native-image-crop-picker';
import { SecUnion } from '../../components';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const UploadPhoto = () => {
    const navigation = useNavigation();
    const [selectedImage, setSelectedImage] = useState(null);

    const AUTH_COMPLETED_KEY = '@spooned:auth_completed';
    const PROFILE_IMAGE_KEY = '@spooned:profile_image'; // Add this key

    const pickImage = async () => {
        try {
            const image = await ImagePicker.openPicker({
                width: 300,
                height: 300,
                cropping: true,
                cropperCircleOverlay: true,
                sortOrder: 'none',
                compressImageMaxWidth: 1000,
                compressImageMaxHeight: 1000,
                compressImageQuality: 1,
                compressVideoPreset: 'MediumQuality',
                includeExif: true,
                cropperStatusBarColor: 'white',
                cropperToolbarColor: 'white',
                cropperActiveWidgetColor: '#99225E',
                cropperToolbarWidgetColor: '#3498DB',
            });

            console.log('Selected image:', image);
            setSelectedImage(image.path);
        } catch (error) {
            console.log('ImagePicker Error: ', error);

            // Handle different error scenarios
            if (error.code === 'E_PERMISSION_MISSING') {
                Alert.alert(
                    'Permission Required',
                    'Please allow access to your photo library to upload a profile picture.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Open Settings', onPress: () => ImagePicker.openSettings() }
                    ]
                );
            } else if (error.code === 'E_PICKER_CANCELLED') {
                // User cancelled the picker, no need to show alert
                console.log('User cancelled image selection');
            } else {
                Alert.alert(
                    'Error',
                    'Something went wrong while selecting the image. Please try again.',
                    [{ text: 'OK' }]
                );
            }
        }
    };

    const handleNext = async () => {
        if (!selectedImage) {
            Alert.alert(
                'No Image Selected',
                'Please select a profile picture or skip this step.',
                [{ text: 'OK' }]
            );
            return;
        }

        try {
            await AsyncStorage.setItem(PROFILE_IMAGE_KEY, selectedImage);
            await AsyncStorage.setItem(AUTH_COMPLETED_KEY, 'true');
            console.log('Auth completed, waiting for navigation...');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSkip = async () => {
        try {
            await AsyncStorage.removeItem(PROFILE_IMAGE_KEY);
            await AsyncStorage.setItem(AUTH_COMPLETED_KEY, 'true');
            console.log('Auth completed, waiting for navigation...');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
    };

    // Rest of your component remains the same...
    return (
        <View style={{ flex: 1, backgroundColor: '#000000' }}>
            {/* Your existing JSX remains unchanged */}
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            <View className="absolute inset-0 z-0">
                {/* Background gradient */}
                <Svg height="50%" width="100%" className="absolute top-0 left-0">
                    <Defs>
                        <RadialGradient
                            id="pinkGlow"
                            cx="0%" cy="10%" r="90%"
                            gradientUnits="userSpaceOnUse"
                        >
                            <Stop offset="0%" stopColor="#99225E" stopOpacity="0.4" />
                            <Stop offset="100%" stopColor="#000" stopOpacity="0" />
                        </RadialGradient>
                    </Defs>
                    <Rect width="100%" height="100%" fill="url(#pinkGlow)" />
                </Svg>

                {/* Glow background effect */}
                <View
                    className="absolute"
                    style={{
                        left: 2,
                        top: 100,
                        width: 524,
                        height: 237,
                        zIndex: 1,
                    }}
                >
                    <SecUnion />
                </View>
            </View>

            <SafeAreaView style={{ flex: 1 }}>

                {/* Back button */}
                <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ArrowLeft size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                {/* Main content */}
                <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 40 }}>
                    {/* Title */}
                    <Text style={{
                        color: '#FFFFFF',
                        fontSize: 20,
                        fontWeight: '600',
                        fontFamily: 'Poppins',
                        marginBottom: 24
                    }}>
                        Upload Profile Picture
                    </Text>

                    {/* Question */}
                    <Text style={{
                        color: '#FFFFFF',
                        fontSize: 16,
                        fontWeight: '500',
                        fontFamily: 'Poppins',
                        marginBottom: 16
                    }}>
                        Can we have your picture?
                    </Text>

                    {/* Photo upload area */}
                    <TouchableOpacity
                        onPress={pickImage}
                        style={{
                            width: '100%',
                            height: 256,
                            backgroundColor: '#1A1A1A',
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: '#99225E',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 40,
                            position: 'relative'
                        }}
                    >
                        {selectedImage ? (
                            <>
                                <Image
                                    source={{ uri: selectedImage }}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: 8
                                    }}
                                    resizeMode="cover"
                                />
                                {/* X button to remove image */}
                                <TouchableOpacity
                                    onPress={removeImage}
                                    style={{
                                        position: 'absolute',
                                        top: 12,
                                        right: 12,
                                        width: 32,
                                        height: 32,
                                        backgroundColor: '#99225E',
                                        borderRadius: 16,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.25,
                                        shadowRadius: 3.84,
                                        elevation: 5,
                                    }}
                                >
                                    <Text style={{
                                        color: '#FFFFFF',
                                        fontSize: 18,
                                        fontWeight: '600',
                                        lineHeight: 18
                                    }}>
                                        ×
                                    </Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <View style={{ alignItems: 'center' }}>
                                <Plus size={32} color="#99225E" strokeWidth={3} />
                                <Text style={{
                                    color: '#99225E',
                                    fontSize: 14,
                                    fontFamily: 'Poppins',
                                    marginTop: 8
                                }}>
                                    Tap to add photo
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Bottom section */}
                <View style={{ paddingHorizontal: 20, paddingBottom: 40 }}>
                    {/* Privacy notice */}
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        marginBottom: 16
                    }}>
                        <Shield size={24} color="#FFFFFF" style={{ marginRight: 8, marginTop: 2 }} />
                        <Text style={{
                            color: '#FFFFFF',
                            fontSize: 14,
                            fontFamily: 'Poppins',
                            lineHeight: 16,
                            flex: 1
                        }}>
                            We never share this with anyone, your profile is private, until you choose otherwise.
                        </Text>
                    </View>

                    {/* Done/Next button */}
                    <TouchableOpacity
                        onPress={handleNext}
                        style={{
                            backgroundColor: selectedImage ? '#99225E' : '#4A1A3A',
                            paddingVertical: 14,
                            paddingHorizontal: 24,
                            borderRadius: 100,
                            marginBottom: selectedImage ? 40 : 16,
                            shadowColor: '#0D0D12',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.06,
                            shadowRadius: 2,
                            elevation: 2
                        }}
                    >
                        <Text style={{
                            color: '#FFFFFF',
                            fontSize: 16,
                            fontWeight: '500',
                            textAlign: 'center',
                            fontFamily: 'Poppins'
                        }}>
                            {selectedImage ? 'Done' : 'Next'}
                        </Text>
                    </TouchableOpacity>

                    {/* Skip button - only show when no image is selected */}
                    {!selectedImage && (
                        <TouchableOpacity
                            onPress={handleSkip}
                            style={{
                                paddingVertical: 4,
                                paddingHorizontal: 24,
                                borderRadius: 100,
                                shadowColor: '#0D0D12',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.06,
                                shadowRadius: 2,
                                elevation: 2
                            }}
                        >
                            <Text style={{
                                color: '#FFFFFF',
                                fontSize: 16,
                                fontWeight: '500',
                                textAlign: 'center',
                                fontFamily: 'Poppins'
                            }}>
                                Skip
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </SafeAreaView>
        </View>
    );
};

export default UploadPhoto;