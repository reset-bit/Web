import { useMutation } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { App } from 'antd';

export const useMutationWithMessage = (
  props: UseMutationOptions & { optionType?: 'override' | 'inherit' }
) => {
  const { optionType = 'override', onSuccess: successFn, onError: errorFn, ...rest } = props;
  const { message } = App.useApp();

  const onSuccess =
    optionType === 'override'
      ? successFn
      : (data: unknown, variables: void, context: unknown) => {
          if (typeof successFn === 'function') {
            successFn(data, variables, context);
          }
          message.success('操作成功');
        };

  const onError =
    optionType === 'override'
      ? successFn
      : (error: Error, variables: void, context: unknown) => {
          if (typeof errorFn === 'function') {
            errorFn(error, variables, context);
          }
          message.error(error.message ? error.message : '登录失败');
        };

  return useMutation({
    onSuccess,
    onError,
    ...rest,
  });
};
