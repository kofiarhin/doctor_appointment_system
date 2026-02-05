import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../services/api';

export const useProfile = () => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: usersApi.updateProfile,
    onSuccess: (response) => {
      queryClient.setQueryData(['auth', 'me'], response);
    }
  });

  return {
    updateProfile: updateMutation.mutateAsync,
    status: updateMutation.status
  };
};
