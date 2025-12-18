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
import Config from 'react-native-config';

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

// HeyGen API Configuration
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
                    Vorbereitung Ihrer Sitzung...
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
            audio={true}
            video={false}
        >
            <VideoTrackView
                onAvatarReady={onAvatarReady}
                avatarInitializing={avatarInitializing}
            />
        </LiveKitRoom>
    );
};

// Recording Waves Component
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
    const [sessionFullyReady, setSessionFullyReady] = useState(false); // New state for full readiness

    const nextScreen = route?.params?.nextScreen || 'RelationshipExperience';
    const isFinalStep = route?.params?.isFinalStep || false;

    // Ref to track if intro has been sent
    const introSentRef = useRef(false);

    const getSessionToken = async () => {
        try {
            console.log("🔑 Getting session token from HeyGen...");
            console.log("🔑 Using API Key:", API_CONFIG.apiKey?.substring(0, 10) + "...");

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

            console.log("📡 Response status:", response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("❌ Error response:", errorText);
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log("📦 Token response received");

            if (data.error) {
                throw new Error(`API Error: ${JSON.stringify(data.error)}`);
            }

            const token = data.data?.token;

            if (!token) {
                console.error("❌ No token found in response:", data);
                throw new Error("No token found in response");
            }

            console.log("✅ Session token obtained successfully");
            return token;
        } catch (error) {
            console.error("❌ Error getting session token:", error);
            throw error;
        }
    };

    const startStreamingSession = async (sessionId, sessionToken) => {
        try {
            console.log("🚀 Starting streaming session...");
            const startResponse = await fetch(
                `${API_CONFIG.serverUrl}/v1/streaming.start`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionToken}`,
                    },
                    body: JSON.stringify({
                        session_id: sessionId,
                    }),
                }
            );

            if (!startResponse.ok) {
                const errorText = await startResponse.text();
                throw new Error(`Start session failed: ${startResponse.status} - ${errorText}`);
            }

            const startData = await startResponse.json();
            console.log("✅ Streaming session started:", startData);

            if (startData && (startData.success !== false)) {
                setConnected(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error("❌ Error starting streaming session:", error);
            return false;
        }
    };

    const createSession = async () => {
        try {
            setLoading(true);
            setAvatarInitializing(true);
            setSessionFullyReady(false);

            // Step 1: Get session token
            const newSessionToken = await getSessionToken();
            setSessionToken(newSessionToken);

            console.log("🎭 Creating streaming session (using default avatar voice)...");

            // Step 2: Create new streaming session WITHOUT specifying voice
            const response = await fetch(`${API_CONFIG.serverUrl}/v1/streaming.new`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${newSessionToken}`,
                },
                body: JSON.stringify({
                    quality: "high",
                    avatar_id: "705bd4081d524ad8bf40a8aa24ccf601",
                    version: "v2",
                    video_encoding: "H264",
                }),
            });

            console.log("📡 Create session response status:", response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("❌ Error response:", errorText);
                throw new Error(`Create session failed: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log("📦 Session created successfully");

            if (data.error) {
                throw new Error(`Session creation error: ${JSON.stringify(data.error)}`);
            }

            if (data.data) {
                const newSessionId = data.data.session_id;
                setSessionId(newSessionId);
                setWsUrl(data.data.url);
                setToken(data.data.access_token);

                console.log("🔗 Session details:", {
                    sessionId: newSessionId,
                    hasWsUrl: !!data.data.url,
                    hasAccessToken: !!data.data.access_token
                });

                // Step 3: Setup WebSocket for real-time communication with German STT
                const params = new URLSearchParams({
                    session_id: newSessionId,
                    session_token: newSessionToken,
                    silence_response: "false",
                    stt_language: "de", // German Speech-to-Text
                });

                const wsUrl = `wss://${new URL(API_CONFIG.serverUrl).hostname}/v1/ws/streaming.chat?${params}`;
                console.log("🔌 Connecting WebSocket...");

                const ws = new WebSocket(wsUrl);

                ws.onopen = () => {
                    console.log("✅ WebSocket connected");
                };

                ws.onmessage = (event) => {
                    try {
                        const message = JSON.parse(event.data);
                        console.log("📨 WebSocket message:", message);

                        // Handle different message types
                        if (message.type === 'avatar_start_talking') {
                            setSpeaking(true);
                            console.log("🗣️ Avatar started talking");
                        } else if (message.type === 'avatar_stop_talking') {
                            setSpeaking(false);
                            console.log("🤐 Avatar stopped talking");
                        } else if (message.type === 'user_message') {
                            console.log("🎤 User said (German):", message.text);
                            // Here you could send the user's German speech to process
                        } else if (message.type === 'user_start_talking') {
                            console.log("🎤 User started talking");
                        } else if (message.type === 'user_stop_talking') {
                            console.log("🎤 User stopped talking");
                        }
                    } catch (error) {
                        console.error("❌ Error parsing WebSocket message:", error);
                    }
                };

                ws.onerror = (error) => {
                    console.error("❌ WebSocket error:", error);
                };

                ws.onclose = (event) => {
                    console.log("🔌 WebSocket closed:", event.code, event.reason);
                };

                setWebSocket(ws);

                // Step 4: Start the streaming session
                const sessionStarted = await startStreamingSession(newSessionId, newSessionToken);
                if (sessionStarted) {
                    setAvatarInitializing(false);
                    console.log("✅ Avatar session ready for conversation");
                    
                    // Wait a bit longer before marking as fully ready
                    // This ensures the session is completely initialized
                    setTimeout(() => {
                        setSessionFullyReady(true);
                        console.log("✅ Session is fully ready for interaction");
                    }, 2000); // 2 second delay
                } else {
                    throw new Error("Failed to start streaming session");
                }
            } else {
                throw new Error("No session data in response");
            }
        } catch (error) {
            console.error("❌ Error creating session:", error);
            Alert.alert(
                'Fehler',
                `Avatar-Initialisierung fehlgeschlagen: ${error.message}\n\nBitte versuchen Sie es erneut.`
            );
            setAvatarInitializing(false);
        } finally {
            setLoading(false);
        }
    };

    const sendTextToAvatar = async (text, retryCount = 0) => {
        if (!sessionId || !sessionToken) {
            console.error('❌ No active session');
            return false;
        }

        // Don't send if session is not fully ready
        if (!sessionFullyReady && retryCount === 0) {
            console.log('⏳ Session not fully ready yet, waiting...');
            // Wait and retry
            setTimeout(() => sendTextToAvatar(text, retryCount + 1), 2000);
            return false;
        }

        try {
            console.log("💬 Sending German text to avatar:", text);
            setSpeaking(true);

            const response = await fetch(
                `${API_CONFIG.serverUrl}/v1/streaming.task`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionToken}`,
                    },
                    body: JSON.stringify({
                        session_id: sessionId,
                        text: text,
                        task_type: "talk",
                    }),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                
                // If unauthorized and first retry, wait and try again
                if (response.status === 401 && retryCount < 3) {
                    console.log(`⚠️ Got 401, retrying in 2 seconds (attempt ${retryCount + 1}/3)...`);
                    setSpeaking(false);
                    setTimeout(() => sendTextToAvatar(text, retryCount + 1), 2000);
                    return false;
                }
                
                throw new Error(`Send text failed: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log("✅ Avatar task response:", data);
            
            // Use the actual duration from the API response
            if (data.data?.duration_ms) {
                setTimeout(() => setSpeaking(false), data.data.duration_ms);
            } else {
                // Fallback: estimate duration
                const estimatedDuration = Math.max(2000, text.length * 100);
                setTimeout(() => setSpeaking(false), estimatedDuration);
            }
            
            return true;
        } catch (error) {
            console.error("❌ Error sending text to avatar:", error);
            setSpeaking(false);
            return false;
        }
    };

    const closeSession = async () => {
        try {
            setLoading(true);

            if (!sessionId || !sessionToken) {
                console.log("ℹ️ No active session to close");
                return;
            }

            console.log("🔒 Closing session...");

            const response = await fetch(
                `${API_CONFIG.serverUrl}/v1/streaming.stop`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionToken}`,
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
            setSessionFullyReady(false);
            introSentRef.current = false;

            console.log("✅ Session closed successfully");
        } catch (error) {
            console.error("❌ Error closing session:", error);
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

    // Send German introduction when avatar and session are fully ready
    useEffect(() => {
        if (avatarReady && connected && sessionFullyReady && !introSentRef.current) {
            introSentRef.current = true; // Prevent multiple sends
            console.log("🎬 Sending introduction message...");
            
            const introTextGerman = "Hallo! Ich bin Sofia und helfe dir bei deiner psychologischen Vorbereitung. Bitte teile deine Gedanken mit mir, wenn du bereit bist. Du kannst auf Deutsch mit mir sprechen.";
            sendTextToAvatar(introTextGerman);
        }
    }, [avatarReady, connected, sessionFullyReady]);

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
            // Send German confirmation response to avatar
            const userResponseGerman = "Danke für die Frage. Ich habe darüber nachgedacht und fühle mich bereit fortzufahren.";
            await sendTextToAvatar(userResponseGerman);
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
        console.log("✅ Avatar is ready for interaction");
        setAvatarReady(true);
    };

    const handleAvatarError = (error) => {
        console.error('❌ Avatar error:', error);
        setAvatarInitializing(false);
        Alert.alert('Avatar-Fehler', 'Es gab ein Problem mit dem Avatar. Bitte versuchen Sie es erneut.');
    };

    // German test commands
    const handleTestGermanCommand = () => {
        const testCommands = [
            "Bitte stelle mir eine Frage über Beziehungen.",
            "Erzähle mir etwas über Kommunikation in Partnerschaften.",
            "Wie kann ich meine emotionale Intelligenz verbessern?",
            "Was sind die häufigsten Beziehungsfallen?",
            "Kannst du mir helfen, meine Gefühle besser zu verstehen?",
            "Guten Tag! Wie geht es dir heute?",
            "Vielen Dank für deine Hilfe.",
        ];

        const randomCommand = testCommands[Math.floor(Math.random() * testCommands.length)];
        sendTextToAvatar(randomCommand);
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
                                    Vorbereitung
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
                                            ? "Vorbereitung Ihrer Sitzung..."
                                            : !sessionFullyReady
                                                ? "Initialisierung läuft..."
                                                : speaking
                                                    ? "Sofia spricht..."
                                                    : "Nimm dir Zeit, über jede Frage nachzudenken. Du kannst auf Deutsch antworten."
                                        }
                                    </Text>

                                    {/* Debug info */}
                                    {__DEV__ && (
                                        <Text className="text-gray-400 text-xs mt-2">
                                            Session: {sessionId ? 'Connected' : 'Disconnected'}
                                            {sessionId && ` | Ready: ${sessionFullyReady ? 'Yes' : 'No'}`}
                                        </Text>
                                    )}
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
                                                <Text className="text-white font-PoppinsMedium">Sie</Text>
                                                <Text className="text-gray-300 text-xs">Aufnahme</Text>
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

                        {/* Test button for German commands (DEV only) */}
                        {__DEV__ && avatarReady && sessionFullyReady && !isRecording && !recordingComplete && (
                            <TouchableOpacity
                                onPress={handleTestGermanCommand}
                                className="bg-blue-600 rounded-full px-4 py-2 mb-3"
                                activeOpacity={0.8}
                            >
                                <Text className="text-white text-center font-PoppinsMedium">
                                    Deutsches Testkommando
                                </Text>
                            </TouchableOpacity>
                        )}

                        {/* Conditional Button Rendering */}
                        {recordingComplete ? (
                            <View className="flex-row justify-center items-center gap-3 mb-5">
                                <Button
                                    title="x Verwerfen"
                                    onPress={handleDiscard}
                                    variant="outlined"
                                />

                                <Button
                                    title='Antwort speichern'
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
                                    disabled={avatarInitializing || !sessionFullyReady}
                                >
                                    <Mic size={20} color={isRecording ? "#FFFFFF" : "#000000"} />
                                    <Text className={`text-base font-PoppinsMedium ${isRecording ? 'text-white' : 'text-black'
                                        }`}>
                                        {isRecording ? 'Aufnahme stoppen' : 'Per Sprache antworten'}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="w-11 h-11 rounded-full justify-center items-center"
                                    style={{ backgroundColor: '#99225E' }}
                                    activeOpacity={0.8}
                                    onPress={() => navigation.navigate('PsychologicalChat')}
                                    disabled={avatarInitializing || !sessionFullyReady}
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