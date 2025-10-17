/**
 * CMS Content Types
 * 
 * Tipagens específicas para o sistema de gerenciamento de conteúdo.
 * Define estruturas de dados para diferentes seções do site.
 * 
 * @module types/cms
 */

/**
 * Conteúdo da seção Hero (banner principal)
 */
export interface HeroContent {
  title: string;
  subtitle: string;
  image_url: string;
  cta_text: string;
  cta_link: string;
}

/**
 * Estatísticas exibidas na home
 */
export interface StatsContent {
  years: number;
  clients: string;
  delivery_time: string;
  rating: string;
}

/**
 * Feature/Diferencial do negócio
 */
export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

/**
 * Informações de contato
 */
export interface ContactInfo {
  phone_primary: string;
  phone_secondary: string;
  whatsapp: string;
  email: string;
  address: string;
  map_embed_url: string;
}

/**
 * Horário de funcionamento
 */
export interface BusinessHours {
  days: string;
  hours: string;
  is_open: boolean;
}

/**
 * Informações "Sobre" a empresa
 */
export interface AboutContent {
  title: string;
  subtitle: string;
  description: string; // HTML do editor rico
  mission: string;
  image_url?: string;
}

/**
 * Banner promocional
 */
export interface PromoBanner {
  id: string;
  title: string;
  description: string;
  cta_text: string;
  cta_link: string;
  is_active: boolean;
  expires_at: string | null;
}

/**
 * Link de rede social
 */
export interface SocialLink {
  platform: 'instagram' | 'facebook' | 'twitter' | 'youtube';
  url: string;
  is_active: boolean;
}

/**
 * Configurações do site
 */
export interface SiteSettings {
  site_name: string;
  site_description: string;
  logo_url: string;
  favicon_url: string;
  primary_color: string;
  secondary_color: string;
  meta_keywords: string[];
  google_analytics_id: string | null;
}

/**
 * Depoimento de cliente
 */
export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  location: string;
  image_url: string | null;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

/**
 * Item da galeria
 */
export interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  alt_text: string;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Arquivo de mídia
 */
export interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  alt_text: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Usuário administrativo
 */
export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'editor';
  created_at: string;
  last_login: string | null;
}

/**
 * Resposta padrão da API
 */
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  message?: string;
}

/**
 * Parâmetros de paginação
 */
export interface PaginationParams {
  page: number;
  limit: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

/**
 * Resposta paginada
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
