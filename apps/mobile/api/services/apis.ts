export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = 'http://192.168.1.8:3000') {
    this.baseURL = baseURL;
  }

  async request<T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      data?: any;
      headers?: Record<string, string>;
    } = {}
  ): Promise<T> {
    const { method = 'GET', data, headers = {} } = options;
    const url = `${this.baseURL}${endpoint}`;

    console.log(`🌐 API Request: ${method} ${url}`);
    if (data) console.log('📤 Request data:', data);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        ...(data && { body: JSON.stringify(data) }),
      });

      const responseData = await response.json();
      console.log(`📥 API Response: ${response.status}`, responseData);

      if (!response.ok) {
        throw new Error(responseData?.error || 'Request failed');
      }

      return responseData;
    } catch (error) {
      console.error('❌ API Error:', error);
      throw error;
    }
  }

  // Convenience methods
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', data });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', data });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Global instance
export const apiClient = new ApiClient();

// API Routes
export const ApiRoutes = {
  ONBOARDING_STAGE_ONE: '/api/users/onboardingStageOne',
};