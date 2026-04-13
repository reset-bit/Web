import { CloseCircleTwoTone, setTwoToneColor } from '@ant-design/icons';
import type { UseQueryResult } from '@tanstack/react-query';
import { Result, Spin } from 'antd';
import { useEffect, useMemo } from 'react';
import { isEmpty } from '@/utils';

export type Options = {
  onLoading?: () => void;
  LoadingElement?: React.ComponentType;
  onError?: () => void;
  ErrorElement?: React.ComponentType;
  EmptyElement?: React.ComponentType;
};

type QueryStatusProps<TData, TError> = {
  result: UseQueryResult<TData, TError>;
  render?: (arg0: TData) => React.ReactNode;
  options?: Options;
};

type QueryStatusResult<TData> = {
  RenderResult: () => React.ReactNode;
  data: TData | undefined;
  isLoading: boolean;
  isError: boolean;
};

setTwoToneColor('#c5945b');

/**
 * 对使用请求数据的组件进行统一的loading/error/empty状态处理
 */
export const useQueryStatus = <TData, TError>(
  props: QueryStatusProps<TData, TError>
): QueryStatusResult<TData> => {
  const { result, render, options } = props;
  const { isLoading, isError, data } = result;
  const { LoadingElement, ErrorElement, EmptyElement, onLoading, onError } = options || {};

  // 执行状态副作用
  useEffect(() => {
    if (isLoading && onLoading) {
      onLoading();
    }
    if (isError && onError) {
      onError();
    }
  }, [isError, isLoading, onError, onLoading]);

  // #region 状态渲染组件
  const LoadingCompnent = useMemo(() => {
    const DefaultLoadingElement = () => (
      <div className="global-loading">
        <Spin />
      </div>
    );
    return LoadingElement || DefaultLoadingElement;
  }, [LoadingElement]);

  const ErrorCompnent = useMemo(() => {
    const DefaultErrorElement = () => (
      <Result
        status="warning"
        icon={<CloseCircleTwoTone style={{ width: '20px' }} />}
        style={{ padding: 0 }}
      />
    );
    return ErrorElement || DefaultErrorElement;
  }, [ErrorElement]);

  const EmptyCompnent = useMemo(() => {
    const DefaultEmptyElement = () => <></>;
    return EmptyElement || DefaultEmptyElement;
  }, [EmptyElement]);
  // #endregion

  return {
    RenderResult: (): React.ReactNode => {
      if (isLoading) {
        return <LoadingCompnent />;
      }
      if (isError) {
        return <ErrorCompnent />;
      }
      if (isEmpty(data)) {
        return <EmptyCompnent />;
      }
      return typeof render === 'function' ? render(data!) : <></>;
    },
    data,
    isLoading,
    isError,
  };
};
