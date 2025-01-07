'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import InputField from 'components/fields/InputField';
import Default from 'components/auth/variants/DefaultAuthLayout';
import { FcGoogle } from 'react-icons/fc';
import Checkbox from 'components/checkbox';
import { authService } from 'services/auth.service';
import { useAuth } from 'contexts/AuthContext';

function SignInDefault() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedRememberMe = localStorage.getItem('rememberMe');
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    
    if (savedRememberMe && rememberedEmail) {
      setFormData(prev => ({
        ...prev,
        email: rememberedEmail,
        rememberMe: true
      }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(
        formData.email, 
        formData.password, 
        formData.rememberMe
      );
      
      if (response.result) {
        await new Promise(resolve => setTimeout(resolve, 100));
        
        router.replace('/admin/default');
      }
    } catch (err: any) {
      setError(err?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Default
      maincard={
        <div className="flex h-full min-h-screen w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:justify-start">
          <div className="w-full max-w-[420px] rounded-[20px] bg-white/10 backdrop-blur-md p-8 shadow-xl dark:bg-navy-800/90">
            <h3 className="mb-2 text-2xl font-semibold text-brand-500 dark:text-white text-center">
              Chào mừng trở lại
            </h3>
            <p className="mb-8 text-sm text-gray-600 dark:text-gray-400 text-center">
              Vui lòng đăng nhập để tiếp tục
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="mb-3 text-sm text-red-500">{error}</div>
              )}
              
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-white/50 p-3 text-sm outline-none focus:border-brand-500 dark:border-navy-600 dark:bg-navy-700/50"
                    placeholder="admin@mediacityco.in"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">Mật khẩu</label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-white/50 p-3 text-sm outline-none focus:border-brand-500 dark:border-navy-600 dark:bg-navy-700/50"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                  />
                  Ghi nhớ tôi
                </label>
                <a href="#" className="text-sm text-brand-500 hover:text-brand-600">
                  Quên mật khẩu?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full rounded-xl bg-brand-500 py-3 text-base font-medium text-white transition-all hover:bg-brand-600 active:bg-brand-700 disabled:opacity-70"
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>

              {/* <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-navy-600"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-sm text-gray-500 dark:bg-navy-800 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white/50 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-navy-600 dark:bg-navy-700/50 dark:text-gray-400"
                >
                  <FcGoogle className="h-5 w-5" />
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white/50 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-navy-600 dark:bg-navy-700/50 dark:text-gray-400"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V21.88C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                  Apple
                </button>
              </div>

              <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <a href="#" className="text-brand-500 hover:text-brand-600">
                  Sign up
                </a>
              </p> */}
            </form>
          </div>
        </div>
      }
    />
  );
}

export default SignInDefault;
