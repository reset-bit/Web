import { useQuery } from '@tanstack/react-query';
import { getProductList } from '@/api';
import type { ProductListProps } from '@/api';

export const useProductList = (props: ProductListProps) => {
  return useQuery({
    queryKey: ['list', props],
    queryFn: async () => {
      return await getProductList(props);
    },
  });
};
