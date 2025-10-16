-- =====================================================
-- Utilitário: ROLLBACK COMPLETO
-- =====================================================
-- 
-- ⚠️ ATENÇÃO: Este script APAGA TUDO!
-- Use apenas se precisar resetar o banco completamente.
-- 
-- BACKUP seus dados antes de executar!
-- =====================================================

-- Confirmação de segurança
DO $$
BEGIN
    RAISE WARNING '⚠️  ATENÇÃO: Este script irá APAGAR TODOS OS DADOS!';
    RAISE WARNING '⚠️  Pressione STOP se não tem certeza.';
    RAISE WARNING '⚠️  Aguardando 5 segundos...';
    
    PERFORM pg_sleep(5);
    
    RAISE NOTICE '🗑️  Iniciando rollback...';
END $$;

-- =====================================================
-- 1. REMOVER POLÍTICAS RLS
-- =====================================================
DROP POLICY IF EXISTS "Anyone can view site content" ON public.site_content;
DROP POLICY IF EXISTS "Anyone can view active testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Anyone can view active gallery items" ON public.gallery;
DROP POLICY IF EXISTS "Anyone can view media" ON public.media;
DROP POLICY IF EXISTS "Anyone can view settings" ON public.settings;

DROP POLICY IF EXISTS "Authenticated users can modify site content" ON public.site_content;
DROP POLICY IF EXISTS "Authenticated users can modify testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Authenticated users can modify gallery" ON public.gallery;
DROP POLICY IF EXISTS "Authenticated users can modify media" ON public.media;
DROP POLICY IF EXISTS "Only admins can modify settings" ON public.settings;

DROP POLICY IF EXISTS "Admins can view all users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can insert users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can update users" ON public.admin_users;

DROP POLICY IF EXISTS "Public Access to Media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete media" ON storage.objects;

-- =====================================================
-- 2. REMOVER TRIGGERS
-- =====================================================
DROP TRIGGER IF EXISTS update_site_content_updated_at ON public.site_content;
DROP TRIGGER IF EXISTS update_media_updated_at ON public.media;
DROP TRIGGER IF EXISTS update_testimonials_updated_at ON public.testimonials;
DROP TRIGGER IF EXISTS update_gallery_updated_at ON public.gallery;
DROP TRIGGER IF EXISTS update_settings_updated_at ON public.settings;

-- =====================================================
-- 3. REMOVER FUNÇÕES
-- =====================================================
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS cleanup_orphaned_storage_objects() CASCADE;

-- =====================================================
-- 4. REMOVER TABELAS (CASCADE remove FK constraints)
-- =====================================================
DROP TABLE IF EXISTS public.gallery CASCADE;
DROP TABLE IF EXISTS public.testimonials CASCADE;
DROP TABLE IF EXISTS public.media CASCADE;
DROP TABLE IF EXISTS public.site_content CASCADE;
DROP TABLE IF EXISTS public.settings CASCADE;
DROP TABLE IF EXISTS public.admin_users CASCADE;

-- =====================================================
-- 5. REMOVER BUCKET DE STORAGE
-- =====================================================
-- Primeiro, deletar todos os objetos no bucket
DELETE FROM storage.objects WHERE bucket_id = 'media';

-- Depois, deletar o bucket
DELETE FROM storage.buckets WHERE id = 'media';

-- =====================================================
-- 6. LIMPAR USUÁRIOS AUTH (OPCIONAL - CUIDADO!)
-- =====================================================
-- DESCOMENTE APENAS SE QUISER REMOVER USUÁRIOS TAMBÉM
-- DELETE FROM auth.users WHERE email LIKE '%williamdiskpizza%';

-- =====================================================
-- CONFIRMAÇÃO
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Rollback completo executado!';
    RAISE NOTICE '📊 Todas as tabelas, funções e políticas foram removidas.';
    RAISE NOTICE '🔄 Você pode executar as migrations novamente do zero.';
END $$;

-- =====================================================
-- VERIFICAÇÃO PÓS-ROLLBACK
-- =====================================================
-- Execute para confirmar que tudo foi removido

SELECT 
    'Tabelas restantes' as check_type,
    COUNT(*) as count
FROM information_schema.tables
WHERE table_schema = 'public'

UNION ALL

SELECT 
    'Funções restantes',
    COUNT(*)
FROM information_schema.routines
WHERE routine_schema = 'public'

UNION ALL

SELECT 
    'Storage buckets',
    COUNT(*)
FROM storage.buckets
WHERE id = 'media';

-- Se todas retornarem 0, o rollback foi bem-sucedido!
