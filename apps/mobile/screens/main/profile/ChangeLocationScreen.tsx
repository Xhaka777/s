import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { ArrowLeft, Search } from 'lucide-react-native';
import { cities, countries, searchCities, searchCountries, getCountryByCity } from '../../../location-data';
import Input from '../../../components/Input';
import { Button, ThirdUnion } from '../../../components';

const ChangeLocationScreen = ({ navigation, route }) => {
    // Get current location data from route params
    const currentCity = route?.params?.currentCity || '';
    const currentCountry = route?.params?.currentCountry || '';
    const onLocationChange = route?.params?.onLocationChange || (() => {});

    const [city, setCity] = useState(currentCity);
    const [country, setCountry] = useState(currentCountry);
    const [selectedCity, setSelectedCity] = useState(
        currentCity ? { name: currentCity } : null
    );
    const [selectedCountry, setSelectedCountry] = useState(
        currentCountry ? { name: currentCountry } : null
    );

    // Dropdown states
    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [cityResults, setCityResults] = useState([]);
    const [countryResults, setCountryResults] = useState(countries);

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

    // Handle save changes
    const handleChange = () => {
        if (selectedCity && selectedCountry) {
            // Call the callback function with new location data
            onLocationChange({
                city: selectedCity.name,
                country: selectedCountry.name,
            });
            navigation.goBack();
        }
    };

    // Handle cancel
    const handleCancel = () => {
        navigation.goBack();
    };

    const isFormValid = selectedCity && selectedCountry;
    const hasChanges = 
        selectedCity?.name !== currentCity || 
        selectedCountry?.name !== currentCountry;

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
            <Text className="text-sm font-medium text-white leading-5">{item.name}</Text>
            <Text className="text-xs font-medium text-gray-400 leading-4 mt-0.5">{item.country}</Text>
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
                        {selectedCountry && selectedCountry.name === item.name && (
                            <View className="w-2.5 h-2.5 rounded-full bg-white" />
                        )}
                    </View>
                    <Text className="text-sm font-medium text-white leading-5">{item.name}</Text>
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
                {/* Background Layer */}
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
                            left: -26,
                            top: -54,
                            width: 524,
                            height: 237,
                            transform: [{ rotate: '20deg' }],
                            zIndex: 1,
                        }}
                    >
                        <ThirdUnion />
                    </View>
                </View>

                {/* Content Layer */}
                <SafeAreaView className="flex-1 relative z-10">
                    {/* Header */}
                    <View className="flex-row items-center justify-between px-5 pt-2.5 pb-5 mb-8">
                        <TouchableOpacity
                            className="w-10 h-10 items-center justify-center"
                            onPress={handleCancel}
                        >
                            <ArrowLeft color="#FFFFFF" size={24} />
                        </TouchableOpacity>
                        <Text className="text-xl font-semibold text-white">Change Location</Text>
                        <View className="w-10" />
                    </View>

                    {/* Form Content */}
                    <ScrollView
                        className="flex-1 px-5"
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        onScrollBeginDrag={closeDropdowns}
                    >
                        {/* City Input */}
                        <View className="mb-6">
                            <Text className="text-white text-base font-medium mb-4">City</Text>
                            <View className="relative">
                                <Input
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
                                    <View className="bg-[#201E23] bg-opacity-95 rounded-2xl border-[0.5px] border-white border-opacity-10 max-h-50 mt-2 py-2 z-50">
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
                        </View>

                        {/* Country Input */}
                        <View className="mb-8">
                            <Text className="text-white text-base font-medium mb-4">Country</Text>
                            <View className="relative">
                                <Input
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
                                    <View className="bg-[#201E23] bg-opacity-95 rounded-2xl border-[0.5px] border-white border-opacity-10 max-h-50 mt-2 py-2 z-50">
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

                        {/* Add extra space for dropdown */}
                        <View className="h-20" />
                    </ScrollView>

                    {/* Bottom Buttons */}
                    <View className="px-5 pb-8 pt-4">
                        <View className="flex-row gap-4">
                            {/* Cancel Button */}
                            <TouchableOpacity
                                className="flex-1 bg-transparent border border-gray-500 rounded-full py-4 justify-center items-center"
                                onPress={handleCancel}
                            >
                                <Text className="text-white text-base font-medium">Cancel</Text>
                            </TouchableOpacity>

                            {/* Change Button */}
                            <TouchableOpacity
                                className={`flex-1 rounded-full py-4 justify-center items-center ${
                                    isFormValid && hasChanges
                                        ? 'bg-[#99225E]'
                                        : 'bg-gray-600'
                                }`}
                                onPress={handleChange}
                                disabled={!isFormValid || !hasChanges}
                            >
                                <Text className={`text-base font-medium ${
                                    isFormValid && hasChanges ? 'text-white' : 'text-gray-400'
                                }`}>
                                    Change
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default ChangeLocationScreen;