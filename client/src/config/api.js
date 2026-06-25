const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const fetchApi = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${baseURL}${url}`, {
    ...options,
    headers,
  });

  let data;
  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }

  if (!response.ok) {
    const error = new Error('API Error');
    error.response = { data };
    throw error;
  }

  return { data };
};

const api = {
  get: (url, config) => fetchApi(url, { ...config, method: 'GET' }),
  post: (url, body, config) => fetchApi(url, { ...config, method: 'POST', body: JSON.stringify(body) }),
  patch: (url, body, config) => fetchApi(url, { ...config, method: 'PATCH', body: JSON.stringify(body) }),
  delete: (url, config) => fetchApi(url, { ...config, method: 'DELETE' }),
};

export default api;
