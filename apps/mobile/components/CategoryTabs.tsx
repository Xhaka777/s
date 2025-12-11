import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface Category {
    id: string;
    name: string;
}

interface CategoryTabsProps {
    categories: Category[];
    selectedCategory: string;
    onCategorySelect: (categoryId: string) => void;
}

export default function CategoryTabs({
    categories,
    selectedCategory,
    onCategorySelect,
}: CategoryTabsProps) {

    // Function to determine padding based on category name length
    const getPaddingForCategory = (categoryName: string) => {
        if (categoryName.length <= 3) return 20; // Compact for "All"
        if (categoryName.length <= 7) return 15; // Medium for "Dining", "Culture"
        return 28; // Larger for longer names like "Wellness"
    };

    return (
        <View className="mb-6">
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20 }}
                className="flex-row"
            >
                {categories.map((category, index) => {
                    const isSelected = category.id === selectedCategory;
                    const isFirst = index === 0;
                    const horizontalPadding = getPaddingForCategory(category.name);

                    return (
                        <TouchableOpacity
                            key={category.id}
                            onPress={() => onCategorySelect(category.id)}
                            className={`py-3 rounded-full mr-3 items-center justify-center ${
                                isSelected 
                                    ? 'bg-[#99225E]' 
                                    : 'bg-[#0d0d0d] border border-[#252525]'
                            }`}
                            style={{
                                marginLeft: isFirst ? 0 : 0,
                                paddingHorizontal: horizontalPadding,
                            }}
                        >
                            <Text
                                className={`font-PoppinsMedium text-sm ${
                                    isSelected ? 'text-white' : 'text-gray-400'
                                }`}
                            >
                                {category.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}