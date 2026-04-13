import { useCallback, useState } from 'react';

interface UseCountProps {
  defaultCount?: number;
  max?: number;
  min?: number;
  onDecrease?: () => void;
  onIncrease?: () => void;
}

type UseCountReturn = [count: number, increase: () => void, decrease: () => void];

export const useCount = (props: UseCountProps): UseCountReturn => {
  const { defaultCount = 1, min = 0, max = Infinity, onDecrease, onIncrease } = props;

  const [count, setCount] = useState(defaultCount);

  const decrease = useCallback(() => {
    if (count <= min) return;
    setCount(count - 1);
    if (typeof onDecrease === 'function') {
      onDecrease();
    }
  }, [count, min, onDecrease]);

  const increase = useCallback(() => {
    if (count >= max) return;
    setCount(count + 1);
    if (typeof onIncrease === 'function') {
      onIncrease();
    }
  }, [count, max, onIncrease]);

  return [count, decrease, increase];
};
