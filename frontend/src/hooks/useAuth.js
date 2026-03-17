import { useSelector, useDispatch } from 'react-redux';
import { setCredentials, logout as logoutAction } from '../store/authSlice';
import * as authApi from '../api/auth.api';

export default function useAuth() {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated } = useSelector((s) => s.auth);

  async function login(email, password) {
    const { data } = await authApi.login(email, password);
    dispatch(setCredentials(data));
    return data;
  }

  async function logout() {
    await authApi.logout().catch(() => {});
    dispatch(logoutAction());
  }

  return { user, token, isAuthenticated, login, logout };
}
