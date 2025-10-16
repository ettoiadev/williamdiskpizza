/**
 * Error Boundary Component
 * 
 * Componente para capturar erros em árvore de componentes React.
 * Previne que erros quebrem toda a aplicação.
 * 
 * @module components/ErrorBoundary
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Props do ErrorBoundary
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

/**
 * State do ErrorBoundary
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary - Captura erros em componentes React
 * 
 * @example
 * ```typescript
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * Método estático para atualizar state quando erro ocorre
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Lifecycle method chamado após erro ser capturado
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log estruturado do erro
    console.error('[ErrorBoundary] Erro capturado:', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      errorInfo: {
        componentStack: errorInfo.componentStack,
      },
      timestamp: new Date().toISOString(),
    });

    // Atualizar state
    this.setState({ errorInfo });

    // Callback customizado
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // TODO: Enviar para serviço de monitoramento
    // Exemplo: Sentry.captureException(error, { extra: { errorInfo } });
  }

  /**
   * Resetar erro e tentar renderizar novamente
   */
  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  /**
   * Recarregar página
   */
  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Usar fallback customizado se fornecido
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Fallback padrão
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Algo deu errado
            </h2>
            
            <p className="text-gray-600 text-center mb-6">
              Desculpe, ocorreu um erro inesperado. Nossa equipe foi notificada.
            </p>

            {/* Mostrar detalhes do erro apenas em dev */}
            {import.meta.env.DEV && this.state.error && (
              <div className="bg-gray-100 rounded p-4 mb-6 max-h-48 overflow-auto">
                <p className="text-xs font-mono text-red-600 mb-2">
                  <strong>{this.state.error.name}:</strong> {this.state.error.message}
                </p>
                {this.state.error.stack && (
                  <pre className="text-xs font-mono text-gray-700 whitespace-pre-wrap">
                    {this.state.error.stack}
                  </pre>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={this.handleReset}
                variant="outline"
                className="flex-1"
              >
                Tentar Novamente
              </Button>
              <Button
                onClick={this.handleReload}
                className="flex-1"
              >
                Recarregar Página
              </Button>
            </div>

            {/* Link para suporte */}
            <div className="text-center mt-6">
              <a
                href="/"
                className="text-sm text-primary hover:underline"
              >
                Voltar para Início
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook para facilitar uso do ErrorBoundary
 */
export default ErrorBoundary;