import { useQuery } from '@tanstack/react-query';
import { getCategory } from '@/api';

export const useCategory = (id: number) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: async () => {
      return await getCategory(id);
    },
  });
};
