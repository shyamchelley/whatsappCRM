import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('accessToken');
const user = JSON.parse(localStorage.getItem('user') || 'null');

const authSlice = createSlice({
  name: 'auth',
  initialState: { token, user, isAuthenticated: !!token },
  reducers: {
    setCredentials(state, { payload }) {
      state.token = payload.accessToken;
      state.user = payload.user;
      state.isAuthenticated = true;
      localStorage.setItem('accessToken', payload.accessToken);
      localStorage.setItem('user', JSON.stringify(payload.user));
    },
    setToken(state, { payload }) {
      state.token = payload;
      localStorage.setItem('accessToken', payload);
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, setToken, logout } = authSlice.actions;
export default authSlice.reducer;
