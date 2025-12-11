import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    FlatList,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

interface RouteParams {
    images: string[];
    initialIndex?: number;
    eventTitle?: string;
}

export default function EventGalleryScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { images, initialIndex = 0, eventTitle } = route.params as RouteParams;

    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const flatListRef = React.useRef<FlatList>(null);

    const handlePrevious = () => {
        if (currentIndex > 0) {
            const newIndex = currentIndex - 1;
            setCurrentIndex(newIndex);
            flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
        }
    };

    const handleNext = () => {
        if (currentIndex < images.length - 1) {
            const newIndex = currentIndex + 1;
            setCurrentIndex(newIndex);
            flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
        }
    };

    const handleThumbnailPress = (index: number) => {
        setCurrentIndex(index);
        flatListRef.current?.scrollToIndex({ index, animated: true });
    };

    const renderMainImage = ({ item, index }: { item: string; index: number }) => (
        <View style={styles.imageContainer}>
            <Image
                source={typeof item === 'string' ? { uri: item } : item}
                style={styles.mainImage}
                resizeMode="contain"
            />
        </View>
    );

    const renderThumbnail = ({ item, index }: { item: string; index: number }) => (
        <TouchableOpacity
            onPress={() => handleThumbnailPress(index)}
            style={[
                styles.thumbnailContainer,
                currentIndex === index && styles.activeThumbnail,
            ]}
        >
            <Image
                source={typeof item === 'string' ? { uri: item } : item}
                style={styles.thumbnailImage}
                resizeMode="cover"
            />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="black" translucent />

            {/* Header */}
            <SafeAreaView edges={['top']} style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.headerButton}
                    >
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>

                    {eventTitle && (
                        <Text style={styles.headerTitle} numberOfLines={1}>
                            {eventTitle}
                        </Text>
                    )}

                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.headerButton}
                    >
                        <X size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {/* Main Image Gallery */}
            <View style={styles.mainGalleryContainer}>
                <FlatList
                    ref={flatListRef}
                    data={images}
                    renderItem={renderMainImage}
                    keyExtractor={(item, index) => `main-${index}`}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={(event) => {
                        const newIndex = Math.round(
                            event.nativeEvent.contentOffset.x / width
                        );
                        setCurrentIndex(newIndex);
                    }}
                    getItemLayout={(data, index) => ({
                        length: width,
                        offset: width * index,
                        index,
                    })}
                />

                {/* Navigation Arrows */}
                {currentIndex > 0 && (
                    <TouchableOpacity
                        onPress={handlePrevious}
                        style={[styles.navButton, styles.navButtonLeft]}
                    >
                        <ChevronLeft size={32} color="white" />
                    </TouchableOpacity>
                )}

                {currentIndex < images.length - 1 && (
                    <TouchableOpacity
                        onPress={handleNext}
                        style={[styles.navButton, styles.navButtonRight]}
                    >
                        <ChevronRight size={32} color="white" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Thumbnail Strip */}
            <SafeAreaView edges={['bottom']} style={styles.thumbnailStrip}>
                <FlatList
                    data={images}
                    renderItem={renderThumbnail}
                    keyExtractor={(item, index) => `thumb-${index}`}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.thumbnailList}
                />

            </SafeAreaView>
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(153, 34, 93, 0.17)', 'rgba(153, 34, 93, 0.53)']}
                locations={[0, 0.5, 0.8, 1]}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '60%',
                    zIndex: 1
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    header: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        flex: 1,
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginHorizontal: 16,
    },
    mainGalleryContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        width: width,
        height: height * 0.75,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainImage: {
        width: '100%',
        height: '100%',
    },
    gradientOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40%',
    },
    navButton: {
        position: 'absolute',
        top: '50%',
        width: 48,
        height: 48,
        backgroundColor: 'rgba(153, 34, 94, 0.8)',
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ translateY: -24 }],
    },
    navButtonLeft: {
        left: 16,
    },
    navButtonRight: {
        right: 16,
    },
    thumbnailStrip: {
        // backgroundColor: 'rgba(0, 0, 0, 0.9)',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
    },
    thumbnailList: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
    },
    thumbnailContainer: {
        width: 80,
        height: 80,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    activeThumbnail: {
        borderColor: '#99225E',
    },
    thumbnailImage: {
        width: '100%',
        height: '100%',
    },
});