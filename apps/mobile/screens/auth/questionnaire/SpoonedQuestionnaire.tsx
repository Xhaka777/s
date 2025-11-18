import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
} from "react-native";
import { Button, SecUnion, ThirdUnion } from "../../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, CheckSquare, Shield } from "lucide-react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import LinearGradient from 'react-native-linear-gradient';
import QuestionnaireCategory from "../../../components/QuestionnaireCategory"; // Adjust path as needed

const SpoonedQuestionnaire = ({ navigation, route }) => {
    const [selectedCategories, setSelectedCategories] = useState([]);
    
    // Track category progress (0-100) and completion status
    const [categoryProgress, setCategoryProgress] = useState({
        "Partnership and relationship": 0,
        "Goals and expectations": 10,
        "Personal interests and preferences": 30,
        "Children and family": 0,
        "Interests and habits": 0,
        "Religion and worldview": 0,
        "Economic and political values": 0,
        "No-gos in a relationship": 0,
        "Future": 0
    });
    
    const [completedCategories, setCompletedCategories] = useState([]);

    const categories = [
        "Partnership and relationship",
        "Goals and expectations",
        "Personal interests and preferences",
        "Children and family",
        "Interests and habits",
        "Religion and worldview",
        "Economic and political values",
        "No-gos in a relationship",
        "Future"
    ];

    // Check if returning from completed category
    useEffect(() => {
        if (route?.params?.completedCategory) {
            const completedCategory = route.params.completedCategory;
            
            // Mark category as completed
            setCompletedCategories(prev => {
                if (!prev.includes(completedCategory)) {
                    return [...prev, completedCategory];
                }
                return prev;
            });
            
            // Set progress to 100% for completed category
            setCategoryProgress(prev => ({
                ...prev,
                [completedCategory]: 100
            }));

            // Clear the route params to prevent re-triggering
            navigation.setParams({ completedCategory: null });
        }
    }, [route?.params?.completedCategory]);

    const handleCategoryPress = (category) => {
        // Toggle selection state
        setSelectedCategories(prev => {
            if (prev.includes(category)) {
                return prev.filter(item => item !== category);
            } else {
                return [...prev, category];
            }
        });
        
        console.log('Selected category:', category);
        // Navigate to category questions and pass the category name
        navigation.navigate('CategoryQuestions', { 
            category: category,
            returnRoute: 'SpoonedQuestionnaire' // So we know where to return
        });
    };

    return (
        <View className="flex-1 bg-black">
            <StatusBar barStyle='light-content' backgroundColor='#000000' />
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
            </View>
            <SafeAreaView className="flex-1 relative z-10">
                <ScrollView
                    className="flex-1 px-5"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header with logo and icons */}
                    <View className="flex-row items-center justify-between pt-5 pb-8">
                        {/* Spooned Logo */}
                        <Image
                            source={require('../../../assets/images/spooned.png')}
                            style={{
                                width: 120,
                                height: 40,
                            }}
                            resizeMode="contain"
                        />

                        {/* Right side icons */}
                        <View className="flex-row items-center gap-4">
                            <TouchableOpacity>
                                <Image
                                    source={require('../../../assets/icons/notification.png')}
                                    style={{
                                        width: 38,
                                        height: 38,
                                    }}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Image
                                    source={require('../../../assets/icons/filter.png')}
                                    style={{
                                        width: 38,
                                        height: 38,
                                    }}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="flex-1 justify-center items-center gap-6">
                        <View className="w-full flex-col justify-start items-start gap-6">
                            <View className="w-full flex-col justify-center items-center gap-16">
                                <View className="w-full flex-col justify-start items-start gap-6">
                                    <View className="w-full flex-col justify-start items-start gap-2.5">
                                        <View className="w-full justify-start items-center gap-2.5">
                                            <Text className="w-full text-white text-2xl font-PoppinsSemiBold leading-8">
                                                Spooned questionnaire
                                            </Text>
                                        </View>
                                    </View>
                                    <View className="w-full justify-start">
                                        <Text className="leading-5">
                                            <Text className="text-white font-Poppins">
                                                Your honest answers help us invite you to an event where you can feel at ease – relaxed, authentic, and without pressure.
                                            </Text>
                                        </Text>
                                    </View>
                                </View>

                                {/* Categories Section */}
                                <View className="w-full flex-col justify-start items-start gap-4">
                                    {categories.map((category, index) => (
                                        <QuestionnaireCategory
                                            key={index}
                                            title={category}
                                            onPress={() => handleCategoryPress(category)}
                                            isSelected={selectedCategories.includes(category)}
                                            isCompleted={completedCategories.includes(category)}
                                            progress={categoryProgress[category] || 0}
                                        />
                                    ))}
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

export default SpoonedQuestionnaire;