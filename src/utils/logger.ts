/**
 * Logger Utility
 * 
 * Sistema de logs estruturados para debugging e monitoramento.
 * Facilita rastreamento de erros e análise de comportamento.
 * 
 * @module utils/logger
 */

/**
 * Níveis de log
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

/**
 * Metadata do log
 */
interface LogMetadata {
  [key: string]: any;
}

/**
 * Configuração do logger
 */
interface LoggerConfig {
  enabledLevels: LogLevel[];
  enableConsole: boolean;
  enableRemote: boolean;
}

/**
 * Configuração padrão
 */
const defaultConfig: LoggerConfig = {
  enabledLevels: [
    LogLevel.DEBUG,
    LogLevel.INFO,
    LogLevel.WARN,
    LogLevel.ERROR,
  ],
  enableConsole: true,
  enableRemote: false, // Pode integrar com Sentry, LogRocket, etc.
};

/**
 * Classe Logger
 */
class Logger {
  private config: LoggerConfig;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Formatar timestamp
   */
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Verificar se nível está habilitado
   */
  private isLevelEnabled(level: LogLevel): boolean {
    return this.config.enabledLevels.includes(level);
  }

  /**
   * Formatar mensagem de log
   */
  private formatMessage(
    level: LogLevel,
    message: string,
    metadata?: LogMetadata
  ): string {
    const timestamp = this.getTimestamp();
    const meta = metadata ? JSON.stringify(metadata, null, 2) : '';
    return `[${timestamp}] [${level}] ${message}${meta ? '\n' + meta : ''}`;
  }

  /**
   * Enviar log para console
   */
  private logToConsole(
    level: LogLevel,
    message: string,
    metadata?: LogMetadata
  ): void {
    if (!this.config.enableConsole) return;

    const formatted = this.formatMessage(level, message, metadata);

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formatted);
        break;
      case LogLevel.INFO:
        console.info(formatted);
        break;
      case LogLevel.WARN:
        console.warn(formatted);
        break;
      case LogLevel.ERROR:
        console.error(formatted);
        break;
    }
  }

  /**
   * Enviar log para serviço remoto (ex: Sentry)
   */
  private logToRemote(
    level: LogLevel,
    message: string,
    metadata?: LogMetadata
  ): void {
    if (!this.config.enableRemote) return;

    // TODO: Integrar com serviço de monitoramento
    // Exemplo: Sentry.captureMessage(message, { level, extra: metadata });
  }

  /**
   * Método genérico de log
   */
  private log(
    level: LogLevel,
    message: string,
    metadata?: LogMetadata
  ): void {
    if (!this.isLevelEnabled(level)) return;

    this.logToConsole(level, message, metadata);
    this.logToRemote(level, message, metadata);
  }

  /**
   * Log de debug
   * 
   * @example
   * logger.debug('Usuário carregado', { userId: '123', role: 'admin' });
   */
  debug(message: string, metadata?: LogMetadata): void {
    this.log(LogLevel.DEBUG, message, metadata);
  }

  /**
   * Log de informação
   * 
   * @example
   * logger.info('Login realizado com sucesso', { email: 'user@example.com' });
   */
  info(message: string, metadata?: LogMetadata): void {
    this.log(LogLevel.INFO, message, metadata);
  }

  /**
   * Log de aviso
   * 
   * @example
   * logger.warn('Sessão próxima de expirar', { expiresIn: '5min' });
   */
  warn(message: string, metadata?: LogMetadata): void {
    this.log(LogLevel.WARN, message, metadata);
  }

  /**
   * Log de erro
   * 
   * @example
   * logger.error('Falha ao carregar dados', { error, userId: '123' });
   */
  error(message: string, error?: unknown, metadata?: LogMetadata): void {
    const errorData = error instanceof Error
      ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        }
      : { error };

    this.log(LogLevel.ERROR, message, {
      ...metadata,
      error: errorData,
    });
  }

  /**
   * Criar logger com contexto específico
   * 
   * @example
   * const authLogger = logger.context('AuthService');
   * authLogger.info('Login attempt', { email });
   */
  context(context: string): ContextLogger {
    return new ContextLogger(this, context);
  }
}

/**
 * Logger com contexto
 */
class ContextLogger {
  constructor(
    private logger: Logger,
    private context: string
  ) {}

  private addContext(metadata?: LogMetadata): LogMetadata {
    return {
      context: this.context,
      ...metadata,
    };
  }

  debug(message: string, metadata?: LogMetadata): void {
    this.logger.debug(`[${this.context}] ${message}`, this.addContext(metadata));
  }

  info(message: string, metadata?: LogMetadata): void {
    this.logger.info(`[${this.context}] ${message}`, this.addContext(metadata));
  }

  warn(message: string, metadata?: LogMetadata): void {
    this.logger.warn(`[${this.context}] ${message}`, this.addContext(metadata));
  }

  error(message: string, error?: unknown, metadata?: LogMetadata): void {
    this.logger.error(`[${this.context}] ${message}`, error, this.addContext(metadata));
  }
}

// Exportar instância global
export const logger = new Logger({
  enabledLevels: import.meta.env.PROD
    ? [LogLevel.WARN, LogLevel.ERROR]  // Produção: apenas warns e errors
    : [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR],  // Dev: tudo
  enableConsole: true,
  enableRemote: import.meta.env.PROD,  // Remote apenas em produção
});

// Exportar tipos
export type { LogMetadata };