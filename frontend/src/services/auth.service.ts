import axios from 'axios';
import Cookies from 'js-cookie';
import api from './api';

const API_URL = 'http://localhost:2000/api/v1';

export const authService = {
  async login(email: string, password: string, remember: boolean = false) {
    try {
      // Validate input
      if (!email || !password) {
        throw new Error('Vui lòng điền đầy đủ thông tin');
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Email không hợp lệ');
      }

      const response = await axios.post(`${API_URL}/user/auth/login`, {
        email,
        password
      });

      if (response.data?.accessToken) {
        // Lưu token với httpOnly cookie
        Cookies.set('accessToken', response.data.accessToken, {
          secure: true,
          sameSite: 'strict',
          expires: remember ? 7 : 1,
          path: '/'
        });

        // Lưu user data
        const userData = {
          id: response.data.user.id,
          email: response.data.user.email,
          role: response.data.user.role,
          name: response.data.user.name
        };
        localStorage.setItem('user', JSON.stringify(userData));
        
        if (remember) {
          localStorage.setItem('rememberedEmail', email);
          localStorage.setItem('rememberMe', 'true');
        }

        return response.data;
      }
      throw new Error('Không nhận được token');
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Email hoặc mật khẩu không chính xác');
      }
      throw new Error(error?.response?.data?.message || error.message);
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
  },

  async verifyCode(email: string, verifyCode: string) {
    try {
      if (!email || !verifyCode) {
        throw new Error('Email và mã xác thực là bắt buộc');
      }

      const response = await axios.post(`${API_URL}/user/verify-code`, {
        email,
        verifyCode
      });
      
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 500) {
        if (error.response.data?.message?.includes('expired')) {
          throw new Error('Mã xác thực đã hết hạn. Vui lòng yêu cầu gửi lại mã mới');
        }
      }
      throw new Error(error?.response?.data?.message || error.message || 'Xác thực thất bại');
    }
  },

  async resendVerifyCode(email: string) {
    try {
      if (!email) {
        throw new Error('Email là bắt buộc');
      }

      const response = await axios.post(`${API_URL}/user/resend-verify-code`, {
        email
      });

      if (!response.data) {
        throw new Error('Không nhận được phản hồi từ server');
      }

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 429) {
        throw new Error('Vui lòng đợi trước khi gửi lại mã');
      }
      throw new Error(error?.response?.data?.message || error.message || 'Gửi lại mã thất bại');
    }
  },

  async createPassword(email: string, new_password: string, confirm_password: string) {
    try {
      if (!email || !new_password || !confirm_password) {
        throw new Error('Vui lòng điền đầy đủ thông tin');
      }

      if (new_password.length < 8) {
        throw new Error('Mật khẩu phải có ít nhất 8 ký tự');
      }
      
      if (!/[A-Z]/.test(new_password)) {
        throw new Error('Mật khẩu phải chứa ít nhất 1 chữ hoa');
      }
      
      if (!/[0-9]/.test(new_password)) {
        throw new Error('Mật khẩu phải chứa ít nhất 1 số');
      }

      if (new_password !== confirm_password) {
        throw new Error('Mật khẩu xác nhận không khớp');
      }

      const createPasswordResponse = await axios.put(`${API_URL}/user/create-password`, {
        email,
        new_password,
        confirm_password
      });

      if (createPasswordResponse.data.result) {
        try {
          const loginResponse = await this.login(email, new_password, true);
          return {
            ...createPasswordResponse.data,
            loginData: loginResponse
          };
        } catch (loginError: any) {
          console.error('Auto login failed:', loginError);
          return createPasswordResponse.data;
        }
      }

      return createPasswordResponse.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error.message || 'Tạo mật khẩu thất bại');
    }
  },

  // Thêm middleware kiểm tra token
  setupAxiosInterceptors() {
    axios.interceptors.request.use(
      (config) => {
        const token = Cookies.get('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token hết hạn hoặc không hợp lệ
          await this.logout();
          window.location.href = '/auth/sign-in';
        }
        return Promise.reject(error);
      }
    );
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const response = await axios.post('/api/auth/sign-in', {
      email,
      password,
    });

    if (response.data) {
      // Lưu token vào localStorage hoặc cookie
      localStorage.setItem('token', response.data.token);
      
      // Chuyển hướng người dùng sau khi đăng nhập thành công
      window.location.href = '/admin/default';
      // Hoặc sử dụng router.push nếu bạn đang dùng Next.js
      // router.push('/admin/default');
      
      return response.data;
    }
  } catch (error) {
    throw error;
  }
};