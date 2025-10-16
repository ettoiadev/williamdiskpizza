/**
 * Supabase Database Types
 * 
 * Tipagens TypeScript geradas automaticamente a partir do schema do banco de dados Supabase.
 * Estas tipagens garantem type-safety em todas as operações de banco de dados.
 * 
 * @module types/supabase
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/**
 * Database schema principal
 */
export interface Database {
  public: {
    Tables: {
      // Tabela de conteúdo do site
      site_content: {
        Row: {
          id: string;
          section: string;
          key: string;
          value: Json;
          type: 'text' | 'image' | 'json' | 'number';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section: string;
          key: string;
          value: Json;
          type: 'text' | 'image' | 'json' | 'number';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section?: string;
          key?: string;
          value?: Json;
          type?: 'text' | 'image' | 'json' | 'number';
          created_at?: string;
          updated_at?: string;
        };
      };
      // Tabela de imagens/mídia
      media: {
        Row: {
          id: string;
          name: string;
          url: string;
          type: string;
          size: number;
          alt_text: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          url: string;
          type: string;
          size: number;
          alt_text?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          url?: string;
          type?: string;
          size?: number;
          alt_text?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      // Tabela de depoimentos
      testimonials: {
        Row: {
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
        };
        Insert: {
          id?: string;
          name: string;
          rating: number;
          comment: string;
          location: string;
          image_url?: string | null;
          is_active?: boolean;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          rating?: number;
          comment?: string;
          location?: string;
          image_url?: string | null;
          is_active?: boolean;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      // Tabela de galeria de imagens
      gallery: {
        Row: {
          id: string;
          title: string;
          image_url: string;
          alt_text: string;
          order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          image_url: string;
          alt_text: string;
          order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          image_url?: string;
          alt_text?: string;
          order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      // Tabela de configurações gerais
      settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          description: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: Json;
          description?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: Json;
          description?: string | null;
          updated_at?: string;
        };
      };
      // Tabela de usuários admin
      admin_users: {
        Row: {
          id: string;
          email: string;
          role: 'admin' | 'editor';
          created_at: string;
          last_login: string | null;
        };
        Insert: {
          id: string;
          email: string;
          role?: 'admin' | 'editor';
          created_at?: string;
          last_login?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          role?: 'admin' | 'editor';
          created_at?: string;
          last_login?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      content_type: 'text' | 'image' | 'json' | 'number';
      user_role: 'admin' | 'editor';
    };
  };
}
