import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from 'services/auth.service';
import { tokenService } from 'services/token.service';

export function useAuth(requireAuth: boolean = true) {
  const router = useRouter();
  const [isTokenChecking, setIsTokenChecking] = useState(true);

  useEffect(() => {
    let inactivityTimeout: NodeJS.Timeout;
    
    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimeout);
      inactivityTimeout = setTimeout(async () => {
        await authService.logout();
        router.push('/auth/sign-in');
      }, 30 * 60 * 1000); // 30 phút
    };

    const checkAuth = async () => {
      try {
        const token = tokenService.getAccessToken();
        if (requireAuth && !token) {
          router.push('/auth/sign-in');
          return;
        }

        if (token && tokenService.isTokenExpired(token)) {
          // Tự động refresh token nếu hết hạn
          await tokenService.refreshAccessToken();
        }

        resetInactivityTimer();
      } catch (error) {
        if (requireAuth) {
          await authService.logout();
          router.push('/auth/sign-in');
        }
      } finally {
        setIsTokenChecking(false);
      }
    };

    const events = ['mousedown', 'keydown', 'mousemove', 'wheel'];
    events.forEach(event => {
      document.addEventListener(event, resetInactivityTimer);
    });

    checkAuth();

    return () => {
      clearTimeout(inactivityTimeout);
      events.forEach(event => {
        document.removeEventListener(event, resetInactivityTimer);
      });
    };
  }, [router, requireAuth]);

  return { isTokenChecking };
}

export const useAuthStatus = () => {
  const [status, setStatus] = useState({
    isLoading: true,
    isAuthenticated: false,
    user: null,
    error: null
  });

  // Thêm loading states
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Thêm thông báo
  const showAuthNotification = (type: 'success' | 'error', message: string) => {
    // Implement notification logic
  };
}; 