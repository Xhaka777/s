import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    Alert,
} from "react-native";
import { Button } from "../../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import LinearGradient from 'react-native-linear-gradient';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import AnswerOption from "../../../components/AnswerOption";
import QuestionnaireModal from "../../../components/QuestionnaireModal";
// You'll need to install: npm install react-native-draggable-flatlist

const OrderAnswersScreen = ({ navigation, route }) => {
    // Safely extract params with multiple fallback checks
    const routeParams = route && route.params ? route.params : {};
    const passedSelectedAnswers = routeParams.selectedAnswers || [];
    const category = routeParams.category || "Partnership and Relationship";
    
    const [isScrolledToEnd, setIsScrolledToEnd] = useState(true);
    const [showCongratulationsModal, setShowCongratulationsModal] = useState(false);
    
    // All available answers
    const allAnswers = [
        "Creativity and flexibility",
        "Self-realization and autonomy", 
        "Reliability and a sense of responsibility",
        "Curiosity and a thirst for adventure",
        "Safety and durability",
        "Order and structure"
    ];
    
    // State for which answers are selected (max 3)
    const [selectedAnswers, setSelectedAnswers] = useState(
        passedSelectedAnswers.length > 0 
            ? allAnswers.map(answer => passedSelectedAnswers.includes(answer))
            : new Array(allAnswers.length).fill(false)
    );
    
    // State for ordering mode
    const [isOrderingMode, setIsOrderingMode] = useState(false);
    
    // State for ordered items (only for the selected answers)
    const [orderedItems, setOrderedItems] = useState([]);

    // Show congratulations modal after 1 second when component mounts
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowCongratulationsModal(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    // Get currently selected answers
    const getSelectedAnswerTexts = () => {
        return allAnswers.filter((_, index) => selectedAnswers[index]);
    };

    // Handle answer selection
    const handleAnswerSelect = (index) => {
        if (isOrderingMode) return; // Don't allow selection in ordering mode
        
        const newSelectedAnswers = [...selectedAnswers];
        const selectedCount = selectedAnswers.filter(Boolean).length;
        
        if (selectedAnswers[index]) {
            // Deselect
            newSelectedAnswers[index] = false;
        } else if (selectedCount < 3) {
            // Select if under limit
            newSelectedAnswers[index] = true;
        } else {
            // Already at limit, show message
            Alert.alert("Maximum reached", "You can only select 3 answers.");
            return;
        }
        
        setSelectedAnswers(newSelectedAnswers);
    };

    // Switch to ordering mode
    const enterOrderingMode = () => {
        const selectedTexts = getSelectedAnswerTexts();
        const orderedData = selectedTexts.map((answer, index) => ({
            id: `item-${index}`,
            text: answer,
            order: index + 1,
        }));
        setOrderedItems(orderedData);
        setIsOrderingMode(true);
    };

    // Handle drag end for ordering
    const handleDragEnd = (data) => {
        const updatedItems = data.map((item, index) => ({
            ...item,
            order: index + 1,
        }));
        setOrderedItems(updatedItems);
    };

    // Handle congratulations modal continue
    const handleModalContinue = () => {
        setShowCongratulationsModal(false);
        // Optionally, you can trigger any other action here
    };

    // Handle congratulations modal close
    const handleModalClose = () => {
        setShowCongratulationsModal(false);
    };

    const handleDone = () => {
        if (!isOrderingMode) {
            // Check if 3 answers are selected
            const selectedCount = selectedAnswers.filter(Boolean).length;
            if (selectedCount !== 3) {
                Alert.alert("Please select exactly 3 answers", "You need to choose 3 answers before proceeding.");
                return;
            }
            // Switch to ordering mode
            enterOrderingMode();
        } else {
            // Finish ordering
            const finalOrder = orderedItems.map(item => ({
                text: item.text,
                order: item.order,
            }));
            
            console.log('Final ordered answers:', finalOrder);
            
            // Navigate back safely
            if (navigation && navigation.goBack) {
                navigation.goBack();
            }
        }
    };

    const handleGoBack = () => {
        if (isOrderingMode) {
            // Go back to selection mode
            setIsOrderingMode(false);
        } else {
            // Navigate back
            if (navigation && navigation.goBack) {
                navigation.goBack();
            }
        }
    };

    const renderSelectionItem = (answer, index) => {
        return (
            <AnswerOption
                key={index}
                text={answer}
                isSelected={selectedAnswers[index]}
                onPress={() => handleAnswerSelect(index)}
                disabled={false}
            />
        );
    };

    const renderOrderItem = ({ item, drag, isActive }) => {
        return (
            <TouchableOpacity
                onLongPress={drag}
                disabled={isActive}
                activeOpacity={1}
                className="w-full mb-3"
            >
                <View className="relative">
                    <View 
                        style={{
                            opacity: isActive ? 0.8 : 1,
                            transform: isActive ? [{ scale: 1.02 }] : [{ scale: 1 }],
                        }}
                    >
                        <AnswerOption
                            text={item.text}
                            isSelected={true} // Show as selected in ordering mode
                            onPress={() => {}} // Disable press, only drag works
                            disabled={false}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const selectedCount = selectedAnswers.filter(Boolean).length;
    const canProceed = isOrderingMode ? orderedItems.length > 0 : selectedCount === 3;

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
                {/* Header */}
                <View className="flex-row items-center justify-between pt-5 pb-8 px-5">
                    <TouchableOpacity
                        onPress={handleGoBack}
                        className="w-8 h-8 justify-center items-center"
                        activeOpacity={0.7}
                    >
                        <ArrowLeft size={20} color="#FFFFFF" strokeWidth={1.5} />
                    </TouchableOpacity>
                    
                    <View className="flex-1 items-center">
                        <Text className="text-white text-base font-PoppinsSemibold">
                            Order answers
                        </Text>
                    </View>
                    
                    <View className="w-8" />
                </View>

                {/* Main content */}
                <View className="flex-1">
                    <View className="px-5 mb-6">
                        {/* Category and instructions */}
                        <View className="flex-col gap-6">
                            <View className="flex-col gap-2.5">
                                <Text className="text-green-500 text-xs font-Poppins">
                                    {category}
                                </Text>
                                <View className="flex-col gap-4">
                                    <Text className="text-white text-base font-Poppins leading-6">
                                        {isOrderingMode 
                                            ? "Please drag to order your selected answers by importance." 
                                            : "Can you please select the answers that matter most to you."
                                        }
                                    </Text>
                                </View>
                                <Text className="text-gray-400 text-xs font-Poppins leading-4">
                                    {isOrderingMode 
                                        ? "(drag to reorder - most important first)"
                                        : `(choose exactly 3 answers - ${selectedCount}/3 selected)`
                                    }
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Content - Selection or Ordering */}
                    <View className="flex-1 px-5">
                        {!isOrderingMode ? (
                            // Selection Mode
                            <ScrollView 
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 20 }}
                                onScroll={(event) => {
                                    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
                                    const isScrolledToEnd = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
                                    setIsScrolledToEnd(isScrolledToEnd);
                                }}
                                scrollEventThrottle={16}
                            >
                                <View className="w-full flex-col justify-start items-start gap-3">
                                    {allAnswers.map((answer, index) => renderSelectionItem(answer, index))}
                                </View>
                            </ScrollView>
                        ) : (
                            // Ordering Mode
                            <DraggableFlatList
                                data={orderedItems}
                                onDragEnd={({ data }) => handleDragEnd(data)}
                                keyExtractor={(item) => item.id}
                                renderItem={renderOrderItem}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 20 }}
                                onScroll={(event) => {
                                    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
                                    const isScrolledToEnd = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
                                    setIsScrolledToEnd(isScrolledToEnd);
                                }}
                                scrollEventThrottle={16}
                            />
                        )}
                    </View>

                    {/* Shadow overlay when there's more content below */}
                    {!isScrolledToEnd && (
                        <View className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none">
                            <LinearGradient
                                colors={['transparent', 'rgba(0, 0, 0, 0.8)']}
                                className="flex-1"
                                pointerEvents="none"
                            />
                        </View>
                    )}
                </View>

                {/* Fixed Bottom Navigation */}
                <View 
                    className="flex-row justify-start items-center gap-4 px-5 py-4 bg-black"
                    style={{
                        borderTopWidth: 1,
                        borderTopColor: 'rgba(255, 255, 255, 0.1)',
                    }}
                >
                    <Button
                        title={isOrderingMode ? "Back to Selection" : "Back"}
                        variant="secondary"
                        onPress={handleGoBack}
                        style={{ flex: 1 }}
                    />
                    
                    <Button
                        title={isOrderingMode ? "Done" : "Finish"}
                        variant="primary"
                        onPress={handleDone}
                        disabled={!canProceed}
                        style={{ flex: 1 }}
                    />
                </View>
            </SafeAreaView>

            <QuestionnaireModal
                visible={showCongratulationsModal}
                onClose={handleModalClose}
                onContinue={handleModalContinue}
                category={category}
            />
        </View>
    );
};

export default OrderAnswersScreen;