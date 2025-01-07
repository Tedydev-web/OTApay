import Cookies from 'js-cookie';
import axios from 'axios';
import { API_URL } from '../config';

export const tokenService = {
  getAccessToken() {
    return Cookies.get('accessToken');
  },

  getRefreshToken() {
    return Cookies.get('refreshToken');
  },

  setTokens(accessToken: string, refreshToken: string, remember: boolean = false) {
    Cookies.set('accessToken', accessToken, {
      secure: true,
      sameSite: 'strict',
      expires: remember ? 7 : 1,
      path: '/'
    });

    Cookies.set('refreshToken', refreshToken, {
      secure: true,
      sameSite: 'strict',
      expires: 30,
      path: '/'
    });
  },

  removeTokens() {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
  },

  async refreshAccessToken() {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(`${API_URL}/token/refresh-token`, {
        refreshToken
      });

      if (response?.data?.accessToken) {
        this.setTokens(
          response.data.accessToken,
          response.data.refreshToken || refreshToken
        );
        return response.data.accessToken;
      }
      throw new Error('Failed to refresh token');
    } catch (error) {
      this.removeTokens();
      throw error;
    }
  },

  isTokenExpired(token: string) {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}; 