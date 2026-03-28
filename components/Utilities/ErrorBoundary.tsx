"use client";

import React, { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  appName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(
      `[ErrorBoundary] ${this.props.appName ?? "App"} crashed:`,
      error,
      info,
    );
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="h-full bg-gray-900 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-white text-xl font-bold mb-2">
              {this.props.appName ?? "Application"} crashed
            </h2>
            <p className="text-gray-400 text-sm mb-2">
              {this.state.error?.message ?? "An unexpected error occurred."}
            </p>
            <p className="text-gray-600 text-xs mb-6 font-mono">
              {this.state.error?.stack?.split("\n")[1]?.trim()}
            </p>
            <button
              onClick={this.handleReset}
              className="flex items-center space-x-2 mx-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Restart App</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Convenience wrapper with typed appId
export function AppErrorBoundary({
  children,
  appName,
}: {
  children: ReactNode;
  appName: string;
}) {
  return <ErrorBoundary appName={appName}>{children}</ErrorBoundary>;
}
