'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from 'services/auth.service';
import Default from 'components/auth/variants/DefaultAuthLayout';

export default function CreatePassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const mode = searchParams.get('mode');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError('');
    setIsSubmitting(true);

    try {
      const response = await authService.createPassword(
        decodeURIComponent(email),
        formData.password,
        formData.confirmPassword,
      );

      if (response.result) {
        if (mode === 'reset') {
          router.push('/auth/sign-in');
        } else if (response.loginData) {
          router.push('/admin/default');
        } else {
          router.push('/auth/sign-in');
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Tạo mật khẩu thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Default
      maincard={
        <div className="flex h-full min-h-screen w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:justify-start">
          <div className="w-full max-w-[420px] rounded-[20px] bg-white/10 p-8 shadow-xl backdrop-blur-md dark:bg-navy-800/90">
            <h3 className="mb-2 text-center text-2xl font-semibold text-brand-500 dark:text-white">
              {mode === 'reset' ? 'Đặt lại mật khẩu' : 'Tạo mật khẩu mới'}
            </h3>
            <p className="mb-8 text-center text-sm text-gray-600 dark:text-gray-400">
              {mode === 'reset' 
                ? 'Vui lòng nhập mật khẩu mới cho tài khoản của bạn'
                : 'Vui lòng tạo mật khẩu mới cho tài khoản của bạn'
              }
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="mb-3 text-center text-sm text-red-500">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white/50 p-3 text-sm outline-none focus:border-brand-500 dark:border-navy-600 dark:bg-navy-700/50"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white/50 p-3 text-sm outline-none focus:border-brand-500 dark:border-navy-600 dark:bg-navy-700/50"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 w-full rounded-xl bg-brand-500 py-3 text-base font-medium text-white transition-all hover:bg-brand-600 active:bg-brand-700 disabled:opacity-70"
              >
                {isSubmitting ? 'Đang xử lý...' : 'Xác nhận'}
              </button>
            </form>
          </div>
        </div>
      }
    />
  );
}
