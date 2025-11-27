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
import { ArrowLeft, CheckSquare, Shield, Check } from "lucide-react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import LinearGradient from 'react-native-linear-gradient';
import AnswerOption from "../../../components/AnswerOption";

const CategoryQuestionsScreen = ({ navigation, route }) => {
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [skipQuestions, setSkipQuestions] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [isScrolledToEnd, setIsScrolledToEnd] = useState(true);

    // Get category from route params - THIS IS THE KEY FIX
    const currentCategory = route?.params?.category || "Partnership and relationship";
    const returnRoute = route?.params?.returnRoute || 'SpoonedQuestionnaire';

    const questionSteps = {
        1: {
            category: currentCategory,
            question: "Do their habits match yours? You go first.",
            currentStep: "01",
            totalSteps: "06",
            options: [
                "Starting a family, with or without marriage",
                "A long-term relationship without children",
                "A long-term relationship without more children",
                "An open relationship with mutual freedom (e.g. open relationship or polyamory)"
            ],
            hasSkip: true
        },
        2: {
            category: currentCategory,
            question: "Would a large age difference to your partner be a problem?",
            currentStep: "02",
            totalSteps: "06",
            options: [
                "Yes, an age difference of more than 10 years would be a problem for me.",
                "An age difference of 5 to 10 years would be acceptable, but more would be too much.",
                "No, a big age difference, even more than a decade, would not be a problem for me."
            ],
            hasSkip: false
        },
        3: {
            category: currentCategory,
            question: "Would you be willing to relocate for a partnership?",
            currentStep: "03",
            totalSteps: "06",
            options: [
                "Yes, if it fits, definitely.",
                "Maybe, if it becomes necessary.",
                "No, I would like to stay in my current place of residence."
            ],
            hasSkip: false
        },
        4: {
            category: currentCategory,
            question: "How important is your partner's appearance to you?",
            currentStep: "04",
            totalSteps: "06",
            options: [
                "Very important",
                "Important",
                "Less important"
            ],
            hasSkip: false
        },
        5: {
            category: currentCategory,
            question: "How important is sexuality to you in a relationship?",
            currentStep: "05",
            totalSteps: "06",
            options: [
                "Very important",
                "Important",
                "Less important"
            ],
            hasSkip: false
        },
        6: {
            category: currentCategory,
            question: "What qualities are important to you in your partner?",
            subtitle: "(choose the 3 most important for you)",
            currentStep: "06",
            totalSteps: "06",
            options: [
                "Curiosity and a thirst for adventure",
                "Creativity and flexibility",
                "Self-realization and autonomy",
                "Reliability and a sense of responsibility",
                "Safety and durability",
                "Order and structure",
                "Sociability and openness",
                "Energy and joie de vivre",
                "Closeness and intimacy",
                "Empathy and compassion"
            ],
            hasSkip: false,
            maxSelections: 3
        }
    };

    const currentQuestionData = questionSteps[currentStep];

    const handleAnswerSelect = (optionIndex) => {
        const maxSelections = currentQuestionData.maxSelections;

        if (selectedAnswers.includes(optionIndex)) {
            setSelectedAnswers(selectedAnswers.filter(index => index !== optionIndex));
        } else {
            if (maxSelections && selectedAnswers.length >= maxSelections) {
                // If max selections reached, replace the first selection
                const newAnswers = [...selectedAnswers.slice(1), optionIndex];
                setSelectedAnswers(newAnswers);
            } else {
                setSelectedAnswers([...selectedAnswers, optionIndex]);
            }
        }
    };

    const toggleSkipQuestions = () => {
        setSkipQuestions(!skipQuestions);
    };

    const canProceed = selectedAnswers.length > 0 || skipQuestions;

    const handleNext = () => {
        if (currentStep < 6) {
            // Save current step answers (you can implement this logic)
            console.log(`Step ${currentStep} answers:`, selectedAnswers);
            console.log(`Step ${currentStep} skip:`, skipQuestions);

            // Reset for next step
            setSelectedAnswers([]);
            setSkipQuestions(false);
            setCurrentStep(currentStep + 1);
        } else {
            // Final step - handle completion - THIS IS THE CRITICAL FIX
            console.log(`Final step answers:`, selectedAnswers);
            console.log('Questionnaire completed for category:', currentCategory);
            
            navigation.navigate('OrderAnswers', {
                selectedAnswers: selectedAnswers.map(index => currentQuestionData.options[index]),
                category: currentCategory, // Use currentCategory, not currentQuestionData.category
                returnRoute: returnRoute,
                completedCategory: currentCategory // THIS WAS MISSING!
            });
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            // Reset current step selections
            setSelectedAnswers([]);
            setSkipQuestions(false);
        } else {
            navigation.goBack();
        }
    };

    return (
        <View className="flex-1 bg-black">
            <StatusBar barStyle='light-content' backgroundColor='#000000' />

            {/* Background gradient */}
            <View className="absolute inset-0 z-0">
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
                {/* Header with navigation and step indicator */}
                <View className="flex-row items-center justify-between pt-5 pb-8 px-5">
                    <TouchableOpacity
                        onPress={handleBack}
                        className="w-8 h-8 justify-center items-center"
                        activeOpacity={0.7}
                    >
                        <ArrowLeft size={20} color="#FFFFFF" strokeWidth={1.5} />
                    </TouchableOpacity>

                    <View className="flex-1 items-center">
                        <Text className="text-base font-PoppinsSemibold text-white">
                            <Text className="text-white">{currentQuestionData.currentStep}</Text>
                            <Text className="text-gray-400">/ {currentQuestionData.totalSteps}</Text>
                        </Text>
                    </View>

                    <View className="w-8" />
                </View>

                {/* Main content with ScrollView */}
                <View className="flex-1">
                    <ScrollView
                        className="flex-1"
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ paddingBottom: 20 }}
                        onScroll={(event) => {
                            const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
                            const isScrolledToEnd = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
                            setIsScrolledToEnd(isScrolledToEnd);
                        }}
                        scrollEventThrottle={16}
                    >
                        {/* Main content */}
                        <View className="flex-1 px-5">
                            <View className="flex-col justify-start items-start gap-6 mb-8">
                                {/* Category and Question */}
                                <View className="w-full flex-col justify-start items-start gap-2.5">
                                    <Text className="text-pink-500 text-xs font-Poppins leading-4">
                                        {currentQuestionData.category}
                                    </Text>
                                    <View className="w-full flex-col justify-start items-start gap-4">
                                        <Text className="text-white text-xl font-PoppinsMedium leading-6">
                                            {currentQuestionData.question}
                                        </Text>
                                        {currentQuestionData.subtitle && (
                                            <Text className="text-gray-400 text-sm font-Poppins leading-5">
                                                {currentQuestionData.subtitle}
                                            </Text>
                                        )}
                                    </View>
                                </View>

                                {/* Answer Options */}
                                <View className="w-full flex-col justify-start items-start gap-3">
                                    {currentQuestionData.options.map((option, index) => (
                                        <AnswerOption
                                            key={index}
                                            text={option}
                                            isSelected={selectedAnswers.includes(index)}
                                            onPress={() => handleAnswerSelect(index)}
                                            disabled={skipQuestions}
                                        />
                                    ))}
                                </View>
                            </View>

                            {/* Skip option - only show for step 1 */}
                            {currentQuestionData.hasSkip && (
                                <TouchableOpacity
                                    onPress={toggleSkipQuestions}
                                    className="flex-row justify-start items-start gap-2 mb-8"
                                    activeOpacity={0.7}
                                >
                                    <View className="w-5 h-5 justify-center items-center mt-0.5">
                                        {skipQuestions ? (
                                            <View className="w-4 h-4 bg-pink-500 rounded-sm justify-center items-center">
                                                <Check size={10} color="#FFFFFF" strokeWidth={2} />
                                            </View>
                                        ) : (
                                            <View
                                                className="w-4 h-4 rounded-sm border border-gray-400"
                                                style={{ borderColor: 'rgba(156, 163, 175, 0.6)' }}
                                            />
                                        )}
                                    </View>
                                    <Text className="flex-1 text-white text-base font-Poppins leading-5">
                                        I rather don't want to answer these questions.
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </ScrollView>

                    {/* Shadow overlay when there's more content below */}
                    {!isScrolledToEnd && (
                        <View
                            className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
                            style={{
                                background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
                                // For React Native, we need to use a different approach for gradients
                            }}
                        >
                            <LinearGradient
                                colors={['transparent', 'rgba(0, 0, 0, 0.8)']}
                                className="flex-1"
                                pointerEvents="none"
                            />
                        </View>
                    )}
                </View>

                {/* Fixed Bottom Navigation Buttons */}
                <View
                    className="flex-row justify-start items-center gap-4 px-5 py-3 bg-black"
                    style={{
                        // borderTopWidth: 1,
                        // borderTopColor: 'rgba(255, 255, 255, 0.1)',
                    }}
                >
                    <Button
                        title="Back"
                        variant="secondary"
                        onPress={handleBack}
                        style={{ flex: 1 }}
                    />

                    <Button
                        title={currentStep === 6 ? "Finish" : "Next"}
                        variant="primary"
                        onPress={handleNext}
                        disabled={!canProceed}
                        style={{ flex: 1 }}
                    />
                </View>
            </SafeAreaView>
        </View>
    );
};

export default CategoryQuestionsScreen;