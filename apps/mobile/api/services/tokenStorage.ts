import * as Keychain from 'react-native-keychain';

const SERVICE_NAME = 'SponnedApp';
const SESSION_TOKEN_KEY = 'session_token';

export const tokenStorage = {
    async saveToken(token: string): Promise<void> {
        try {
            await Keychain.setInternetCredentials(
                SERVICE_NAME,
                SESSION_TOKEN_KEY,
                token
            );
            console.log('token saved')
        } catch (error) {
            console.log('error saving token', error)
            throw error;
        }
    },
    async getToken(): Promise<string | null> {
        try {
            const credentials = await Keychain.getInternetCredentials(SERVICE_NAME);
            if (credentials && credentials.password) {
                return credentials.password;
            }
            console.log('No token found');
            return null;
        } catch (error) {
            console.log('error token', error);
            return null;
        }
    },
    async clearToken(): Promise<void> {
        try {
            await Keychain.resetInternetCredentials({ service: SERVICE_NAME });
            console.log('token cleared');
        } catch (error) {
            console.log('error clearing token', error)
        }
    }
}