// Simulación de cliente API para desarrollo
// En producción, esto se conectaría a un servidor real

class ApiClient {
    private baseURL: string = '';

    initialize(apiBaseUrl: string) {
        this.baseURL = apiBaseUrl;
    }

    async get(endpoint: string, options?: { params?: Record<string, any> }) {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 300));

        // En desarrollo, retornar datos mock
        // En producción, hacer fetchreal a la API
        if (this.baseURL) {
            return fetch(`${this.baseURL}/api${endpoint}`, {
                headers: {
                    'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
                }
            }).then(res => res.json());
        }

        return { data: {} };
    }

    async post(endpoint: string, data: any) {
        await new Promise(resolve => setTimeout(resolve, 300));
        return { data: {} };
    }

    async put(endpoint: string, data: any) {
        await new Promise(resolve => setTimeout(resolve, 300));
        return { data: {} };
    }

    async delete(endpoint: string) {
        await new Promise(resolve => setTimeout(resolve, 300));
        return { data: {} };
    }
}

const apiClient = new ApiClient();
export default apiClient;
