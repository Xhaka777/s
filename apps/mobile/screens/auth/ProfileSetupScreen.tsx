import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    StatusBar,
    SafeAreaView,
    Platform,
    ScrollView,
    KeyboardAvoidingView,
    Image,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AlertCircle, ArrowLeft, Calendar, User, Users } from 'lucide-react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import GlowBackground from '../../components/svg/GlowBackground';
import DatePickerCalendar from '../../components/DatePickerCalendar';

interface ProfileSetupScreenProps {
    // You can add props if needed for navigation typing
}

export default function ProfileSetupScreen() {
    const navigation = useNavigation();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthday, setBirthday] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false); // Add this state
    const [selectedDate, setSelectedDate] = useState(null); // Add this state
    const [isUnderAge, setIsUnderAge] = useState(false);

    const [selectedGender, setSelectedGender] = useState<'women' | 'men' | null>(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!birthday.trim()) {
            newErrors.birthday = 'Birthday is required';
        } else {
            // Basic date format validation (DD/MM/YYYY)
            const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
            if (!dateRegex.test(birthday)) {
                newErrors.birthday = 'Please use DD/MM/YYYY format';
            }
        }

        if (!selectedGender) {
            newErrors.gender = 'Please select your gender';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // TODO: Implement profile setup logic
            console.log('Setting up profile with:', {
                firstName,
                lastName,
                birthday,
                selectedGender,
            });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Navigate to next screen or main app
            navigation.navigate('CountrySetup');
        } catch (error) {
            console.error('Profile setup error:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateAge = (day, month, year) => {
        const today = new Date();
        const birthDate = new Date(year, month - 1, day); // month - 1 because Date constructor uses 0-based months

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

    const handleBirthdayPress = () => {
        setShowDatePicker(true);
    };

    // Handle date selection from calendar
    const handleDateSelect = (date) => {
        setSelectedDate(date);

        // Convert month name to number
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthNumber = (monthNames.indexOf(date.month) + 1).toString().padStart(2, '0');

        setBirthday(`${date.day}/${monthNumber}/${date.year}`);

        // Check age validation
        const age = calculateAge(parseInt(date.day), parseInt(monthNumber), parseInt(date.year));
        setIsUnderAge(age < 18);
    };

    // Handle calendar save
    const handleCalendarSave = () => {
        setShowDatePicker(false);
    };

    // Handle calendar cancel
    const handleCalendarCancel = () => {
        setShowDatePicker(false);
    };

    const formatBirthday = (text: string) => {
        // Remove all non-digits
        const digits = text.replace(/\D/g, '');

        // Format as DD/MM/YYYY
        if (digits.length >= 5) {
            return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
        } else if (digits.length >= 3) {
            return `${digits.slice(0, 2)}/${digits.slice(2)}`;
        } else {
            return digits;
        }
    };

    const handleBirthdayChange = (text: string) => {
        const formatted = formatBirthday(text);
        setBirthday(formatted);

        if (errors.birthday) {
            setErrors(prev => ({ ...prev, birthday: '' }));
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Background gradient */}
            <Svg height="50%" width="100%" style={styles.gradient}>
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
            <View style={styles.glowContainer}>
                <GlowBackground width={242} height={218} />
            </View>

            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                        activeOpacity={0.7}
                    >
                        <ArrowLeft size={20} color="#FFFFFF" strokeWidth={1.5} />
                    </TouchableOpacity>
                    <View style={styles.progressContainer}>
                        <Text style={styles.progressText}>
                            <Text style={styles.progressCurrent}>01</Text>
                            <Text style={styles.progressTotal}>/ 02</Text>
                        </Text>
                    </View>
                </View>

                <KeyboardAvoidingView
                    style={styles.keyboardView}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        scrollEnabled={!showDatePicker} // Disable scrolling when date picker is visible
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Main content */}
                        <View style={styles.content}>
                            <View style={styles.titleSection}>
                                <Text style={styles.title}>Let's setup you up</Text>
                            </View>

                            {/* Form section */}
                            <View style={styles.formSection}>
                                {/* First Name */}
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>can we have your name*</Text>
                                    <View style={[
                                        styles.inputWrapper,
                                        firstName.length > 0 && styles.inputWrapperActive,
                                        errors.firstName && styles.inputWrapperError
                                    ]}>
                                        <TextInput
                                            style={styles.textInput}
                                            placeholder=""
                                            placeholderTextColor="#666666"
                                            value={firstName}
                                            onChangeText={(text) => {
                                                setFirstName(text);
                                                if (errors.firstName) {
                                                    setErrors(prev => ({ ...prev, firstName: '' }));
                                                }
                                            }}
                                            autoCapitalize="words"
                                            autoCorrect={false}
                                            editable={!loading}
                                        />
                                        {firstName.length === 0 && !errors.firstName && (
                                            <View style={styles.cursor} />
                                        )}
                                    </View>
                                    {errors.firstName && (
                                        <Text style={styles.errorText}>{errors.firstName}</Text>
                                    )}
                                </View>

                                {/* Last Name */}
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Can we have your Last name*</Text>
                                    <View style={[
                                        styles.inputWrapper,
                                        styles.inputWrapperInactive,
                                        errors.lastName && styles.inputWrapperError
                                    ]}>
                                        <TextInput
                                            style={styles.textInput}
                                            placeholder=""
                                            placeholderTextColor="#666666"
                                            value={lastName}
                                            onChangeText={(text) => {
                                                setLastName(text);
                                                if (errors.lastName) {
                                                    setErrors(prev => ({ ...prev, lastName: '' }));
                                                }
                                            }}
                                            autoCapitalize="words"
                                            autoCorrect={false}
                                            editable={!loading}
                                        />
                                    </View>
                                    {errors.lastName && (
                                        <Text style={styles.errorText}>{errors.lastName}</Text>
                                    )}
                                </View>

                                {/* Birthday */}
                                {/* <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Can we have your birthday?</Text>
                                    <View style={[
                                        styles.inputWrapper,
                                        styles.inputWrapperInactive,
                                        errors.birthday && styles.inputWrapperError
                                    ]}>
                                        <TextInput
                                            style={[styles.textInput, !birthday && styles.placeholderText]}
                                            placeholder="DD/MM/YYYY"
                                            placeholderTextColor="#999999"
                                            value={birthday}
                                            onChangeText={handleBirthdayChange}
                                            keyboardType="numeric"
                                            maxLength={10}
                                            editable={!loading}
                                        />
                                        <TouchableOpacity style={styles.calendarIcon}>
                                            <Calendar size={20} color="#999999" strokeWidth={1.5} />
                                        </TouchableOpacity>
                                    </View>
                                    {errors.birthday && (
                                        <Text style={styles.errorText}>{errors.birthday}</Text>
                                    )}
                                </View> */}
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Can we have your birthday?</Text>
                                    <TouchableOpacity
                                        style={styles.birthdayInput}
                                        onPress={handleBirthdayPress}
                                    >
                                        <Text style={[styles.birthdayText, !birthday && styles.placeholder]}>
                                            {birthday || 'DD/MM/YYYY'}
                                        </Text>
                                        <View style={styles.calendarIcon}>
                                            <Calendar size={20} color="#999999" strokeWidth={1.5} />
                                        </View>
                                    </TouchableOpacity>
                                    {isUnderAge && (
                                        <View style={styles.errorContainer}>
                                            <View style={styles.errorIcon}>
                                                <AlertCircle size={16} color="#FF4444" strokeWidth={2} />
                                            </View>
                                            <Text style={styles.errorText}>You must be 18 years old to use Spooned</Text>
                                        </View>
                                    )}

                                    <DatePickerCalendar
                                        isVisible={showDatePicker}
                                        selectedDate={selectedDate}
                                        onDateSelect={handleDateSelect}
                                        onCancel={handleCalendarCancel}
                                        onSave={handleCalendarSave}
                                    />
                                </View>

                                {/* Gender Selection */}
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>What is your gender?</Text>
                                    <View style={styles.genderContainer}>
                                        <TouchableOpacity
                                            style={[
                                                styles.genderOption,
                                                selectedGender === 'women' && styles.genderOptionSelected
                                            ]}
                                            onPress={() => {
                                                setSelectedGender('women');
                                                if (errors.gender) {
                                                    setErrors(prev => ({ ...prev, gender: '' }));
                                                }
                                            }}
                                            disabled={loading}
                                            activeOpacity={0.7}
                                        >
                                            <View style={styles.genderIconContainer}>
                                                <Image
                                                    source={require('../../assets/icons/women.png')}
                                                    style={{ width: 36, height: 36 }}
                                                    resizeMode="contain"
                                                />
                                            </View>
                                            <Text style={styles.genderText}>Women</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[
                                                styles.genderOption,
                                                selectedGender === 'men' && styles.genderOptionSelected
                                            ]}
                                            onPress={() => {
                                                setSelectedGender('men');
                                                if (errors.gender) {
                                                    setErrors(prev => ({ ...prev, gender: '' }));
                                                }
                                            }}
                                            disabled={loading}
                                            activeOpacity={0.7}
                                        >
                                            <View style={styles.genderIconContainer}>
                                                <Image source={require('../../assets/icons/man.png')}
                                                    style={{ width: 32, height: 32 }}
                                                    resizeMode="contain"
                                                />
                                            </View>
                                            <Text style={styles.genderText}>Men</Text>
                                        </TouchableOpacity>
                                    </View>
                                    {errors.gender && (
                                        <Text style={styles.errorText}>{errors.gender}</Text>
                                    )}
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                    {/* Bottom section with Next button */}
                    <View style={styles.bottomSection}>
                        <TouchableOpacity
                            style={[
                                styles.nextButton,
                                isUnderAge && styles.nextButtonDisabled
                            ]}
                            onPress={handleNext}
                            disabled={isUnderAge} // Add this to disable the button
                        >
                            <Text style={[
                                styles.nextButtonText,
                                isUnderAge && styles.nextButtonTextDisabled
                            ]}>
                                Next
                            </Text>
                        </TouchableOpacity>

                    </View>
                </KeyboardAvoidingView>

                {/* Home indicator */}
                <View style={styles.homeIndicator} />
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    gradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
    },
    glowContainer: {
        position: 'absolute',
        top: -66,
        left: -93,
        width: 242,
        height: 218,
        zIndex: 2,
    },
    safeArea: {
        flex: 1,
        zIndex: 3,
    },
    header: {
        height: 64,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 0 : 20,
    },
    backButton: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressContainer: {
        flex: 1,
        alignItems: 'center',
    },
    progressText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    },
    progressCurrent: {
        color: '#FFFFFF',
    },
    progressTotal: {
        color: '#999999',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
    },
    content: {
        flex: 1,
        paddingTop: 20,
    },
    titleSection: {
        marginBottom: 40,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFFFFF',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    },
    formSection: {
        gap: 24,
    },
    inputContainer: {
        gap: 12,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#FFFFFF',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    },
    inputWrapper: {
        height: 48,
        backgroundColor: '#000000',
        borderRadius: 50,
        borderWidth: 0.5,
        borderColor: '#FFFFFF',
        paddingHorizontal: 16,
        justifyContent: 'center',
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputWrapperActive: {
        borderBottomWidth: 3,
        borderBottomColor: '#FFFFFF',
    },
    inputWrapperInactive: {
        opacity: 0.7,
        borderWidth: 0.3,
    },
    inputWrapperError: {
        borderColor: '#FF6B6B',
        borderBottomColor: '#FF6B6B',
    },
    textInput: {
        flex: 1,
        fontSize: 14,
        color: '#FFFFFF',
        height: '100%',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    },
    placeholderText: {
        color: '#999999',
    },
    cursor: {
        position: 'absolute',
        left: 16,
        width: 1,
        height: 20,
        backgroundColor: '#FFFFFF',
    },
    calendarIcon: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    birthdayInput: {
        backgroundColor: '#1A1A1A',
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderWidth: 1,
        borderColor: '#333',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    birthdayText: {
        color: '#fff',
        fontSize: 16,
    },
    placeholder: {
        color: '#666',
    },
    birthdayInputError: {
        borderBottomWidth: 3,
        borderBottomColor: '#FF4444', // Red color
        borderLeftWidth: 0.6,
        borderRightWidth: 0.6,
        borderTopWidth: 0.6,
        borderLeftColor: '#FF4444',
        borderRightColor: '#FF4444',
        borderTopColor: '#FF4444',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    errorIcon: {
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    errorIconText: {
        fontSize: 16,
        color: '#FF4444',
    },
    errorText: {
        flex: 1,
        fontSize: 14,
        color: '#FF4444',
        fontFamily: 'Poppins',
        lineHeight: 16,
    },
    nextButtonDisabled: {
        backgroundColor: '#333333', // Darker/disabled background
        opacity: 0.5,
    },
    nextButtonTextDisabled: {
        color: '#666666', // Grayed out text
    },
    genderContainer: {
        flexDirection: 'row',
        gap: 16,
    },
    genderOption: {
        width: 112,
        height: 116,
        paddingHorizontal: 2,
        paddingVertical: 12,
        backgroundColor: '#312E36',
        borderRadius: 8,
        borderWidth: 1,
        // borderColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    genderOptionSelected: {
        backgroundColor: 'rgba(184, 69, 123, 0.2)',
        borderColor: '#B8457B',
    },
    genderIconContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',

    },
    genderText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#FFFFFF',
        textAlign: 'center',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    },

    bottomSection: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 30,
    },
    nextButton: {
        height: 56,
        backgroundColor: '#B8457B',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 2,
        elevation: 2,
    },
    nextButtonDisabled: {
        opacity: 0.4,
    },
    nextButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#FFFFFF',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    },
    homeIndicator: {
        width: 134,
        height: 5,
        backgroundColor: '#FFFFFF',
        borderRadius: 100,
        alignSelf: 'center',
        marginBottom: Platform.OS === 'ios' ? 8 : 16,
    },
});