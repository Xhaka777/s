import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StatusBar,
    ImageBackground,
    Dimensions,
    SafeAreaView,
    ScrollView,
    Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, ThirdUnion } from '../../../components';
import { ArrowLeft } from 'lucide-react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import DraggableFlatList from 'react-native-draggable-flatlist';
import AnswerOption from '../../../components/AnswerOption';

const RelationshipExperience = ({ navigation, route }) => {
    const routeParams = route && route.params ? route.params : {};
    const passedSelectedAnswers = routeParams.selectedAnswers || [];
    const category = routeParams.category || "Partnership and Relationship";
    const returnRoute = routeParams.returnRoute || 'SpoonedQuestionnaire';
    const completedCategory = routeParams.completedCategory || category;

    const [isScrolledToEnd, setIsScrolledToEnd] = useState(true);
    const [showCongratulationsModal, setShowCongratulationsModal] = useState(false);

    //
    const insets = useSafeAreaInsets();

    // All available answers
    const allAnswers = [
        "Overcompensating closeness",
        "A need to control the relationship",
        "Too much autonomy",
        "Emotional withdrawal",
        "Choosing unavailable partners",
        "Recurring pursuer-distancer dynamic",
        "Tension around closeness and space",
        "Lack of trust",
        "Avoidance of vulnerability",
        "Different expectations about commitment",
        "Strong emotional dependency",
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

    // Handle answer selection
    const handleAnswerSelect = (index) => {
        if (isOrderingMode) return; // Don't allow selection in ordering mode

        const newSelectedAnswers = [...selectedAnswers];
        const selectedCount = selectedAnswers.filter(Boolean).length;

        if (selectedAnswers[index]) {
            // Deselect
            newSelectedAnswers[index] = false;
        } else if (selectedCount < 7) {
            // Select if under limit
            newSelectedAnswers[index] = true;
        } else {
            // Already at limit, show message
            Alert.alert("Maximum reached", "You can only select 3 answers.");
            return;
        }

        setSelectedAnswers(newSelectedAnswers);
    };

    // Handle drag end for ordering
    const handleDragEnd = (data) => {
        const updatedItems = data.map((item, index) => ({
            ...item,
            order: index + 1,
        }));
        setOrderedItems(updatedItems);
    };


    const handleNext = () => {
        navigation.navigate('TrapsPreparation', {
            nextScreen: 'TrapAnswers'
        });
    };

    const handleGoBack = () => {
        navigation.goBack();
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
                            onPress={() => { }} // Disable press, only drag works
                            disabled={false}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        );
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
                {/* Header */}
                <View className="px-5" style={{ marginTop: insets.top }}>
                    {/* Navigation Header */}
                    <View className="flex-row justify-between items-center">
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            className="w-6 h-6 justify-center items-center"
                            activeOpacity={0.7}
                        >
                            <ArrowLeft size={20} color="#FFFFFF" strokeWidth={1.5} />
                        </TouchableOpacity>

                        <View className="flex-1 items-center">
                            <Text className="text-white text-base font-PoppinsMedium text-center">
                                Relationship Experiences
                            </Text>
                        </View>

                        <View className="flex-row items-center">
                            <Text className="text-white text-base font-PoppinsMedium">02 </Text>
                            <Text className="text-gray-400 text-base font-PoppinsMedium">/03</Text>
                        </View>
                    </View>
                </View>

                {/* Main content */}
                <View className="flex-1">
                    <View className="px-5 mb-6 mt-5">
                        {/* Category and instructions */}
                        <View className="flex-col gap-6">
                            <View className="flex-col gap-2.5">
                                <Text className="text-['#CE578D'] text-xs font-PoppinsMedium">
                                    Relationship Experiences / Patterns
                                </Text>
                                <View className="flex-col gap-4">
                                    <Text className="text-white text-base font-PoppinsMedium leading-6">
                                        In your previous relationships, the most frequent problem was...
                                    </Text>
                                </View>
                                <Text className="text-white text-xs font-PoppinsMedium leading-4">
                                    (multiple answers possible)
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
                        title={"Back"}
                        variant="secondary"
                        onPress={handleGoBack}
                        style={{ flex: 1 }}
                    />

                    <Button
                        title={"Next"}
                        variant="primary"
                        onPress={handleNext}
                        // disabled={!canProceed}
                        style={{ flex: 1 }}
                    />
                </View>
            </SafeAreaView>

        </View>
    );
}

export default RelationshipExperience;