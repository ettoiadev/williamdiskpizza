-- =====================================================
-- Utilitário: Inspecionar Schema do Banco
-- =====================================================
-- 
-- Este script fornece uma visão completa da estrutura
-- do banco de dados para debug e validação.
-- =====================================================

-- =====================================================
-- 1. LISTAR TODAS AS TABELAS
-- =====================================================
SELECT 
    table_name,
    (SELECT COUNT(*) 
     FROM information_schema.columns 
     WHERE table_schema = 'public' 
     AND table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
ORDER BY table_name;

-- =====================================================
-- 2. DETALHES DAS COLUNAS POR TABELA
-- =====================================================
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- =====================================================
-- 3. VERIFICAR ROW LEVEL SECURITY
-- =====================================================
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- =====================================================
-- 4. POLÍTICAS RLS ATIVAS
-- =====================================================
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd as command
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- =====================================================
-- 5. ÍNDICES CRIADOS
-- =====================================================
SELECT
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- =====================================================
-- 6. TRIGGERS ATIVOS
-- =====================================================
SELECT
    trigger_name,
    event_manipulation as event,
    event_object_table as table_name,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- =====================================================
-- 7. CONSTRAINTS (UNIQUE, CHECK, FK)
-- =====================================================
SELECT
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_type;

-- =====================================================
-- 8. STORAGE BUCKETS
-- =====================================================
SELECT 
    id,
    name,
    public,
    created_at
FROM storage.buckets
ORDER BY name;

-- =====================================================
-- 9. POLÍTICAS DE STORAGE
-- =====================================================
SELECT 
    name as policy_name,
    bucket_id,
    definition
FROM storage.policies
ORDER BY bucket_id, name;

-- =====================================================
-- 10. CONTAGEM DE REGISTROS
-- =====================================================
DO $$
DECLARE
    table_record RECORD;
    row_count INTEGER;
BEGIN
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'CONTAGEM DE REGISTROS POR TABELA';
    RAISE NOTICE '=====================================================';
    
    FOR table_record IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
    LOOP
        EXECUTE format('SELECT COUNT(*) FROM %I', table_record.table_name) INTO row_count;
        RAISE NOTICE '% : % registros', table_record.table_name, row_count;
    END LOOP;
    
    RAISE NOTICE '=====================================================';
END $$;

-- =====================================================
-- 11. VERIFICAR FUNÇÕES CUSTOMIZADAS
-- =====================================================
SELECT 
    routine_name as function_name,
    routine_type as type,
    data_type as return_type
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- =====================================================
-- 12. RESUMO GERAL
-- =====================================================
SELECT 
    'Tabelas' as metric,
    COUNT(*) as count
FROM information_schema.tables
WHERE table_schema = 'public'

UNION ALL

SELECT 
    'Colunas',
    COUNT(*)
FROM information_schema.columns
WHERE table_schema = 'public'

UNION ALL

SELECT 
    'Índices',
    COUNT(*)
FROM pg_indexes
WHERE schemaname = 'public'

UNION ALL

SELECT 
    'Triggers',
    COUNT(*)
FROM information_schema.triggers
WHERE trigger_schema = 'public'

UNION ALL

SELECT 
    'Políticas RLS',
    COUNT(*)
FROM pg_policies
WHERE schemaname = 'public'

UNION ALL

SELECT 
    'Storage Buckets',
    COUNT(*)
FROM storage.buckets;
