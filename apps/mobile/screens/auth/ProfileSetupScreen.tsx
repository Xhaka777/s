import React, { useState } from 'react';
import {
    View,
    Text,
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
import Input from '../../components/Input';
import { Button, SecUnion } from '../../components';

interface ProfileSetupScreenProps {
    // You can add props if needed for navigation typing
}

export default function ProfileSetupScreen() {
    const navigation = useNavigation();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthday, setBirthday] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
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

        // Pass data to next screen instead of making API call
        navigation.navigate('CountrySetup', {
            profileData: {
                firstName,
                lastName,
                birthday,
                selectedGender,
            }
        });
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
        <View className="flex-1 bg-black">
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Background Layer - Absolute positioned to not affect content flow */}
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

            {/* Content Layer - Normal flow on top */}
            <SafeAreaView className="flex-1 relative z-10">
                {/* Header */}
                <View className={`h-16 flex-row items-center justify-between px-5 ${Platform.OS === 'android' ? 'pt-5' : ''}`}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="w-8 h-8 justify-center items-center"
                        activeOpacity={0.7}
                    >
                        <ArrowLeft size={20} color="#FFFFFF" strokeWidth={1.5} />
                    </TouchableOpacity>
                    <View className="flex-1 items-center">
                        <Text className="text-base font-PoppinsMedium text-white">
                            <Text className="text-white font-PoppinsMedium">01</Text>
                            <Text className="text-gray-400 font-PoppinsMedium">/ 02</Text>
                        </Text>
                    </View>
                </View>

                <KeyboardAvoidingView
                    className="flex-1"
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20 }}
                        scrollEnabled={!showDatePicker}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Main content */}
                        <View className="flex-1 pt-5">
                            <View className="mb-10">
                                <Text className="text-xl font-PoppinsMedium text-white">Let's setup you up</Text>
                            </View>

                            {/* Form section */}
                            <View className="gap-6">
                                {/* First Name */}
                                <Input
                                    label="Can we have your name"
                                    required
                                    value={firstName}
                                    onChangeText={(text) => {
                                        setFirstName(text);
                                        if (errors.firstName) {
                                            setErrors(prev => ({ ...prev, firstName: '' }));
                                        }
                                    }}
                                    error={errors.firstName}
                                    autoCapitalize="words"
                                    autoCorrect={false}
                                    editable={!loading}
                                />

                                {/* Last Name */}
                                <Input
                                    label="Can we have your Last name"
                                    required
                                    value={lastName}
                                    onChangeText={(text) => {
                                        setLastName(text);
                                        if (errors.lastName) {
                                            setErrors(prev => ({ ...prev, lastName: '' }));
                                        }
                                    }}
                                    error={errors.lastName}
                                    autoCapitalize="words"
                                    autoCorrect={false}
                                    editable={!loading}
                                />

                                {/* Birthday */}
                                <Input
                                    label="Can we have your birthday?"
                                    value={birthday}
                                    onChangeText={handleBirthdayChange}
                                    error={errors.birthday}
                                    placeholder="DD/MM/YYYY"
                                    keyboardType="numeric"
                                    maxLength={10}
                                    editable={!loading}
                                    onPress={handleBirthdayPress}
                                    rightIcon={
                                        <TouchableOpacity onPress={handleBirthdayPress}>
                                            <Calendar size={20} color="#999999" strokeWidth={1.5} />
                                        </TouchableOpacity>
                                    }
                                />

                                {/* Age validation error */}
                                {isUnderAge && (
                                    <View className="flex-row items-center px-1 -mt-3">
                                        <View className="w-5 h-5 justify-center items-center mr-2">
                                            <AlertCircle size={16} color="#FF4444" strokeWidth={2} />
                                        </View>
                                        <Text className="flex-1 text-sm text-red-400 font-Poppins leading-4">You must be 18 years old to use Spooned</Text>
                                    </View>
                                )}

                                <DatePickerCalendar
                                    isVisible={showDatePicker}
                                    selectedDate={selectedDate}
                                    onDateSelect={handleDateSelect}
                                    onCancel={handleCalendarCancel}
                                    onSave={handleCalendarSave}
                                />

                                {/* Gender Selection */}
                                <View className="gap-3">
                                    <Text className="text-base font-PoppinsMedium text-white">What is your gender?</Text>
                                    <View className="flex-row gap-4">
                                        <TouchableOpacity
                                            className={`w-28 h-28 px-0.5 py-3 bg-[#201E23] rounded-lg border justify-center items-center gap-2 ${selectedGender === 'women'
                                                ? 'border-primary'
                                                : 'border-transparent'
                                                }`}
                                            onPress={() => {
                                                setSelectedGender('women');
                                                if (errors.gender) {
                                                    setErrors(prev => ({ ...prev, gender: '' }));
                                                }
                                            }}
                                            disabled={loading}
                                            activeOpacity={0.7}
                                        >
                                            <View className="w-10 h-10 justify-center items-center">
                                                <Image
                                                    source={
                                                        selectedGender === 'women'
                                                            ? require('../../assets/icons/women_pink.png')
                                                            : require('../../assets/icons/women.png')
                                                    }
                                                    style={{ width: 36, height: 36 }}
                                                    resizeMode="contain"
                                                />
                                            </View>

                                            <Text className="text-lg font-PoppinsMedium text-white text-center">Women</Text>
                                        </TouchableOpacity>


                                        <TouchableOpacity
                                            className={`w-28 h-28 px-0.5 py-3 bg-[#201E23] rounded-lg border justify-center items-center gap-2 ${selectedGender === 'men'
                                                ? 'bg-opacity-20 border-primary'
                                                : 'border-transparent'
                                                }`}
                                            onPress={() => {
                                                setSelectedGender('men');
                                                if (errors.gender) {
                                                    setErrors(prev => ({ ...prev, gender: '' }));
                                                }
                                            }}
                                            disabled={loading}
                                            activeOpacity={0.7}
                                        >
                                            <View className="w-10 h-10 justify-center items-center">
                                                <Image
                                                    source={
                                                        selectedGender === 'men'
                                                            ? require('../../assets/icons/man_pink.png')
                                                            : require('../../assets/icons/man.png')
                                                    }
                                                    style={{ width: 32, height: 32 }}
                                                    resizeMode="contain"
                                                />
                                            </View>
                                            <Text className="text-lg font-PoppinsMedium text-white text-center">Men</Text>
                                        </TouchableOpacity>
                                    </View>
                                    {errors.gender && (
                                        <Text className="text-lg text-red-400 font-PoppinsMedium leading-4">{errors.gender}</Text>
                                    )}
                                </View>
                            </View>
                        </View>
                        <Button
                            title='Next'
                            onPress={handleNext}
                            variant='primary'
                            disabled={isUnderAge || loading}
                            loading={loading}
                        />
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}