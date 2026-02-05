import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../services/api';

export const useAuth = () => {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.me,
    retry: false
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      queryClient.setQueryData(['auth', 'me'], response);
    }
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (response) => {
      queryClient.setQueryData(['auth', 'me'], response);
    }
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(['auth', 'me'], null);
    }
  });

  return {
    user: data?.user || null,
    isLoading,
    error,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    loginStatus: loginMutation.status,
    registerStatus: registerMutation.status
  };
};
