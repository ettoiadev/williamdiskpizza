# ✅ Checklist de Testes - William Disk Pizza CMS

## 📋 Guia de Validação Completo

**Data:** 15/10/2025  
**Versão:** 1.0.0  
**Status:** Pronto para Testes

---

## 🎯 Objetivo

Validar todas as funcionalidades do sistema antes do deploy em produção.

---

## 🔐 **1. TESTES DE AUTENTICAÇÃO**

### ✅ Login
- [ ] Acessar `/admin/login`
- [ ] Tentar login com credenciais corretas
  - Email: `admin@admin.com`
  - Senha: `***REMOVIDO***`
  - ✓ Deve redirecionar para `/admin/dashboard`
  - ✓ Deve mostrar toast de sucesso
- [ ] Tentar login com email incorreto
  - ✓ Deve mostrar erro
  - ✓ Não deve redirecionar
- [ ] Tentar login com senha incorreta
  - ✓ Deve mostrar erro
  - ✓ Não deve redirecionar
- [ ] Tentar login com campos vazios
  - ✓ Deve mostrar erro de validação
- [ ] Toggle mostrar/ocultar senha
  - ✓ Deve alternar visibilidade
- [ ] Em modo DEV, verificar se credenciais de teste aparecem

### ✅ Sessão
- [ ] Fazer login
- [ ] Recarregar página
  - ✓ Deve manter sessão ativa
  - ✓ Não deve redirecionar para login
- [ ] Abrir nova aba
  - ✓ Deve estar logado automaticamente
- [ ] Fechar navegador e reabrir
  - ✓ Deve manter sessão (se configurado)

### ✅ Logout
- [ ] Clicar em "Sair" no dashboard
  - ✓ Deve deslogar
  - ✓ Deve redirecionar para `/admin/login`
  - ✓ Não deve conseguir acessar áreas protegidas

### ✅ Proteção de Rotas
- [ ] Tentar acessar `/admin/dashboard` sem login
  - ✓ Deve redirecionar para `/admin/login`
- [ ] Tentar acessar `/admin/conteudo` sem login
  - ✓ Deve redirecionar para `/admin/login`
- [ ] Fazer login como editor (se houver)
  - ✓ Não deve acessar `/admin/configuracoes`
  - ✓ Não deve acessar `/admin/usuarios`

---

## 📝 **2. TESTES DE GERENCIAMENTO DE CONTEÚDO**

### ✅ ContentManager - Hero Section
- [ ] Acessar `/admin/conteudo`
- [ ] Verificar se dados carregam
  - ✓ Loading deve aparecer
  - ✓ Dados devem preencher formulário
- [ ] Editar "Título"
  - Input: `"Novo Título de Teste"`
  - ✓ Campo deve aceitar texto
- [ ] Editar "Subtítulo"
  - Input: `"Nova descrição de teste"`
  - ✓ Campo deve aceitar texto
- [ ] Editar "URL da Imagem"
  - Input: URL válida
  - ✓ Campo deve aceitar URL
- [ ] Clicar em "Salvar Alterações"
  - ✓ Deve mostrar loading no botão
  - ✓ Deve mostrar toast de sucesso
  - ✓ Botão deve desabilitar durante salvamento
- [ ] Ir para `/` (home pública)
  - ✓ Título deve estar atualizado
  - ✓ Subtítulo deve estar atualizado

### ✅ ContentManager - Stats Section
- [ ] Acessar tab "Stats"
- [ ] Verificar se dados carregam
- [ ] Editar "Anos de Tradição"
  - Input: `40`
  - ✓ Deve aceitar número
- [ ] Editar "Clientes"
  - Input: `+15k`
  - ✓ Deve aceitar texto
- [ ] Editar "Tempo de Entrega"
  - Input: `25min`
- [ ] Editar "Avaliação"
  - Input: `5.0★`
- [ ] Salvar e verificar no site público
  - ✓ Stats devem atualizar

### ✅ ContentManager - Contact Section
- [ ] Acessar tab "Contato"
- [ ] Verificar campos:
  - [ ] Telefone Principal
  - [ ] Telefone Secundário
  - [ ] WhatsApp
  - [ ] Email
  - [ ] Endereço
- [ ] Editar todos os campos
- [ ] Salvar
- [ ] Verificar se dados salvam corretamente

### ✅ ContentManager - Business Hours
- [ ] Acessar tab "Horário"
- [ ] Editar dias de funcionamento
- [ ] Editar horário
- [ ] Salvar
- [ ] Verificar atualização

### ✅ Validações de Formulário
- [ ] Tentar salvar campo obrigatório vazio
  - ✓ Deve mostrar erro
- [ ] Inserir caracteres especiais em campos de texto
  - ✓ Deve aceitar normalmente
- [ ] Inserir HTML em campos de texto
  - ✓ Não deve executar código

---

## 🖼️ **3. TESTES DE GALERIA**

### ✅ Upload de Imagem Única
- [ ] Acessar `/admin/galeria`
- [ ] Clicar na área de upload
- [ ] Selecionar 1 imagem válida (JPG/PNG)
  - ✓ Preview deve aparecer
  - ✓ Nome do arquivo deve aparecer
  - ✓ Tamanho do arquivo deve aparecer
- [ ] Clicar em "Fazer Upload"
  - ✓ Loading deve aparecer
  - ✓ Toast de sucesso
  - ✓ Imagem deve aparecer na galeria abaixo
- [ ] Ir para `/` (home pública)
  - ✓ Imagem deve aparecer na galeria do site

### ✅ Upload Múltiplo
- [ ] Selecionar 3 imagens de uma vez
  - ✓ Todas devem mostrar preview
  - ✓ Contador deve mostrar "3"
- [ ] Upload
  - ✓ Todas devem ser enviadas
  - ✓ Todas devem aparecer na galeria

### ✅ Drag and Drop
- [ ] Arrastar 1 imagem para área de upload
  - ✓ Área deve destacar (hover state)
  - ✓ Imagem deve ser aceita
  - ✓ Preview deve aparecer
- [ ] Arrastar múltiplas imagens
  - ✓ Todas devem ser aceitas

### ✅ Validações de Upload
- [ ] Tentar upload de arquivo muito grande (>5MB)
  - ✓ Deve mostrar erro
  - ✓ Não deve aceitar
- [ ] Tentar upload de arquivo não-imagem (PDF, DOC)
  - ✓ Deve mostrar erro
  - ✓ Não deve aceitar
- [ ] Tentar upload de imagem corrompida
  - ✓ Deve tratar erro gracefully

### ✅ Gerenciamento de Galeria
- [ ] Ativar/Desativar imagem
  - Toggle switch
  - ✓ Status deve mudar
  - ✓ Imagem inativa não aparece no site
  - ✓ Imagem ativa aparece no site
- [ ] Deletar imagem
  - [ ] Clicar no botão de deletar
  - ✓ Dialog de confirmação deve aparecer
  - [ ] Confirmar exclusão
  - ✓ Imagem deve sumir da galeria
  - ✓ Imagem deve sumir do site
  - ✓ Arquivo deve ser deletado do storage
- [ ] Verificar informações da imagem
  - ✓ Título deve aparecer
  - ✓ Alt text deve aparecer

---

## ⭐ **4. TESTES DE DEPOIMENTOS (Backend)**

### ✅ Dados no Banco
- [ ] Abrir Supabase Dashboard
- [ ] Verificar tabela `testimonials`
- [ ] Confirmar que há 3 depoimentos
- [ ] Todos devem ter `is_active = true`

### ✅ Exibição no Site
- [ ] Acessar `/` (home)
- [ ] Scroll até seção de depoimentos
  - ✓ 3 depoimentos devem aparecer
  - ✓ Estrelas devem estar corretas (5★)
  - ✓ Nomes devem aparecer
  - ✓ Comentários devem aparecer
  - ✓ Localização deve aparecer
- [ ] Verificar média de avaliação
  - ✓ Deve mostrar "3+ avaliações • ⭐ 5.0/5.0"

### ✅ Loading State
- [ ] Desativar rede (DevTools)
- [ ] Recarregar página
  - ✓ Spinner deve aparecer
- [ ] Reativar rede
  - ✓ Depoimentos devem carregar

### ✅ Empty State
- [ ] Supabase: Desativar todos depoimentos
- [ ] Recarregar site
  - ✓ Mensagem "Nenhum depoimento disponível" deve aparecer
  - ✓ Ícone de mensagem deve aparecer

---

## 🎨 **5. TESTES DE UI/UX**

### ✅ Responsividade
- [ ] Testar em Desktop (1920x1080)
  - ✓ Layout deve estar correto
  - ✓ Sidebar deve aparecer
- [ ] Testar em Tablet (768x1024)
  - ✓ Layout deve ajustar
  - ✓ Grid deve mudar
- [ ] Testar em Mobile (375x667)
  - ✓ Menu hambúrguer deve aparecer
  - ✓ Sidebar deve ser overlay
  - ✓ Cards devem empilhar

### ✅ Navegação Admin
- [ ] Clicar em cada item do menu
  - [ ] Dashboard
  - [ ] Conteúdo
  - [ ] Galeria
  - ✓ Todos devem navegar corretamente
  - ✓ Item ativo deve ter highlight

### ✅ Acessibilidade
- [ ] Navegar com teclado (Tab)
  - ✓ Foco deve ser visível
  - ✓ Ordem lógica
- [ ] Testar com leitor de tela
  - ✓ Alt texts em imagens
  - ✓ Labels em formulários
- [ ] Verificar contraste de cores
  - ✓ Texto deve ser legível

### ✅ Loading States
- [ ] Todos componentes devem ter loading
  - [ ] Login
  - [ ] Dashboard
  - [ ] ContentManager
  - [ ] Gallery
  - [ ] Testimonials
  - ✓ Spinner deve aparecer

### ✅ Error States
- [ ] Simular erro de rede
  - ✓ Mensagem de erro deve aparecer
  - ✓ Não deve quebrar aplicação
- [ ] Tentar ação inválida
  - ✓ Erro deve ser tratado
  - ✓ Toast de erro deve aparecer

---

## 🔒 **6. TESTES DE SEGURANÇA**

### ✅ Row Level Security (RLS)
- [ ] Fazer logout
- [ ] Tentar acessar API diretamente
  - URL: Supabase REST API
  - ✓ Leitura pública deve funcionar
  - ✓ Escrita sem auth deve falhar
- [ ] Fazer login
- [ ] Tentar editar dados de outro usuário
  - ✓ Deve ser impedido

### ✅ XSS Prevention
- [ ] Inserir `<script>alert('xss')</script>` em campo de texto
  - ✓ Não deve executar
  - ✓ Deve ser sanitizado
- [ ] Inserir HTML em comentários
  - ✓ Não deve renderizar HTML

### ✅ SQL Injection
- [ ] Tentar `' OR 1=1--` em campos
  - ✓ Não deve afetar queries
  - ✓ Supabase previne automaticamente

### ✅ CSRF Protection
- [ ] Verificar que Supabase usa tokens
  - ✓ Requests devem incluir auth token
  - ✓ Tokens devem ser validados

---

## ⚡ **7. TESTES DE PERFORMANCE**

### ✅ Cache
- [ ] Acessar página
- [ ] Recarregar
  - ✓ Segunda carga deve ser mais rápida
  - ✓ React Query deve usar cache
- [ ] Verificar DevTools Network
  - ✓ Requests devem ser reduzidos

### ✅ Lazy Loading
- [ ] Abrir DevTools Network
- [ ] Acessar home
  - ✓ Apenas recursos necessários devem carregar
- [ ] Scroll até galeria
  - ✓ Imagens devem carregar sob demanda

### ✅ Bundle Size
- [ ] Rodar build
  ```bash
  npm run build
  ```
  - ✓ Bundle deve ser razoável (<500KB gzip)
- [ ] Verificar relatório de build
  - ✓ Não deve ter dependências gigantes

### ✅ Lighthouse Score
- [ ] Abrir Chrome DevTools
- [ ] Rodar Lighthouse
  - [ ] Performance: >80
  - [ ] Accessibility: >90
  - [ ] Best Practices: >90
  - [ ] SEO: >80

---

## 🗄️ **8. TESTES DE BANCO DE DADOS**

### ✅ Integridade de Dados
- [ ] Verificar no Supabase Dashboard
  - [ ] Todos os 48 registros iniciais existem?
  - [ ] Timestamps estão corretos?
  - [ ] Foreign keys funcionam?

### ✅ Triggers
- [ ] Editar qualquer conteúdo
- [ ] Verificar campo `updated_at`
  - ✓ Deve atualizar automaticamente
- [ ] Criar novo registro
  - ✓ `created_at` deve ser preenchido

### ✅ RLS Policies
- [ ] Verificar políticas no Supabase
  - [ ] 15 políticas devem existir
  - [ ] Todas devem estar ativas
  - ✓ Leitura pública funciona
  - ✓ Escrita requer auth

### ✅ Indexes
- [ ] Verificar performance de queries
  - ✓ Queries devem ser rápidas (<100ms)
  - ✓ Indexes devem estar otimizados

---

## 📱 **9. TESTES CROSS-BROWSER**

### ✅ Chrome
- [ ] Versão: Latest
- [ ] Todas funcionalidades funcionam?
- [ ] Console sem erros?

### ✅ Firefox
- [ ] Versão: Latest
- [ ] Todas funcionalidades funcionam?
- [ ] Console sem erros?

### ✅ Safari
- [ ] Versão: Latest (se disponível)
- [ ] Todas funcionalidades funcionam?
- [ ] Console sem erros?

### ✅ Edge
- [ ] Versão: Latest
- [ ] Todas funcionalidades funcionam?
- [ ] Console sem erros?

---

## 🐛 **10. TESTES DE EDGE CASES**

### ✅ Conexão Lenta
- [ ] Simular 3G no DevTools
  - ✓ Loading states devem aparecer
  - ✓ Não deve quebrar
  - ✓ Timeouts devem ser tratados

### ✅ Offline
- [ ] Desativar rede completamente
  - ✓ Mensagem de erro deve aparecer
  - ✓ Não deve quebrar aplicação
- [ ] Reativar rede
  - ✓ Deve reconectar automaticamente

### ✅ Upload Grande
- [ ] Tentar upload de muitas imagens (10+)
  - ✓ Deve processar todas
  - ✓ Progress deve ser mostrado
  - ✓ Não deve travar navegador

### ✅ Dados Vazios
- [ ] Deletar todos dados do banco (teste)
  - ✓ Empty states devem aparecer
  - ✓ Não deve dar erro

### ✅ Caracteres Especiais
- [ ] Inserir emojis 🍕😊✨
  - ✓ Deve salvar corretamente
  - ✓ Deve exibir corretamente
- [ ] Inserir acentos (á, é, í, ó, ú, ç)
  - ✓ Deve funcionar normalmente

---

## ✅ **RESULTADO ESPERADO**

### **Todos os testes devem passar:**
- ✅ Login funciona
- ✅ Edição de conteúdo funciona
- ✅ Upload funciona
- ✅ Galeria dinâmica funciona
- ✅ Depoimentos dinâmicos funcionam
- ✅ Segurança está OK
- ✅ Performance está OK
- ✅ Sem bugs críticos

### **Sistema está pronto para:**
- ✅ Deploy em produção
- ✅ Uso por clientes
- ✅ Treinamento de usuários
- ✅ Demonstrações

---

## 📝 **COMO REPORTAR BUGS**

Se encontrar um bug durante os testes:

1. **Descrever o problema:**
   - O que você tentou fazer?
   - O que esperava que acontecesse?
   - O que realmente aconteceu?

2. **Passos para reproduzir:**
   - Lista exata de ações

3. **Screenshots:**
   - Captura de tela do erro
   - Console do navegador

4. **Informações do ambiente:**
   - Navegador e versão
   - Sistema operacional
   - Resolução de tela

---

## 🎯 **PRÓXIMOS PASSOS APÓS TESTES**

1. **Corrigir bugs encontrados**
2. **Otimizar performance**
3. **Documentar issues conhecidos**
4. **Preparar para deploy**
5. **Criar backup do banco**
6. **Configurar domínio**
7. **Deploy em produção!**

---

**Data de Criação:** 15/10/2025  
**Versão do Checklist:** 1.0.0  
**Estimativa de Tempo:** 2-4 horas de testes
