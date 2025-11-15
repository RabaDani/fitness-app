import { Component, ComponentChildren } from 'preact';
import { AlertTriangle, RefreshCw } from 'lucide-preact';

interface ErrorBoundaryProps {
  children: ComponentChildren;
  fallback?: (error: Error, reset: () => void) => ComponentChildren;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 * Logs the errors and displays a fallback UI instead of crashing the whole app
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  /**
   * Update state when an error is caught
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  /**
   * Log error details when an error is caught
   */
  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  /**
   * Reset error boundary state and try rendering children again
   */
  resetError = () => {
    this.setState({
      hasError: false,
      error: null
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // If custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }

      // Default error UI
      return (
        <div class="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 dark:from-red-950 dark:to-orange-950 flex items-center justify-center p-4">
          <div class="card max-w-md w-full">
            <div class="flex justify-center mb-4">
              <AlertTriangle size={64} class="text-red-500 dark:text-red-400" />
            </div>

            <h1 class="heading-2 text-center mb-2">
              Hoppá! Valami hiba történt
            </h1>

            <p class="text-secondary text-center mb-6">
              Ne aggódj, az adataid biztonságban vannak. Próbáld meg újra tölteni az oldalt.
            </p>

            <div class="alert-error mb-6">
              <p class="text-sm font-mono break-words">
                {this.state.error.message}
              </p>
            </div>

            <div class="flex space-x-3">
              <button
                onClick={this.resetError}
                class="btn-primary flex-1 flex items-center justify-center space-x-2 py-3"
              >
                <RefreshCw size={20} />
                <span>Próbáld újra</span>
              </button>

              <button
                onClick={() => window.location.reload()}
                class="btn-secondary flex-1 py-3"
              >
                Oldal újratöltése
              </button>
            </div>

            {import.meta.env.DEV && this.state.error.stack && (
              <details class="mt-6">
                <summary class="cursor-pointer text-sm text-secondary hover:text-primary">
                  Részletes hiba információ (fejlesztői)
                </summary>
                <pre class="mt-2 text-xs bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-x-auto text-primary">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
