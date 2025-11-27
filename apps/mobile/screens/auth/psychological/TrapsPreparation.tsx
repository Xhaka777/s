import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    SafeAreaView,
    Image,
    Animated,
    Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, ThirdUnion } from '../../../components';
import { ArrowLeft, Mic } from 'lucide-react-native';
import ProcessingModal from '../../../components/ProcessingModal';

// LiveKit imports for HeyGen integration
import {
    LiveKitRoom,
    VideoTrack,
    useTracks,
    isTrackReference,
    registerGlobals,
    AudioSession,
} from '@livekit/react-native';
import { Track } from 'livekit-client';

// Register LiveKit globals
registerGlobals();

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// HeyGen API Configuration (Official approach)
const API_CONFIG = {
    apiKey: "Yzc3NGI1M2RhOGU4NDQ5ZDkyYWEwMjVmYzQ3ZjFmMDAtMTc1MDE3MTMzNg==",
    serverUrl: "https://api.heygen.com",
};

// Video Track Component (must be inside LiveKit room)
const VideoTrackView = ({ onAvatarReady, avatarInitializing }) => {
    const tracks = useTracks([Track.Source.Camera], { onlySubscribed: true });

    useEffect(() => {
        if (tracks && tracks.length > 0 && !avatarInitializing) {
            onAvatarReady();
        }
    }, [tracks, avatarInitializing, onAvatarReady]);

    return (
        <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
        }}>
            {tracks.map((track, idx) =>
                isTrackReference(track) ? (
                    <VideoTrack
                        key={idx}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                        }}
                        trackRef={track}
                        objectFit="cover"
                    />
                ) : null
            )}
        </View>
    );
};

// HeyGen Avatar Component
const HeyGenAvatar = ({ 
    isVisible, 
    onAvatarReady, 
    onAvatarError,
    sessionData,
    avatarInitializing 
}) => {
    if (!isVisible || !sessionData.wsUrl || !sessionData.token) {
        return (
            <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Text style={{ color: 'white', fontSize: 18, marginBottom: 20 }}>
                    Preparing your session...
                </Text>
                <View style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    borderWidth: 3,
                    borderColor: '#FF6B9D',
                    borderTopColor: 'transparent',
                }} />
            </View>
        );
    }

    return (
        <LiveKitRoom
            serverUrl={sessionData.wsUrl}
            token={sessionData.token}
            connect={true}
            options={{
                adaptiveStream: { pixelDensity: "screen" },
            }}
            audio={false}
            video={false}
        >
            <VideoTrackView 
                onAvatarReady={onAvatarReady}
                avatarInitializing={avatarInitializing}
            />
        </LiveKitRoom>
    );
};

// Recording Waves Component (keeping your existing implementation)
const RecordingWaves = () => {
    const wave1 = useRef(new Animated.Value(0.3)).current;
    const wave2 = useRef(new Animated.Value(0.5)).current;
    const wave3 = useRef(new Animated.Value(0.8)).current;
    const wave4 = useRef(new Animated.Value(0.4)).current;
    const wave5 = useRef(new Animated.Value(0.9)).current;
    const wave6 = useRef(new Animated.Value(0.2)).current;

    useEffect(() => {
        const animateWaves = () => {
            const duration = 400 + Math.random() * 300;

            Animated.parallel([
                Animated.sequence([
                    Animated.timing(wave1, {
                        toValue: Math.random() * 0.8 + 0.2,
                        duration,
                        useNativeDriver: false,
                    }),
                ]),
                Animated.sequence([
                    Animated.timing(wave2, {
                        toValue: Math.random() * 0.9 + 0.1,
                        duration: duration + 100,
                        useNativeDriver: false,
                    }),
                ]),
                Animated.sequence([
                    Animated.timing(wave3, {
                        toValue: Math.random() * 1.0 + 0.3,
                        duration: duration - 50,
                        useNativeDriver: false,
                    }),
                ]),
                Animated.sequence([
                    Animated.timing(wave4, {
                        toValue: Math.random() * 0.7 + 0.2,
                        duration: duration + 150,
                        useNativeDriver: false,
                    }),
                ]),
                Animated.sequence([
                    Animated.timing(wave5, {
                        toValue: Math.random() * 1.0 + 0.4,
                        duration: duration - 100,
                        useNativeDriver: false,
                    }),
                ]),
                Animated.sequence([
                    Animated.timing(wave6, {
                        toValue: Math.random() * 0.6 + 0.1,
                        duration: duration + 50,
                        useNativeDriver: false,
                    }),
                ]),
            ]).start(animateWaves);
        };

        animateWaves();
    }, []);

    const WaveBar = ({ animatedValue, color = '#FF6B9D' }) => (
        <Animated.View
            style={{
                width: 3,
                backgroundColor: color,
                borderRadius: 1.5,
                marginHorizontal: 4,
                height: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [4, 24],
                }),
            }}
        />
    );

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', height: 24 }}>
            <WaveBar animatedValue={wave1} />
            <WaveBar animatedValue={wave2} />
            <WaveBar animatedValue={wave3} />
            <WaveBar animatedValue={wave4} />
            <WaveBar animatedValue={wave5} />
            <WaveBar animatedValue={wave6} />
            <WaveBar animatedValue={wave1} />
            <WaveBar animatedValue={wave3} />
            <WaveBar animatedValue={wave2} />
            <WaveBar animatedValue={wave4} />
            <WaveBar animatedValue={wave6} />
            <WaveBar animatedValue={wave5} />
            <WaveBar animatedValue={wave2} />
            <WaveBar animatedValue={wave1} />
            <WaveBar animatedValue={wave4} />
            <WaveBar animatedValue={wave3} />
            <WaveBar animatedValue={wave5} />
            <WaveBar animatedValue={wave6} />
        </View>
    );
};

const TrapsPreparation = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const [isRecording, setIsRecording] = useState(false);
    const [recordingComplete, setRecordingComplete] = useState(false);
    const [showProcessing, setShowProcessing] = useState(false);
    const [processingProgress, setProcessingProgress] = useState(0);

    // HeyGen Avatar states
    const [wsUrl, setWsUrl] = useState("");
    const [token, setToken] = useState("");
    const [sessionToken, setSessionToken] = useState("");
    const [sessionId, setSessionId] = useState("");
    const [connected, setConnected] = useState(false);
    const [webSocket, setWebSocket] = useState(null);
    const [loading, setLoading] = useState(false);
    const [speaking, setSpeaking] = useState(false);
    const [avatarInitializing, setAvatarInitializing] = useState(true);
    const [avatarReady, setAvatarReady] = useState(false);

    const nextScreen = route?.params?.nextScreen || 'RelationshipExperience';
    const isFinalStep = route?.params?.isFinalStep || false;

    // HeyGen API functions (Official approach)
    const getSessionToken = async () => {
        try {
            const response = await fetch(
                `${API_CONFIG.serverUrl}/v1/streaming.create_token`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Api-Key": API_CONFIG.apiKey,
                    },
                }
            );

            const data = await response.json();
            console.log("Session token obtained", data.data.token);
            return data.data.token;
        } catch (error) {
            console.error("Error getting session token:", error);
            throw error;
        }
    };

    const startStreamingSession = async (sessionId, sessionToken) => {
        try {
            console.log("Starting streaming session with:", { sessionId, sessionToken });
            const startResponse = await fetch(
                `${API_CONFIG.serverUrl}/v1/streaming.start`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionToken}`,
                    },
                    body: JSON.stringify({
                        session_id: sessionId,
                    }),
                }
            );

            const startData = await startResponse.json();
            console.log("Streaming start response:", startData);

            if (startData) {
                setConnected(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error starting streaming session:", error);
            return false;
        }
    };

    const createSession = async () => {
        try {
            setLoading(true);
            setAvatarInitializing(true);
            
            // Get new session token
            const newSessionToken = await getSessionToken();
            setSessionToken(newSessionToken);

            const response = await fetch(`${API_CONFIG.serverUrl}/v1/streaming.new`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${newSessionToken}`,
                },
                body: JSON.stringify({
                    quality: "high",
                    avatar_name: "", // You can specify an avatar here if you have one
                    voice: {
                        voice_id: "", // You can specify a voice here if you have one
                    },
                    version: "v2",
                    video_encoding: "H264",
                }),
            });

            const data = await response.json();
            console.log("Streaming new response:", data.data);

            if (data.data) {
                const newSessionId = data.data.session_id;
                setSessionId(newSessionId);
                setWsUrl(data.data.url);
                setToken(data.data.access_token);

                // Connect WebSocket
                const params = new URLSearchParams({
                    session_id: newSessionId,
                    session_token: newSessionToken,
                    silence_response: "false",
                    stt_language: "en",
                });

                const wsUrl = `wss://${
                    new URL(API_CONFIG.serverUrl).hostname
                }/v1/ws/streaming.chat?${params}`;

                const ws = new WebSocket(wsUrl);
                setWebSocket(ws);

                // Start streaming session
                await startStreamingSession(newSessionId, newSessionToken);
                setAvatarInitializing(false);
            }
        } catch (error) {
            console.error("Error creating session:", error);
            Alert.alert('Error', 'Failed to initialize avatar. Please try again.');
            setAvatarInitializing(false);
        } finally {
            setLoading(false);
        }
    };

    const sendTextToAvatar = async (text) => {
        if (!sessionId || !sessionToken) {
            console.error('No active session');
            return;
        }

        try {
            setSpeaking(true);

            const response = await fetch(
                `${API_CONFIG.serverUrl}/v1/streaming.task`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionToken}`,
                    },
                    body: JSON.stringify({
                        session_id: sessionId,
                        text: text,
                        task_type: "talk",
                    }),
                }
            );

            const data = await response.json();
            console.log("Task response:", data);
        } catch (error) {
            console.error("Error sending text to avatar:", error);
        } finally {
            // Simulate speaking duration based on text length
            const estimatedDuration = Math.max(2000, text.length * 100);
            setTimeout(() => setSpeaking(false), estimatedDuration);
        }
    };

    const closeSession = async () => {
        try {
            setLoading(true);
            if (!sessionId || !sessionToken) {
                console.log("No active session");
                return;
            }

            const response = await fetch(
                `${API_CONFIG.serverUrl}/v1/streaming.stop`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionToken}`,
                    },
                    body: JSON.stringify({
                        session_id: sessionId,
                    }),
                }
            );

            // Close WebSocket
            if (webSocket) {
                webSocket.close();
                setWebSocket(null);
            }

            // Reset all states
            setConnected(false);
            setSessionId("");
            setSessionToken("");
            setWsUrl("");
            setToken("");
            setSpeaking(false);
            setAvatarReady(false);

            console.log("Session closed successfully");
        } catch (error) {
            console.error("Error closing session:", error);
        } finally {
            setLoading(false);
        }
    };

    // Setup audio session and initialize avatar when component mounts
    useEffect(() => {
        const setupAudio = async () => {
            await AudioSession.startAudioSession();
        };

        setupAudio();
        createSession();
        
        return () => {
            AudioSession.stopAudioSession();
            closeSession();
        };
    }, []);

    // Send introduction text when avatar is ready
    useEffect(() => {
        if (avatarReady && connected) {
            const introText = "Hello! I'm here to help you with your psychological preparation. Please feel free to share your thoughts when you're ready.";
            sendTextToAvatar(introText);
        }
    }, [avatarReady, connected]);

    const handleRecordingToggle = () => {
        if (isRecording) {
            setIsRecording(false);
            setRecordingComplete(true);
        } else {
            setIsRecording(true);
            setRecordingComplete(false);
        }
    };

    const handleDiscard = () => {
        setRecordingComplete(false);
        setIsRecording(false);
    };

    const handleSaveAnswer = async () => {
        if (recordingComplete) {
            // Send response to avatar (in real app, this would be the transcribed text)
            const userResponse = "Thank you for the question. I've given this some thought and feel ready to proceed.";
            await sendTextToAvatar(userResponse);
        }

        if (isFinalStep) {
            setShowProcessing(true);
            setProcessingProgress(0);
    
            const progressInterval = setInterval(() => {
                setProcessingProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(progressInterval);
                        return 100;
                    }
                    return prev + 10;
                });
            }, 200);
        } else {
            navigation.navigate(nextScreen);
        }
    };

    const handleProcessingContinue = async () => {
        setShowProcessing(false);
        setProcessingProgress(0);
        await closeSession();
        navigation.navigate('Conclusion');
    };

    const handleAvatarReady = () => {
        setAvatarReady(true);
    };

    const handleAvatarError = (error) => {
        console.error('Avatar error:', error);
        setAvatarInitializing(false);
        Alert.alert('Avatar Error', 'There was an issue with the avatar. Please try again.');
    };

    return (
        <View className="flex-1 bg-black">
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            {/* HeyGen Avatar Background */}
            <View style={{ flex: 1, width: screenWidth, height: screenHeight }}>
                <HeyGenAvatar
                    isVisible={connected}
                    onAvatarReady={handleAvatarReady}
                    onAvatarError={handleAvatarError}
                    sessionData={{ wsUrl, token, sessionId, sessionToken }}
                    avatarInitializing={avatarInitializing}
                />

                {/* Overlay for UI elements */}
                <View className="absolute inset-0 z-0">
                    {/* Pink glow */}
                    <View
                        className="absolute"
                        style={{
                            left: -264,
                            top: 599,
                            width: 524,
                            height: 237,
                            transform: [{ rotate: '19.68deg' }],
                            zIndex: 1,
                        }}
                    >
                        <ThirdUnion />
                    </View>

                    {/* Bottom fade */}
                    <View className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />
                </View>

                {/* Main Content */}
                <SafeAreaView className="flex-1 justify-between">
                    {/* Header */}
                    <View className="px-5 mt-3">
                        <View className="flex-row justify-between items-center">
                            <TouchableOpacity
                                onPress={async () => {
                                    await closeSession();
                                    navigation.goBack();
                                }}
                                className="w-6 h-6 justify-center items-center"
                                activeOpacity={0.7}
                            >
                                <ArrowLeft size={20} color="#FFFFFF" strokeWidth={1.5} />
                            </TouchableOpacity>

                            <View className="flex-1 items-center">
                                <Text className="text-white text-base font-PoppinsBold text-center">
                                    Traps & Preparation
                                </Text>
                            </View>

                            <View className="flex-row items-center">
                                <Text className="text-white text-base font-PoppinsBold">03 </Text>
                                <Text className="text-gray-400 text-base font-PoppinsBold">/03</Text>
                            </View>
                        </View>
                    </View>

                    {/* Middle Content */}
                    <View className="flex-1 justify-end items-center px-5 pb-32">
                        <View
                            className="bg-black/25 rounded-xl border border-black/20 p-3 mx-4"
                            style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                                borderColor: 'rgba(0, 0, 0, 0.2)',
                                borderWidth: 1,
                                minHeight: 80,
                            }}
                        >
                            {!isRecording && !recordingComplete ? (
                                <View className="items-center justify-center" style={{ minHeight: 56 }}>
                                    <Text className="text-white text-sm font-Poppins text-center leading-6">
                                        {avatarInitializing 
                                            ? "Preparing your session..." 
                                            : speaking 
                                            ? "Sofia is speaking..." 
                                            : "Allow yourself enough calm to reflect on each question and sense what feels true for you"
                                        }
                                    </Text>
                                </View>
                            ) : (
                                <View className="items-center justify-center">
                                    <View className="flex-row items-center gap-3 mt-3">
                                        <Image
                                            source={require('../../../assets/icons/image.png')}
                                            className="w-10 h-10"
                                            resizeMode="cover"
                                        />
                                        <View className="flex-row items-center gap-3">
                                            <View>
                                                <Text className="text-white font-PoppinsMedium">You</Text>
                                                <Text className="text-gray-300 text-xs">Recording</Text>
                                            </View>
                                            <RecordingWaves />
                                        </View>
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Footer Buttons */}
                    <View className="px-5 pb-5">
                        {/* Recording Timer */}
                        <View className='items-center' style={{ height: 40 }}>
                            {isRecording || recordingComplete ? (
                                <Text className="text-white text-xl font-Poppins mt-2 mb-2">
                                    01:52:28
                                </Text>
                            ) : (
                                <Text></Text>
                            )}
                        </View>

                        {/* Conditional Button Rendering */}
                        {recordingComplete ? (
                            <View className="flex-row justify-center items-center gap-3 mb-5">
                                <Button
                                    title="x Discard"
                                    onPress={handleDiscard}
                                    variant="outlined"
                                />

                                <Button
                                    title='Save answer'
                                    onPress={handleSaveAnswer}
                                    variant="primary"
                                    style={{
                                        shadowColor: '#B8457B',
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.3,
                                        shadowRadius: 8,
                                        elevation: 8,
                                    }}
                                />
                            </View>
                        ) : (
                            <View className="flex-row justify-center items-center gap-3 mb-5">
                                <TouchableOpacity
                                    onPress={handleRecordingToggle}
                                    className={`rounded-full px-6 py-3.5 flex-row items-center gap-2 ${isRecording
                                        ? 'bg-transparent border-2 border-white'
                                        : 'bg-white'
                                        }`}
                                    style={{
                                        shadowColor: '#0D0D12',
                                        shadowOffset: { width: 0, height: 1 },
                                        shadowOpacity: 0.06,
                                        shadowRadius: 2,
                                        elevation: 2,
                                    }}
                                    activeOpacity={0.8}
                                    disabled={avatarInitializing}
                                >
                                    <Mic size={20} color={isRecording ? "#FFFFFF" : "#000000"} />
                                    <Text className={`text-base font-PoppinsMedium ${isRecording ? 'text-white' : 'text-black'
                                        }`}>
                                        {isRecording ? 'Stop Recording' : 'Answer by voice'}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="w-11 h-11 rounded-full justify-center items-center"
                                    style={{ backgroundColor: '#99225E' }}
                                    activeOpacity={0.8}
                                    onPress={() => navigation.navigate('PsychologicalChat')}
                                    disabled={avatarInitializing}
                                >
                                    <Image
                                        source={require('../../../assets/icons/message.png')}
                                        style={{ width: 20, height: 20 }}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </SafeAreaView>
            </View>
            
            <ProcessingModal
                visible={showProcessing}
                progress={processingProgress}
                onContinue={handleProcessingContinue}
            />
        </View>
    );
};

export default TrapsPreparation;