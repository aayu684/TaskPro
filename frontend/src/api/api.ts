// TaskPro API Utility (using Fetch API)

const BASE_URL = 'http://localhost:8000/api/';

/**
 * Custom fetch wrapper to handle JWT tokens and common logic.
 */
async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const access = localStorage.getItem('access_token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...(access ? { 'Authorization': `Bearer ${access}` } : {}),
        ...options.headers,
    };

    const url = `${BASE_URL}${endpoint}`;
    console.log(`[API] ${options.method || 'GET'} ${url}`);

    let response;
    try {
        response = await fetch(url, { ...options, headers });
    } catch (err: any) {
        console.error('[API] Network Error:', err);
        throw new Error('Network error: Unable to reach the server. Please ensure the backend is running.');
    }

    // Handle 401 Unauthorized (Token expired)
    if (response.status === 401) {
        const refresh = localStorage.getItem('refresh_token');
        if (refresh) {
            try {
                const refreshRes = await fetch(`${BASE_URL}auth/token/refresh/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refresh }),
                });

                if (refreshRes.ok) {
                    const data = await refreshRes.json();
                    localStorage.setItem('access_token', data.access);
                    
                    response = await fetch(url, {
                        ...options,
                        headers: {
                            ...headers,
                            'Authorization': `Bearer ${data.access}`,
                        },
                    });
                }
            } catch (err) {
                console.error('[API] Token refresh failed:', err);
            }
        }
    }

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            errorData = { detail: `Error ${response.status}: ${response.statusText}` };
        }
        
        const error: any = new Error(errorData.detail || 'API Request Failed');
        error.response = { data: errorData, status: response.status };
        throw error;
    }

    if (response.status === 204) return null;
    return response.json();
}

export const api = {
    get: (url: string) => apiFetch(url, { method: 'GET' }),
    post: (url: string, body: any) => apiFetch(url, { method: 'POST', body: JSON.stringify(body) }),
    put: (url: string, body: any) => apiFetch(url, { method: 'PUT', body: JSON.stringify(body) }),
    patch: (url: string, body: any) => apiFetch(url, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (url: string) => apiFetch(url, { method: 'DELETE' }),
};
