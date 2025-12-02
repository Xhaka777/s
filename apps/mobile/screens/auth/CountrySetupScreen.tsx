import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    FlatList,
    Alert,
} from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { Button, GlowBackground, SecUnion } from '../../components';
import { Search, ArrowLeft } from 'lucide-react-native';
import { cities, countries, searchCities, searchCountries, getCountryByCity } from '../../location-data';
import Input from '../../components/Input';
import { useCompleteStageTwo } from '../../api/hooks/useOnboarding';
import { tokenStorage } from '../../api/services/tokenStorage';
import { useQueryClient } from '@tanstack/react-query';

const CountrySetupScreen = ({ navigation, route }) => {

    const queryClient = useQueryClient();
    const profileData = route?.params?.profileData || {};

    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState(null);

    // Dropdown states
    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [cityResults, setCityResults] = useState([]);
    const [countryResults, setCountryResults] = useState(countries);

    // Get user data from previous screen if passed via navigation
    const userData = route?.params?.userData || {};

    // Handle city input change
    const handleCityChange = (text) => {
        setCity(text);
        setSelectedCity(null);

        if (text.length > 0) {
            const results = searchCities(text);
            setCityResults(results);
            setShowCityDropdown(true);
        } else {
            setShowCityDropdown(false);
            setCityResults([]);
        }
    };

    // Handle country input change
    const handleCountryChange = (text) => {
        setCountry(text);
        setSelectedCountry(null);

        if (text.length > 0) {
            const results = searchCountries(text);
            setCountryResults(results);
            setShowCountryDropdown(true);
        } else {
            setCountryResults(countries);
            setShowCountryDropdown(true);
        }
    };

    // Handle city selection
    const handleCitySelect = (cityItem) => {
        setCity(cityItem.name);
        setSelectedCity(cityItem);
        setShowCityDropdown(false);

        // Auto-select country based on city
        const relatedCountry = getCountryByCity(cityItem.name);
        if (relatedCountry) {
            setCountry(relatedCountry.name);
            setSelectedCountry(relatedCountry);
        }
    };

    // Handle country selection
    const handleCountrySelect = (countryItem) => {
        setCountry(countryItem.name);
        setSelectedCountry(countryItem);
        setShowCountryDropdown(false);
    };

    // Handle country input focus
    const handleCountryFocus = () => {
        if (!country) {
            setCountryResults(countries);
        }
        setShowCountryDropdown(true);
    };

    const completeStageTwo = useCompleteStageTwo({
        onSuccess: (response) => {
            console.log('Stage Two success:', response);
            // navigation.navigate('VerifyIdentity'); now is handled by AuthNavigator
        },
        onError: (error) => {
            console.error('Stage Two error:', error);
            Alert.alert('Error', error.message || 'Failed to complete profile setup');
        },
    });


    const handleNext = async () => {

        const storedToken = await tokenStorage.getToken();
        console.log('storedToken', storedToken)

        if (selectedCity && selectedCountry) {
            const completeUserData = {
                first_name: profileData.firstName,
                last_name: profileData.lastName,
                dob: formatDateToYYYYMMDD(profileData.birthday),
                gender: mapGenderForAPI(profileData.selectedGender),
                city: selectedCity.name,
                country: selectedCountry.name,
                token: storedToken
            };
            try {
                await completeStageTwo.mutateAsync(completeUserData);

                //Invalidate the onboarding status query to trigger a refetch
                queryClient.invalidateQueries({ queryKey: ['onboarding-status'] });

            } catch (error) {
                console.error('API call failed:', error);
            }
        }
    };


    const formatDateToYYYYMMDD = (ddmmyyyy: string) => {
        if (!ddmmyyyy) return '';
        const [day, month, year] = ddmmyyyy.split('/');
        return `${year}-${month}-${day}`;
    };

    const mapGenderForAPI = (frontendGender: string | undefined): 'male' | 'female' | 'other' | 'prefer_not_to_say' => {
        if (!frontendGender) return 'prefer_not_to_say';
        const g = frontendGender.toLowerCase();

        if (g === 'women' || g === 'woman' || g === 'female') return 'female';
        if (g === 'men' || g === 'man' || g === 'male') return 'male';
        if (g === 'other') return 'other';
        if (g === 'prefer_not_to_say' || g === 'prefer not to say') return 'prefer_not_to_say';

        // default fallback to a valid union value
        return 'prefer_not_to_say';
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const isFormValid = selectedCity && selectedCountry;

    // Close dropdowns when clicking outside
    const closeDropdowns = () => {
        setShowCityDropdown(false);
        setShowCountryDropdown(false);
    };

    const renderCityItem = ({ item }) => (
        <TouchableOpacity
            className="py-3 px-4 border-b border-white border-opacity-10"
            onPress={() => handleCitySelect(item)}
        >
            <Text className="text-sm font-PoppinsMedium text-white leading-5">{item.name}</Text>
            <Text className="text-xs font-PoppinsMedium text-gray-400 leading-4 mt-0.5">{item.country}</Text>
        </TouchableOpacity>
    );

    const renderCountryItem = ({ item }) => (
        <TouchableOpacity
            className="py-3 px-4 border-b border-white border-opacity-10"
            onPress={() => handleCountrySelect(item)}
        >
            <View className="flex-row justify-between items-center">
                <View className="flex-row items-center gap-3">
                    <View className="w-5 h-5 rounded-full border-2 border-white justify-center items-center">
                        {selectedCountry && selectedCountry.id === item.id && (
                            <View className="w-2.5 h-2.5 rounded-full bg-white" />
                        )}
                    </View>
                    <Text className="text-sm font-PoppinsMedium text-white leading-5">{item.name}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-black">
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
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
                    {/* <ScrollView
                        className="flex-1 px-5"
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        onScrollBeginDrag={closeDropdowns}
                    > */}
                    <View className="flex-1 px-5">

                        {/* Header */}
                        <View className="flex-row items-center justify-between pt-5 pb-2.5">
                            <TouchableOpacity
                                className="w-8 h-8 justify-center items-center"
                                onPress={handleBack}
                            >
                                <ArrowLeft size={20} color="#FFFFFF" strokeWidth={1.5} />
                            </TouchableOpacity>

                            <View className="absolute left-1/2 -ml-6">
                                <Text className="text-base font-PoppinsBold">
                                    <Text className="text-white font-PoppinsBold">02</Text>
                                    <Text className="text-gray-400 font-PoppinsBold">/ 02</Text>
                                </Text>
                            </View>
                        </View>

                        {/* Content */}
                        <View className="pt-8">
                            <View className="mb-6">
                                <Text className="text-xl font-PoppinsBold text-white leading-6">Let's setup you up</Text>
                            </View>

                            <View className="mb-10">
                                <Text className="text-sm leading-4">
                                    <Text className="font-PoppinsSemiBold text-white">Can we have your address?</Text>
                                    {'\n'}
                                    <Text className="text-sm font-Poppins text-gray-400">We need it to </Text>
                                    <Text className="text-sm font-Poppins text-white">show you relevant events</Text>
                                    <Text className="text-sm font-Poppins text-gray-400"> and </Text>
                                    <Text className="text-sm font-Poppins text-white">verify your account</Text>
                                </Text>
                            </View>

                            {/* Form Inputs */}
                            <View className="gap-6">
                                {/* City Input */}
                                <View className="gap-4 relative">
                                    <Input
                                        label="City"
                                        value={city}
                                        onChangeText={handleCityChange}
                                        placeholder="Enter your city"
                                        autoCorrect={false}
                                        autoCapitalize="words"
                                        returnKeyType="next"
                                        onFocus={() => city.length > 0 && setShowCityDropdown(true)}
                                        leftIcon={
                                            <View className="w-6 h-6 justify-center items-center opacity-70">
                                                <Search size={20} color="#FFFFFF" />
                                            </View>
                                        }
                                    />

                                    {/* City Dropdown */}
                                    {showCityDropdown && cityResults.length > 0 && (
                                        <View className="bg-[#201E23] bg-opacity-95 rounded-2xl border-[0.5px] border-white border-opacity-10 max-h-50 mt-1 mb-1 py-2 z-50">
                                            <FlatList
                                                data={cityResults}
                                                keyExtractor={(item) => item.id.toString()}
                                                renderItem={renderCityItem}
                                                className="max-h-50"
                                                nestedScrollEnabled={true}
                                            />
                                        </View>
                                    )}
                                </View>

                                {/* Country Input */}
                                <View className="gap-4 relative">
                                    <Input
                                        label="Country"
                                        value={country}
                                        onChangeText={handleCountryChange}
                                        placeholder="Enter your country"
                                        autoCorrect={false}
                                        autoCapitalize="words"
                                        returnKeyType="done"
                                        onFocus={handleCountryFocus}
                                        leftIcon={
                                            <View className="w-6 h-6 justify-center items-center opacity-70">
                                                <Search size={20} color="#FFFFFF" />
                                            </View>
                                        }
                                    />

                                    {/* Country Dropdown */}
                                    {showCountryDropdown && (
                                        <View className="bg-[#201E23] bg-opacity-95 rounded-2xl border-[0.5px] border-white border-opacity-1 max-h-50 mt-1 mb-3 py-2 z-50">
                                            <FlatList
                                                data={countryResults}
                                                keyExtractor={(item) => item.id.toString()}
                                                renderItem={renderCountryItem}
                                                className="max-h-50"
                                                nestedScrollEnabled={true}
                                            />
                                        </View>
                                    )}
                                </View>
                            </View>

                            {/* Add extra space to prevent button overlap with dropdown */}
                            <View className="h-12" />
                        </View>
                    </View>
                    {/* </ScrollView> */}

                    <Button
                        title={isFormValid ? 'Continue to Verification' : 'Next'}
                        onPress={handleNext}
                        variant='primary'
                        disabled={!isFormValid}
                        style={{ paddingHorizontal: 20, marginHorizontal: 20 }}
                    />
                </SafeAreaView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default CountrySetupScreen;