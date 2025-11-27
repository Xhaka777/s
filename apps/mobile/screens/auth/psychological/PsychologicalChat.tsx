import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StatusBar,
    SafeAreaView,
    ScrollView,
    TextInput,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Camera, Mic, Send, Smile } from 'lucide-react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { ThirdUnion } from '../../../components';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// No custom keyboard component needed

const PsychologicalChat = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const [message, setMessage] = useState('');
    const scrollViewRef = useRef<ScrollView>(null);

    //proceed popup
    const [showProceedPopup, setShowProceedPopup] = useState(false);
    const lastBubbleRef = useRef(null);
    const [popupPosition, setPopupPosition] = useState({ top: 0, right: 20 });


    // Messages data
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: 'Which typical trap do you recognize in yourself?',
            timestamp: '09:25 PM',
            isUser: false,
        }
    ]);

    const handleSendMessage = () => {
        if (message.trim()) {
            const newMessage = {
                id: messages.length + 1,
                text: message.trim(),
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isUser: true,
            };

            setMessages(prev => [...prev, newMessage]);
            setMessage('');

            setTimeout(() => {
                lastBubbleRef.current?.measure((fx, fy, width, height, px, py) => {
                    const popupWidth = 230; // same width as UI bubble

                    setPopupPosition({
                        top: py + height + 4,
                        left: px + width - popupWidth + 20 // aligns pointer to bubble corner
                    });

                    setShowProceedPopup(true);
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                });

            }, 150);

        }
    };

    const handleProceedWithAnswer = () => {
        if (message.trim()) {
            const newMessage = {
                id: messages.length + 1,
                text: message.trim(),
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isUser: true,
            };
            setMessages(prev => [...prev, newMessage]);
            setMessage('');
            setShowProceedPopup(false);

            //
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }

    const MessageBubble = ({ message, isUser }) => (
        <View className={`mb-3 ${isUser ? 'items-end' : 'items-start'}`}>
            <View
                className={`px-5 py-2.5 max-w-4/5 ${isUser
                    ? 'bg-pink-700 rounded-tl-3xl rounded-tr-3xl rounded-bl-3xl'
                    : 'bg-gray-800 rounded-tl-3xl rounded-tr-3xl rounded-br-3xl'
                    }`}
                style={{
                    backgroundColor: isUser ? '#FFFFFF' : '#201E23',
                    maxWidth: '85%'
                }}
            >
                <Text
                    className="text-base font-Poppins leading-6"
                    style={isUser ? { color: '#000000' } : { color: '#FFFFFF' }}
                >
                    {message.text}
                </Text>
            </View>
            <View className={`mt-1 ${isUser ? 'items-end' : 'items-start'}`}>
                <Text
                    className="text-zinc-400 text-xs font-Poppins leading-4"
                >
                    {message.timestamp}
                </Text>
            </View>
        </View>
    );

    const ProceedPopup = () => (
        <View className="absolute right-4 bottom-24 z-50">
            <View
                className="bg-white rounded-lg px-3 py-2 shadow-lg"
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 5,
                }}
            >
                <Text
                    className="text-black text-xs font-medium mb-2 text-center"
                    style={{ fontFamily: 'Inter' }}
                >
                    Ready to proceed your answer
                </Text>
                <TouchableOpacity
                    onPress={handleProceedWithAnswer}
                    className="bg-pink-600 rounded px-4 py-1 items-center"
                    style={{ backgroundColor: '#99225E' }}
                    activeOpacity={0.8}
                >
                    <Text
                        className="text-white text-xs font-normal"
                        style={{ fontFamily: 'Inter' }}
                    >
                        DONE
                    </Text>
                </TouchableOpacity>
            </View>
            {/* Triangle pointer */}
            <View
                className="absolute bottom-0 right-4 transform translate-y-1"
                style={{
                    width: 0,
                    height: 0,
                    borderLeftWidth: 6,
                    borderRightWidth: 6,
                    borderTopWidth: 6,
                    borderLeftColor: 'transparent',
                    borderRightColor: 'transparent',
                    borderTopColor: 'white',
                }}
            />
        </View>
    );

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-black"
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            {/* Background Gradient */}
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
                <View
                    className="absolute"
                    style={{
                        left: -76,           // X position from Figma
                        top: 454,            // Y position from Figma  
                        width: 524,          // Width from Figma
                        height: 237,         // Height from Figma
                        // transform: [{ rotate: '1deg' }], // No rotation
                        zIndex: 1,           // Adjust as needed for layering
                    }}
                >
                    <ThirdUnion />
                </View>
            </View>

            <SafeAreaView className="flex-1">
                {/* Header */}
                <View
                    className="px-5 py-2.5 bg-black/40 flex-row justify-start items-center gap-9"
                    style={{ marginTop: insets.top }}
                >
                    <View className="flex-row justify-start items-center gap-2">
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            className="w-8 h-8 justify-center items-center"
                            activeOpacity={0.7}
                        >
                            <ArrowLeft size={24} color="#FFFFFF" strokeWidth={1.5} />
                        </TouchableOpacity>

                        <View className="w-8 h-8 rounded-full border border-zinc-400 relative">
                            <Image
                                source={require('../../../assets/icons/image.png')}
                                className="w-8 h-8 rounded-full"
                                resizeMode="cover"
                            />
                            <View className="w-2.5 h-2.5 bg-teal-500 rounded-full absolute -bottom-0.5 -right-0.5" />
                        </View>

                        <Text
                            className="text-white text-lg font-semibold leading-6"
                            style={{ fontFamily: 'Poppins' }}
                        >
                            Avatar Name
                        </Text>
                    </View>
                </View>

                {/* Chat Messages */}
                <ScrollView
                    ref={scrollViewRef}
                    className="flex-1 px-4"
                    contentContainerStyle={{ paddingBottom: 20, paddingTop: 20 }}
                    showsVerticalScrollIndicator={false}
                >
                    {messages.map((msg, index) => (
                        <View
                            key={msg.id}
                            ref={index === messages.length - 1 && msg.isUser ? lastBubbleRef : null}
                        >
                            <MessageBubble message={msg} isUser={msg.isUser} />
                        </View>
                    ))}
                </ScrollView>
                {showProceedPopup && (
                    <View
                        style={{
                            position: 'absolute',
                            top: popupPosition.top,
                            right: 12,
                            width: 230,
                            zIndex: 999
                        }}
                    >
                        {/* Card */}
                        <View
                            style={{
                                backgroundColor: 'white',
                                borderRadius: 16,
                                paddingVertical: 12,
                                paddingHorizontal: 14,
                                shadowColor: '#000',
                                shadowOpacity: 0.15,
                                shadowRadius: 10,
                                elevation: 5,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: '#000',
                                    textAlign: 'center',
                                    marginBottom: 8,
                                    fontWeight: '500',
                                }}
                            >
                                Ready to proceed your answer
                            </Text>
                            <View style={{ alignItems: 'flex-end', marginTop: 4 }}>
                                <TouchableOpacity
                                    onPress={handleProceedWithAnswer}
                                    style={{
                                        backgroundColor: '#99225E',
                                        borderRadius: 10,
                                        paddingVertical: 6,
                                        width: '50%',
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontSize: 12,
                                            fontWeight: '600',
                                            textAlign: 'center',
                                        }}
                                    >
                                        DONE
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Pointer */}
                        <View
                            style={{
                                position: 'absolute',
                                top: -6,
                                right: 32,
                                width: 0,
                                height: 0,
                                borderLeftWidth: 8,
                                borderRightWidth: 8,
                                borderBottomWidth: 8,
                                borderLeftColor: 'transparent',
                                borderRightColor: 'transparent',
                                borderBottomColor: 'white',
                            }}
                        />
                    </View>
                )}


                {/* Input Section */}
                <View className="px-5 py-4 bg-black">
                    <View className="flex-row justify-center items-center gap-2">
                        {/* Camera and Link Icons */}
                        <View className="flex-row justify-center items-center gap-3">
                            <TouchableOpacity activeOpacity={0.7}>
                                <Image
                                    source={require('../../../assets/icons/gallery.png')}
                                    className="w-6 h-6"
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.7}>
                                <Image
                                    source={require('../../../assets/icons/attachment.png')}
                                    className="w-6 h-6"
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Message Input */}
                        <View className="flex-1 h-12 px-4 bg-[#201E23] rounded-full flex-row justify-between items-center">
                            <TextInput
                                value={message}
                                onChangeText={setMessage}
                                placeholder="Type your message.."
                                placeholderTextColor="#9CA3AF"
                                className="flex-1 text-white text-sm font-Poppins"
                                multiline={false}
                                onSubmitEditing={handleSendMessage}
                                returnKeyType="send"
                                keyboardAppearance="dark"
                            />

                            <View className="flex-row justify-start items-center gap-2 ml-2">
                                <TouchableOpacity activeOpacity={0.7}>
                                    <Image
                                        source={require('../../../assets/icons/smile.png')}
                                        className="w-6 h-6"
                                        resizeMode="contain"
                                    />

                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={handleSendMessage}
                                    activeOpacity={0.7}
                                    disabled={!message.trim()}
                                >
                                    <Image
                                        source={require('../../../assets/icons/send.png')}
                                        className="w-6 h-6"
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default PsychologicalChat;