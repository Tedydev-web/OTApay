import axios from 'axios';
import Cookies from 'js-cookie';
import api from './api';

const API_URL = 'http://localhost:2000/api/v1';

export const authService = {
  async login(email: string, password: string, rememberMe: boolean = false) {
    try {
      const response = await axios.post(`${API_URL}/user/auth/login`, {
        email,
        password
      });
      
      if (response.data.data.accessToken) {
        // Lưu token vào cookie
        Cookies.set('accessToken', response.data.data.accessToken, {
          expires: 1, // Luôn set là 1 ngày
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
        
        // Lưu thông tin user và trạng thái rememberMe
        const { accessToken, ...userData } = response.data.data;
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Chỉ lưu rememberMe nếu được chọn
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          // Lưu email để tự động điền lần sau
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('rememberedEmail');
        }
      }
      return response.data;
    } catch (error: any) {
      throw error?.response?.data || error;
    }
  },

  async logout() {
    try {
      await api.post(`${API_URL}/user/auth/logout`);
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      Cookies.remove('accessToken');
      localStorage.removeItem('user');
      // Không xóa rememberedEmail để giữ lại cho lần đăng nhập sau
      localStorage.removeItem('rememberMe');
    }
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  getToken() {
    return Cookies.get('accessToken');
  }
}; 