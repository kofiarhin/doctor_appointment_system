import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { appointmentsApi } from '../services/api';

export const useAppointments = () => {
  const queryClient = useQueryClient();

  const appointmentsQuery = useQuery({
    queryKey: ['appointments'],
    queryFn: appointmentsApi.list
  });

  const createMutation = useMutation({
    mutationFn: appointmentsApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appointments'] })
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => appointmentsApi.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appointments'] })
  });

  const cancelMutation = useMutation({
    mutationFn: appointmentsApi.cancel,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appointments'] })
  });

  return {
    ...appointmentsQuery,
    createAppointment: createMutation.mutateAsync,
    updateAppointment: updateMutation.mutateAsync,
    cancelAppointment: cancelMutation.mutateAsync
  };
};
