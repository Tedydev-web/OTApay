'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from 'services/auth.service';
import Default from 'components/auth/variants/DefaultAuthLayout';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError('');
    setLoading(true);

    try {
      // Sử dụng lại API create user để gửi OTP
      const response = await authService.sendResetPasswordOTP(email);
      
      if (response.result) {
        setSuccess(true);
        // Chuyển đến trang verify code sau 1.5s
        setTimeout(() => {
          const encodedEmail = encodeURIComponent(email);
          router.push(`/auth/verify-code?email=${encodedEmail}&mode=reset-password`);
        }, 1500);
      }
    } catch (err: any) {
      setError(err?.message || 'Không thể gửi mã xác thực');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Default
      maincard={
        <div className="flex h-full min-h-screen w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:justify-start">
          <div className="w-full max-w-[420px] rounded-[20px] bg-white/10 p-8 shadow-xl backdrop-blur-md dark:bg-navy-800/90">
            <h3 className="mb-2 text-center text-2xl font-semibold text-brand-500 dark:text-white">
              Quên mật khẩu
            </h3>
            <p className="mb-8 text-center text-sm text-gray-600 dark:text-gray-400">
              Nhập email của bạn để nhận mã xác thực
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="mb-3 text-center text-sm text-red-500">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-3 text-center text-sm text-green-500">
                  Mã xác thực đã được gửi đến email của bạn
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white/50 p-3 text-sm outline-none focus:border-brand-500 dark:border-navy-600 dark:bg-navy-700/50"
                  placeholder="Nhập email của bạn"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="mt-4 w-full rounded-xl bg-brand-500 py-3 text-base font-medium text-white transition-all hover:bg-brand-600 active:bg-brand-700 disabled:opacity-70"
              >
                {loading ? 'Đang xử lý...' : 'Gửi mã xác thực'}
              </button>

              <button
                type="button"
                onClick={() => router.push('/auth/sign-in')}
                className="mt-2 text-sm text-brand-500 hover:text-brand-600"
              >
                Quay lại đăng nhập
              </button>
            </form>
          </div>
        </div>
      }
    />
  );
} 