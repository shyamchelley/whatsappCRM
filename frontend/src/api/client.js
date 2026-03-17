import axios from 'axios';
import { store } from '../store';
import { setToken, logout } from '../store/authSlice';

const client = axios.create({ baseURL: '/api', withCredentials: true });

client.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { data } = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        store.dispatch(setToken(data.accessToken));
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return client(original);
      } catch {
        store.dispatch(logout());
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default client;
