import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // 에러 리포팅 서비스에 전송 (개발 시 생략)
    // errorReportingService.captureException(error, { extra: errorInfo });
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: undefined });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary">
          <div className="error-content">
            <h2>오류가 발생했습니다</h2>
            <details>
              <summary>오류 세부사항</summary>
              <pre>{this.state.error?.stack}</pre>
            </details>
            <div className="error-actions">
              <button onClick={this.handleRetry} className="retry-button">
                다시 시도
              </button>
              <button
                onClick={() => window.location.reload()}
                className="reload-button"
              >
                페이지 새로고침
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
