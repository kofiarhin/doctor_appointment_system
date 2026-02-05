import { useQuery } from '@tanstack/react-query';
import { doctorsApi } from '../services/api';

export const useDoctors = () =>
  useQuery({
    queryKey: ['doctors'],
    queryFn: doctorsApi.list
  });

export const useDoctor = (doctorId) =>
  useQuery({
    queryKey: ['doctors', doctorId],
    queryFn: () => doctorsApi.get(doctorId),
    enabled: Boolean(doctorId)
  });
