-- =====================================================
-- William Disk Pizza CMS - Storage Configuration
-- =====================================================
-- 
-- Configura o Supabase Storage para upload de imagens
-- e outros arquivos de mídia.
-- =====================================================

-- =====================================================
-- CRIAR BUCKET DE STORAGE
-- =====================================================

-- Criar bucket público para mídia
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- POLÍTICAS DE STORAGE - Leitura Pública
-- =====================================================

-- Permitir que qualquer pessoa visualize arquivos
CREATE POLICY "Public Access to Media"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

-- =====================================================
-- POLÍTICAS DE STORAGE - Upload (Autenticados)
-- =====================================================

-- Permitir upload para usuários autenticados
CREATE POLICY "Authenticated users can upload media"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'media' 
    AND auth.role() = 'authenticated'
    AND EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE id = auth.uid()
    )
);

-- =====================================================
-- POLÍTICAS DE STORAGE - Atualização
-- =====================================================

-- Permitir atualização de arquivos para usuários autenticados
CREATE POLICY "Authenticated users can update media"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'media'
    AND EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE id = auth.uid()
    )
);

-- =====================================================
-- POLÍTICAS DE STORAGE - Deleção
-- =====================================================

-- Permitir deleção de arquivos para usuários autenticados
CREATE POLICY "Authenticated users can delete media"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'media'
    AND EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE id = auth.uid()
    )
);

-- =====================================================
-- FUNÇÃO: Limpar referências órfãs de mídia
-- =====================================================

CREATE OR REPLACE FUNCTION cleanup_orphaned_storage_objects()
RETURNS void AS $$
DECLARE
    orphaned_count INTEGER;
BEGIN
    -- Esta função pode ser executada periodicamente
    -- para remover arquivos que não estão mais referenciados
    
    -- Por enquanto, apenas conta os órfãos
    SELECT COUNT(*) INTO orphaned_count
    FROM storage.objects
    WHERE bucket_id = 'media'
    AND name NOT IN (
        SELECT url FROM public.media
        UNION
        SELECT image_url FROM public.gallery WHERE image_url IS NOT NULL
        UNION
        SELECT image_url FROM public.testimonials WHERE image_url IS NOT NULL
    );
    
    RAISE NOTICE 'Arquivos órfãos encontrados: %', orphaned_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Concluído!
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Storage configurado com sucesso!';
    RAISE NOTICE '📁 Bucket criado: media';
    RAISE NOTICE '🔒 Políticas de segurança aplicadas';
END $$;
