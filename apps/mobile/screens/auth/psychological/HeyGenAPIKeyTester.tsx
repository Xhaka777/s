import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Alert,
    ScrollView,
    SafeAreaView,
    Clipboard,
} from 'react-native';

// HeyGen API Key Tester
const HeyGenAPIKeyTester = () => {
    const [apiKey, setApiKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [logs, setLogs] = useState([]);
    const [testResults, setTestResults] = useState({
        keyFormat: null,
        authTest: null,
        accountInfo: null,
    });

    const addLog = (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = {
            time: timestamp,
            message,
            type,
        };
        setLogs(prev => [...prev, logEntry]);
        console.log(`${timestamp}: ${message}`);
    };

    const clearLogs = () => {
        setLogs([]);
        setTestResults({
            keyFormat: null,
            authTest: null,
            accountInfo: null,
        });
    };

    // Test 1: Check API key format
    const testAPIKeyFormat = () => {
        addLog("Testing API key format...", 'info');
        
        if (!apiKey) {
            addLog("❌ No API key provided", 'error');
            setTestResults(prev => ({ ...prev, keyFormat: false }));
            return false;
        }

        if (apiKey.length < 20) {
            addLog("❌ API key seems too short", 'error');
            setTestResults(prev => ({ ...prev, keyFormat: false }));
            return false;
        }

        if (apiKey.includes('your-api-key') || apiKey.includes('YOUR_API_KEY')) {
            addLog("❌ Using placeholder API key", 'error');
            setTestResults(prev => ({ ...prev, keyFormat: false }));
            return false;
        }

        addLog("✅ API key format looks valid", 'success');
        setTestResults(prev => ({ ...prev, keyFormat: true }));
        return true;
    };

    // Test 2: Test authentication with a simple API call
    const testAuthentication = async () => {
        if (!testAPIKeyFormat()) {
            return;
        }

        try {
            setIsLoading(true);
            addLog("Testing authentication with HeyGen API...", 'info');

            // Try a simple API call to test auth
            const response = await fetch('https://api.heygen.com/v1/streaming.create_token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Key': apiKey.trim(),
                },
            });

            addLog(`Response status: ${response.status}`, 'info');
            addLog(`Response headers: ${JSON.stringify(Object.fromEntries(response.headers))}`, 'info');

            if (response.status === 401) {
                addLog("❌ Authentication failed - Invalid API key", 'error');
                addLog("Possible causes:", 'info');
                addLog("1. API key is incorrect or expired", 'info');
                addLog("2. API key doesn't have required permissions", 'info');
                addLog("3. Account is suspended or inactive", 'info');
                setTestResults(prev => ({ ...prev, authTest: false }));
                return;
            }

            if (response.status === 403) {
                addLog("❌ Access forbidden - Check permissions", 'error');
                setTestResults(prev => ({ ...prev, authTest: false }));
                return;
            }

            if (!response.ok) {
                const errorText = await response.text();
                addLog(`❌ HTTP error ${response.status}: ${errorText}`, 'error');
                setTestResults(prev => ({ ...prev, authTest: false }));
                return;
            }

            const data = await response.json();
            addLog(`✅ Authentication successful!`, 'success');
            addLog(`Response data: ${JSON.stringify(data, null, 2)}`, 'info');
            setTestResults(prev => ({ ...prev, authTest: true }));

        } catch (error) {
            addLog(`❌ Network error: ${error.message}`, 'error');
            setTestResults(prev => ({ ...prev, authTest: false }));
        } finally {
            setIsLoading(false);
        }
    };

    // Test 3: Get account information
    const testAccountInfo = async () => {
        if (!apiKey) {
            addLog("❌ No API key provided", 'error');
            return;
        }

        try {
            setIsLoading(true);
            addLog("Getting account information...", 'info');

            // Try to get account info (if available)
            const response = await fetch('https://api.heygen.com/v1/user/remaining_quota', {
                method: 'GET',
                headers: {
                    'X-Api-Key': apiKey.trim(),
                },
            });

            if (response.ok) {
                const data = await response.json();
                addLog(`✅ Account info retrieved:`, 'success');
                addLog(`Quota data: ${JSON.stringify(data, null, 2)}`, 'info');
                setTestResults(prev => ({ ...prev, accountInfo: true }));
            } else {
                addLog(`Account info endpoint returned ${response.status}`, 'info');
                setTestResults(prev => ({ ...prev, accountInfo: null }));
            }

        } catch (error) {
            addLog(`Account info request failed: ${error.message}`, 'info');
            setTestResults(prev => ({ ...prev, accountInfo: null }));
        } finally {
            setIsLoading(false);
        }
    };

    const runAllTests = async () => {
        clearLogs();
        addLog("🚀 Starting comprehensive API key test...", 'info');
        
        if (testAPIKeyFormat()) {
            await testAuthentication();
            await testAccountInfo();
        }
        
        addLog("✅ Test completed!", 'success');
    };

    const copyConfigToClipboard = () => {
        if (!apiKey) {
            Alert.alert('Error', 'Please enter an API key first');
            return;
        }

        const config = `
// HeyGen Configuration
const API_CONFIG = {
    apiKey: "${apiKey}",
    serverUrl: "https://api.heygen.com",
};

// In your .env file:
HEYGEN_API_KEY=${apiKey}
        `;

        Clipboard.setString(config);
        Alert.alert('Success', 'Configuration copied to clipboard!');
    };

    const getLogColor = (type) => {
        switch (type) {
            case 'error': return '#FF6B6B';
            case 'success': return '#51CF66';
            case 'info': return '#74C0FC';
            default: return '#CCC';
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <Text style={styles.title}>HeyGen API Key Tester</Text>
                
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Enter your HeyGen API Key:</Text>
                    <TextInput
                        style={styles.input}
                        value={apiKey}
                        onChangeText={setApiKey}
                        placeholder="Paste your API key here..."
                        placeholderTextColor="#666"
                        multiline={false}
                        secureTextEntry={false}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.buttonPrimary]}
                        onPress={runAllTests}
                        disabled={isLoading || !apiKey}
                    >
                        <Text style={styles.buttonText}>
                            {isLoading ? '🔄 Testing...' : '🧪 Run All Tests'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.buttonSecondary]}
                        onPress={testAuthentication}
                        disabled={isLoading || !apiKey}
                    >
                        <Text style={styles.buttonText}>Test Auth Only</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.buttonInfo]}
                        onPress={copyConfigToClipboard}
                        disabled={!apiKey}
                    >
                        <Text style={styles.buttonText}>Copy Config</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.buttonWarning]}
                        onPress={clearLogs}
                    >
                        <Text style={styles.buttonText}>Clear Logs</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.resultsContainer}>
                    <Text style={styles.resultsTitle}>Test Results:</Text>
                    
                    <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>API Key Format:</Text>
                        <Text style={[styles.resultValue, { 
                            color: testResults.keyFormat === true ? '#51CF66' : 
                                   testResults.keyFormat === false ? '#FF6B6B' : '#CCC' 
                        }]}>
                            {testResults.keyFormat === true ? '✅ Valid' : 
                             testResults.keyFormat === false ? '❌ Invalid' : '⏳ Not tested'}
                        </Text>
                    </View>

                    <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>Authentication:</Text>
                        <Text style={[styles.resultValue, { 
                            color: testResults.authTest === true ? '#51CF66' : 
                                   testResults.authTest === false ? '#FF6B6B' : '#CCC' 
                        }]}>
                            {testResults.authTest === true ? '✅ Success' : 
                             testResults.authTest === false ? '❌ Failed' : '⏳ Not tested'}
                        </Text>
                    </View>

                    <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>Account Info:</Text>
                        <Text style={[styles.resultValue, { 
                            color: testResults.accountInfo === true ? '#51CF66' : 
                                   testResults.accountInfo === false ? '#FF6B6B' : '#CCC' 
                        }]}>
                            {testResults.accountInfo === true ? '✅ Available' : 
                             testResults.accountInfo === false ? '❌ Failed' : '⏳ Not tested'}
                        </Text>
                    </View>
                </View>

                <View style={styles.helpContainer}>
                    <Text style={styles.helpTitle}>Where to find your API key:</Text>
                    <Text style={styles.helpText}>1. Go to HeyGen Dashboard</Text>
                    <Text style={styles.helpText}>2. Navigate to API section</Text>
                    <Text style={styles.helpText}>3. Create or copy your API key</Text>
                    <Text style={styles.helpText}>4. Make sure streaming is enabled</Text>
                </View>

                <View style={styles.logContainer}>
                    <Text style={styles.logTitle}>Logs:</Text>
                    {logs.map((log, index) => (
                        <View key={index} style={styles.logEntry}>
                            <Text style={[styles.logTime, { color: getLogColor(log.type) }]}>
                                {log.time}
                            </Text>
                            <Text style={[styles.logMessage, { color: getLogColor(log.type) }]}>
                                {log.message}
                            </Text>
                        </View>
                    ))}
                    {logs.length === 0 && (
                        <Text style={styles.logEmpty}>No logs yet. Run a test to see results.</Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    scrollView: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 30,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 10,
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#111',
        borderColor: '#333',
        borderWidth: 1,
        borderRadius: 10,
        padding: 15,
        color: '#fff',
        fontSize: 14,
        fontFamily: 'monospace',
    },
    buttonContainer: {
        marginBottom: 20,
    },
    button: {
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    buttonPrimary: {
        backgroundColor: '#007AFF',
    },
    buttonSecondary: {
        backgroundColor: '#34C759',
    },
    buttonInfo: {
        backgroundColor: '#FF9500',
    },
    buttonWarning: {
        backgroundColor: '#FF3B30',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '600',
    },
    resultsContainer: {
        backgroundColor: '#111',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    resultsTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    resultRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    resultLabel: {
        color: '#ccc',
        fontSize: 14,
    },
    resultValue: {
        fontSize: 14,
        fontWeight: '600',
    },
    helpContainer: {
        backgroundColor: '#111',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    helpTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    helpText: {
        color: '#ccc',
        fontSize: 14,
        marginBottom: 5,
    },
    logContainer: {
        backgroundColor: '#111',
        padding: 15,
        borderRadius: 10,
        minHeight: 200,
    },
    logTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    logEntry: {
        marginBottom: 5,
    },
    logTime: {
        fontSize: 11,
        fontFamily: 'monospace',
        opacity: 0.7,
    },
    logMessage: {
        fontSize: 13,
        fontFamily: 'monospace',
        marginLeft: 10,
    },
    logEmpty: {
        color: '#666',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 50,
    },
});

export default HeyGenAPIKeyTester;