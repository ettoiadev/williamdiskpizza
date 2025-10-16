/**
 * Application Constants
 * 
 * Constantes e configurações centralizadas da aplicação.
 * Inclui chaves de seção do CMS, rotas, limites e configurações gerais.
 * 
 * @module config/constants
 */

/**
 * Seções do CMS disponíveis
 */
export const CMS_SECTIONS = {
  HERO: 'hero',
  STATS: 'stats',
  FEATURES: 'features',
  CONTACT: 'contact',
  ABOUT: 'about',
  BUSINESS_HOURS: 'business_hours',
  SOCIAL_LINKS: 'social_links',
  PROMO_BANNER: 'promo_banner',
  SITE_SETTINGS: 'site_settings',
} as const;

/**
 * Tipos de conteúdo suportados
 */
export const CONTENT_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  JSON: 'json',
  NUMBER: 'number',
} as const;

/**
 * Rotas da aplicação
 */
export const ROUTES = {
  HOME: '/',
  ABOUT: '/sobre',
  CONTACT: '/contato',
  ADMIN: '/admin',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_CONTENT: '/admin/conteudo',
  ADMIN_GALLERY: '/admin/galeria',
  ADMIN_TESTIMONIALS: '/admin/depoimentos',
  ADMIN_MEDIA: '/admin/midia',
  ADMIN_SETTINGS: '/admin/configuracoes',
} as const;

/**
 * Roles de usuários administrativos
 */
export const USER_ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
} as const;

/**
 * Permissões por role
 */
export const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: [
    'read',
    'write',
    'delete',
    'manage_users',
    'manage_settings',
  ],
  [USER_ROLES.EDITOR]: ['read', 'write'],
} as const;

/**
 * Configurações de upload de arquivos
 */
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf'],
  STORAGE_BUCKET: 'media',
} as const;

/**
 * Configurações de paginação
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

/**
 * Mensagens de erro padrão
 */
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Você não tem permissão para acessar este recurso.',
  NOT_FOUND: 'Recurso não encontrado.',
  SERVER_ERROR: 'Erro interno do servidor. Tente novamente mais tarde.',
  INVALID_CREDENTIALS: 'Email ou senha inválidos.',
  VALIDATION_ERROR: 'Dados inválidos. Verifique os campos e tente novamente.',
  UPLOAD_ERROR: 'Erro ao fazer upload do arquivo.',
  FILE_TOO_LARGE: 'Arquivo muito grande. Tamanho máximo: 5MB.',
  INVALID_FILE_TYPE: 'Tipo de arquivo não suportado.',
} as const;

/**
 * Mensagens de sucesso padrão
 */
export const SUCCESS_MESSAGES = {
  SAVE_SUCCESS: 'Alterações salvas com sucesso!',
  DELETE_SUCCESS: 'Item deletado com sucesso!',
  UPLOAD_SUCCESS: 'Arquivo enviado com sucesso!',
  LOGIN_SUCCESS: 'Login realizado com sucesso!',
  LOGOUT_SUCCESS: 'Logout realizado com sucesso!',
} as const;

/**
 * Chaves de localStorage
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'williampizza_auth_token',
  USER_PREFERENCES: 'williampizza_user_prefs',
  DRAFT_CONTENT: 'williampizza_draft_',
} as const;

/**
 * Configurações de cache
 */
export const CACHE_CONFIG = {
  SITE_CONTENT_TTL: 5 * 60 * 1000, // 5 minutos
  MEDIA_LIST_TTL: 10 * 60 * 1000, // 10 minutos
  SETTINGS_TTL: 60 * 60 * 1000, // 1 hora
} as const;

/**
 * Informações de contato padrão (fallback)
 */
export const DEFAULT_CONTACT = {
  PHONE_PRIMARY: '(12) 3951-7565',
  PHONE_SECONDARY: '(12) 3961-3004',
  WHATSAPP: '5512996367326',
  EMAIL: 'contato@williamdiskpizza.com.br',
  ADDRESS: 'R. Bernardino de Campos, 143 - Jacareí SP',
} as const;
