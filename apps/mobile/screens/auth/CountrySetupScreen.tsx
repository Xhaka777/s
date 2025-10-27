import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    FlatList,
} from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { GlowBackground } from '../../components';
import { Search } from 'lucide-react-native';
import { cities, countries, searchCities, searchCountries, getCountryByCity } from '../../location-data';

const CountrySetupScreen = ({ navigation, route }) => {
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

    const handleNext = () => {
        if (selectedCity && selectedCountry) {
            const completeUserData = {
                ...userData,
                city: selectedCity,
                country: selectedCountry
            };
            console.log('Complete user data:', completeUserData);
            // navigation.navigate('NextScreen', { userData: completeUserData });
        }
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
            style={styles.dropdownItem}
            onPress={() => handleCitySelect(item)}
        >
            <Text style={styles.dropdownItemText}>{item.name}</Text>
            <Text style={styles.dropdownItemSubtext}>{item.country}</Text>
        </TouchableOpacity>
    );

    const renderCountryItem = ({ item }) => (
        <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => handleCountrySelect(item)}
        >
            <View style={styles.countryItemContent}>
                <View style={styles.countryItemLeft}>
                    <View style={styles.radioButton}>
                        {selectedCountry && selectedCountry.id === item.id && (
                            <View style={styles.radioButtonSelected} />
                        )}
                    </View>
                    <Text style={styles.dropdownItemText}>{item.name}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView 
                style={{ flex: 1 }} 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* Background blur effect */}
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

                <ScrollView 
                    style={styles.scrollView} 
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    onScrollBeginDrag={closeDropdowns}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                            <Text style={styles.backIcon}>←</Text>
                        </TouchableOpacity>

                        <View style={styles.stepIndicator}>
                            <Text style={styles.stepText}>
                                <Text style={styles.currentStep}>02</Text>
                                <Text style={styles.totalSteps}>/ 02</Text>
                            </Text>
                        </View>
                    </View>

                    {/* Content */}
                    <View style={styles.content}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>Let's setup you up</Text>
                        </View>

                        <View style={styles.descriptionContainer}>
                            <Text style={styles.description}>
                                <Text style={styles.boldText}>Can we have your address?</Text>
                                {'\n'}
                                <Text style={styles.grayText}>We need it to </Text>
                                <Text style={styles.whiteText}>show you relevant events</Text>
                                <Text style={styles.grayText}> and </Text>
                                <Text style={styles.whiteText}>verify your account</Text>
                            </Text>
                        </View>

                        {/* Form Inputs */}
                        <View style={styles.formContainer}>
                            {/* City Input */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>City</Text>
                                <View style={styles.searchInputContainer}>
                                    <View style={styles.searchIcon}>
                                        <Search size={20} color="#FFFFFF" />
                                    </View>
                                    <TextInput
                                        style={styles.searchInput}
                                        placeholder="Enter your city"
                                        placeholderTextColor="#FFFFFF80"
                                        value={city}
                                        onChangeText={handleCityChange}
                                        onFocus={() => city.length > 0 && setShowCityDropdown(true)}
                                        autoCorrect={false}
                                        autoCapitalize="words"
                                        returnKeyType="next"
                                    />
                                </View>
                                
                                {/* City Dropdown */}
                                {showCityDropdown && cityResults.length > 0 && (
                                    <View style={styles.dropdown}>
                                        <FlatList
                                            data={cityResults}
                                            keyExtractor={(item) => item.id.toString()}
                                            renderItem={renderCityItem}
                                            style={styles.dropdownList}
                                            nestedScrollEnabled={true}
                                        />
                                    </View>
                                )}
                            </View>

                            {/* Country Input */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Country</Text>
                                <View style={styles.searchInputContainer}>
                                    <View style={styles.searchIcon}>
                                        <Search size={20} color="#FFFFFF" />
                                    </View>
                                    <TextInput
                                        style={styles.searchInput}
                                        placeholder="Enter your country"
                                        placeholderTextColor="#FFFFFF80"
                                        value={country}
                                        onChangeText={handleCountryChange}
                                        onFocus={handleCountryFocus}
                                        autoCorrect={false}
                                        autoCapitalize="words"
                                        returnKeyType="done"
                                    />
                                </View>
                                
                                {/* Country Dropdown */}
                                {showCountryDropdown && (
                                    <View style={styles.dropdown}>
                                        <FlatList
                                            data={countryResults}
                                            keyExtractor={(item) => item.id.toString()}
                                            renderItem={renderCountryItem}
                                            style={styles.dropdownList}
                                            nestedScrollEnabled={true}
                                        />
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* Add extra space to prevent button overlap with dropdown */}
                        <View style={{ height: 50 }} />
                    </View>
                </ScrollView>

                {/* Next Button */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[
                            styles.nextButton,
                            !isFormValid && styles.nextButtonDisabled
                        ]}
                        onPress={handleNext}
                        disabled={!isFormValid}
                    >
                        <Text style={[
                            styles.nextButtonText,
                            !isFormValid && styles.nextButtonTextDisabled
                        ]}>
                            Next
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

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
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
        zIndex: 3,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 20,
        paddingBottom: 10,
    },
    backButton: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: {
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    stepIndicator: {
        position: 'absolute',
        left: '50%',
        marginLeft: -25,
    },
    stepText: {
        fontSize: 16,
        fontFamily: 'Poppins',
        fontWeight: '600',
    },
    currentStep: {
        color: '#FFFFFF',
    },
    totalSteps: {
        color: '#888888',
    },
    content: {
        paddingTop: 30,
    },
    titleContainer: {
        marginBottom: 24,
    },
    title: {
        fontSize: 20,
        fontFamily: 'Poppins',
        fontWeight: '600',
        color: '#FFFFFF',
        lineHeight: 24,
    },
    descriptionContainer: {
        marginBottom: 40,
    },
    description: {
        fontSize: 14,
        fontFamily: 'Poppins',
        lineHeight: 16,
    },
    boldText: {
        fontWeight: '600',
        color: '#FFFFFF',
    },
    grayText: {
        fontWeight: '400',
        color: '#888888',
    },
    whiteText: {
        fontWeight: '400',
        color: '#FFFFFF',
    },
    formContainer: {
        gap: 24,
    },
    inputContainer: {
        gap: 16,
        position: 'relative',
    },
    label: {
        fontSize: 16,
        fontFamily: 'Poppins',
        fontWeight: '500',
        color: '#FFFFFF',
        lineHeight: 20,
    },
    searchInputContainer: {
        height: 48,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        gap: 12,
    },
    searchIcon: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.7,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'Poppins',
        fontWeight: '500',
        color: '#FFFFFF',
        lineHeight: 20,
        opacity: 1,
    },
    dropdown: {
        backgroundColor: 'rgba(13, 13, 18, 0.95)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        maxHeight: 200,
        marginTop: 4,
        zIndex: 1000,
    },
    dropdownList: {
        maxHeight: 200,
    },
    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    dropdownItemText: {
        fontSize: 14,
        fontFamily: 'Poppins',
        fontWeight: '500',
        color: '#FFFFFF',
        lineHeight: 20,
    },
    dropdownItemSubtext: {
        fontSize: 12,
        fontFamily: 'Poppins',
        fontWeight: '400',
        color: '#888888',
        lineHeight: 16,
        marginTop: 2,
    },
    countryItemContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    countryItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonSelected: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#FFFFFF',
    },
    buttonContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 10,
        backgroundColor: '#000000',
        zIndex: 100,
    },
    nextButton: {
        height: 48,
        backgroundColor: '#FF6B9D',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#0D0D12',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.06,
        shadowRadius: 2,
        elevation: 2,
    },
    nextButtonDisabled: {
        backgroundColor: '#333333',
        opacity: 0.5,
    },
    nextButtonText: {
        fontSize: 16,
        fontFamily: 'Poppins',
        fontWeight: '500',
        color: '#FFFFFF',
        lineHeight: 20,
    },
    nextButtonTextDisabled: {
        color: '#666666',
    },
});

export default CountrySetupScreen;