'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Default from 'components/auth/variants/DefaultAuthLayout';
import { authService } from 'services/auth.service';

function VerifyCode() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const mode = searchParams.get('mode');
  const [verifyCode, setVerifyCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^[a-zA-Z0-9]*$/.test(value)) return;

    const newVerifyCode = [...verifyCode];
    newVerifyCode[index] = value;
    setVerifyCode(newVerifyCode);

    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }

    if (value && index === 5) {
      const code = newVerifyCode.join('');
      if (code.length === 6) {
        handleSubmit();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    if (!/^[a-zA-Z0-9]{6}$/.test(pastedData)) {
      setError('Mã không hợp lệ. Vui lòng nhập 6 ký tự bao gồm chữ và số');
      return;
    }

    const chars = pastedData.split('');
    setVerifyCode(chars);
    inputRefs[5].current?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !verifyCode[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault();

    if (!email) {
      setError('Vui lòng nhập email');
      return;
    }

    const code = verifyCode.join('');
    if (code.length !== 6) {
      setError('Vui lòng nhập đủ mã xác thực');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await authService.verifyCode(email, code);
      if (response.result) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const encodedEmail = encodeURIComponent(email);
        if (mode === 'reset-password') {
          router.push(`/auth/create-password?email=${encodedEmail}&mode=reset`);
        } else {
          router.push(`/auth/create-password?email=${encodedEmail}`);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Xác thực thất bại');
      if (err?.message?.includes('hết hạn')) {
        setCountdown(0);
        setCanResend(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    if (!email) {
      setError('Vui lòng nhập email');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const response = await authService.resendVerifyCode(email);
      if (response.result) {
        setVerifyCode(['', '', '', '', '', '']);
        inputRefs[0].current?.focus();
        setError('Đã gửi mã xác thực mới vào email của bạn');
        setCountdown(60);
        setCanResend(false);
      }
    } catch (err: any) {
      setError(err?.message || 'Gửi lại mã thất bại');
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
              {mode === 'reset-password'
                ? 'Xác thực đặt lại mật khẩu'
                : 'Xác thực tài khoản'}
            </h3>
            <p className="mb-8 text-center text-sm text-gray-600 dark:text-gray-400">
              Vui lòng nhập mã xác thực đã được gửi đến email của bạn
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div
                  className={`mb-3 text-center text-sm ${
                    error.includes('hết hạn')
                      ? 'text-yellow-500'
                      : 'text-red-500'
                  }`}
                >
                  {error}
                  {error.includes('hết hạn') && (
                    <button
                      type="button"
                      onClick={handleResendCode}
                      className="ml-2 underline hover:text-yellow-600"
                    >
                      Gửi lại mã
                    </button>
                  )}
                </div>
              )}

              {/* Email Input */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 p-3 text-sm outline-none dark:border-navy-600 dark:bg-navy-700/50"
                  required
                />
              </div>

              {/* Verify Code Inputs */}
              <div className="flex justify-center gap-2">
                {verifyCode.map((digit, index) => (
                  <input
                    key={index}
                    ref={inputRefs[index]}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="h-12 w-12 rounded-xl border border-gray-200 bg-white/50 text-center text-xl font-semibold outline-none focus:border-brand-500 dark:border-navy-600 dark:bg-navy-700/50"
                    required
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading || verifyCode.join('').length !== 6 || !email}
                className="mt-4 w-full rounded-xl bg-brand-500 py-3 text-base font-medium text-white transition-all hover:bg-brand-600 active:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Đang xác thực...' : 'Xác thực'}
              </button>

              <button
                type="button"
                onClick={handleResendCode}
                disabled={!canResend || loading || !email}
                className="mt-2 text-sm text-brand-500 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {canResend
                  ? 'Gửi lại mã xác thực'
                  : `Gửi lại sau ${countdown}s`}
              </button>
            </form>
          </div>
        </div>
      }
    />
  );
}

export default VerifyCode; 