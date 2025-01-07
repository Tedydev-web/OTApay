import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from 'services/auth.service';

export function useAuth(requireAuth: boolean = true) {
  const router = useRouter();

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
        const user = authService.getCurrentUser();
        if (requireAuth && !user) {
          router.push('/auth/sign-in');
          return;
        }

        // Kiểm tra token với server
        await authService.validateToken();
        resetInactivityTimer();
      } catch (error) {
        await authService.logout();
        router.push('/auth/sign-in');
      }
    };

    // Event listeners cho user activity
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