-- =====================================================
-- William Disk Pizza CMS - Initial Database Schema
-- =====================================================
-- 
-- Este script cria a estrutura inicial do banco de dados
-- para o sistema de gerenciamento de conteúdo.
--
-- Inclui:
-- - Tabelas principais
-- - Row Level Security (RLS)
-- - Triggers para timestamps automáticos
-- - Índices para performance
-- =====================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABELA: admin_users
-- Usuários com acesso administrativo ao CMS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'editor')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login TIMESTAMPTZ,
    
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Comentários
COMMENT ON TABLE public.admin_users IS 'Usuários administrativos com acesso ao CMS';
COMMENT ON COLUMN public.admin_users.role IS 'admin: acesso total | editor: apenas edição de conteúdo';

-- =====================================================
-- TABELA: site_content
-- Conteúdo dinâmico do site (textos, números, JSONs)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.site_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section TEXT NOT NULL,
    key TEXT NOT NULL,
    value JSONB NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('text', 'image', 'json', 'number')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(section, key)
);

-- Índices para performance
CREATE INDEX idx_site_content_section ON public.site_content(section);
CREATE INDEX idx_site_content_key ON public.site_content(key);
CREATE INDEX idx_site_content_type ON public.site_content(type);

COMMENT ON TABLE public.site_content IS 'Conteúdo dinâmico do site organizados por seções';

-- =====================================================
-- TABELA: media
-- Gerenciamento de arquivos e imagens
-- =====================================================
CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    type TEXT NOT NULL,
    size INTEGER NOT NULL CHECK (size > 0),
    alt_text TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_media_type ON public.media(type);
CREATE INDEX idx_media_created_at ON public.media(created_at DESC);

COMMENT ON TABLE public.media IS 'Biblioteca de mídia - imagens, documentos e arquivos';
COMMENT ON COLUMN public.media.size IS 'Tamanho do arquivo em bytes';

-- =====================================================
-- TABELA: testimonials
-- Depoimentos de clientes
-- =====================================================
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    location TEXT NOT NULL,
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_testimonials_active ON public.testimonials(is_active);
CREATE INDEX idx_testimonials_order ON public.testimonials("order");
CREATE INDEX idx_testimonials_rating ON public.testimonials(rating DESC);

COMMENT ON TABLE public.testimonials IS 'Depoimentos e avaliações de clientes';
COMMENT ON COLUMN public.testimonials."order" IS 'Ordem de exibição (menor = primeiro)';

-- =====================================================
-- TABELA: gallery
-- Galeria de imagens do site
-- =====================================================
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    alt_text TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_gallery_active ON public.gallery(is_active);
CREATE INDEX idx_gallery_order ON public.gallery("order");

COMMENT ON TABLE public.gallery IS 'Galeria de fotos exibidas no site';

-- =====================================================
-- TABELA: settings
-- Configurações gerais do site
-- =====================================================
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice
CREATE INDEX idx_settings_key ON public.settings(key);

COMMENT ON TABLE public.settings IS 'Configurações globais do site (logo, cores, meta tags, etc)';

-- =====================================================
-- FUNÇÃO: Atualizar updated_at automaticamente
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar triggers em todas as tabelas relevantes
CREATE TRIGGER update_site_content_updated_at
    BEFORE UPDATE ON public.site_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_updated_at
    BEFORE UPDATE ON public.media
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
    BEFORE UPDATE ON public.testimonials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_updated_at
    BEFORE UPDATE ON public.gallery
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON public.settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS: admin_users
-- =====================================================

-- Admins podem ver todos os usuários
CREATE POLICY "Admins can view all users"
    ON public.admin_users
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Admins podem inserir novos usuários
CREATE POLICY "Admins can insert users"
    ON public.admin_users
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Admins podem atualizar usuários
CREATE POLICY "Admins can update users"
    ON public.admin_users
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================================
-- POLÍTICAS: Conteúdo Público (SELECT)
-- Qualquer um pode ler conteúdo público
-- =====================================================

CREATE POLICY "Anyone can view site content"
    ON public.site_content
    FOR SELECT
    USING (true);

CREATE POLICY "Anyone can view active testimonials"
    ON public.testimonials
    FOR SELECT
    USING (is_active = true);

CREATE POLICY "Anyone can view active gallery items"
    ON public.gallery
    FOR SELECT
    USING (is_active = true);

CREATE POLICY "Anyone can view media"
    ON public.media
    FOR SELECT
    USING (true);

CREATE POLICY "Anyone can view settings"
    ON public.settings
    FOR SELECT
    USING (true);

-- =====================================================
-- POLÍTICAS: Modificação (INSERT/UPDATE/DELETE)
-- Apenas usuários autenticados e autorizados
-- =====================================================

-- site_content
CREATE POLICY "Authenticated users can modify site content"
    ON public.site_content
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE id = auth.uid()
        )
    );

-- testimonials
CREATE POLICY "Authenticated users can modify testimonials"
    ON public.testimonials
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE id = auth.uid()
        )
    );

-- gallery
CREATE POLICY "Authenticated users can modify gallery"
    ON public.gallery
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE id = auth.uid()
        )
    );

-- media
CREATE POLICY "Authenticated users can modify media"
    ON public.media
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE id = auth.uid()
        )
    );

-- settings (apenas admins)
CREATE POLICY "Only admins can modify settings"
    ON public.settings
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================================
-- Concluído!
-- =====================================================
