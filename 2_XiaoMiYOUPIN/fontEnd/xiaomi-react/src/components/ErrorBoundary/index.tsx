import { Button, Result } from 'antd';
import * as React from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.log('🚀 ~ ErrorBoundary ~ getDerivedStateFromError ~ error:', error);
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <></>;
    }
    return this.props.children;
  }
}

export const RouteErrorBoundary = () => {
  const error = useRouteError();
  console.log('🚀 ~ RouteErrorBoundary ~ error:', error);
  const navigator = useNavigate();
  return (
    <Result
      status="500"
      title="500"
      subTitle="Oops, something went wrong. :( "
      extra={
        <Button type="primary" color="gold" onClick={() => navigator('/home')}>
          Back Home
        </Button>
      }
    />
  );
};
