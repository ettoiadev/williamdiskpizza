# 🔌 Guia da API - William Disk Pizza CMS

## 📋 Visão Geral

API completa com serviços e hooks customizados usando React Query para gerenciar todo o conteúdo do CMS.

---

## 🏗️ Arquitetura

### Camadas da API

```
Componente React
       ↓
   Hook (React Query)
       ↓
   Service (Lógica)
       ↓
 Supabase Client
       ↓
   Banco de Dados
```

---

## 📦 Serviços Disponíveis

### 1. Content Service (`content-service.ts`)

Gerencia conteúdo dinâmico do site (site_content).

**Métodos:**
- `getAll()` - Buscar todo conteúdo
- `getBySection(section)` - Buscar por seção
- `getByKey(section, key)` - Buscar item específico
- `upsert(input)` - Criar/atualizar
- `upsertMany(items)` - Atualizar múltiplos
- `delete(section, key)` - Deletar item
- `deleteSection(section)` - Deletar seção completa
- `getSections()` - Listar seções
- `getByType(type)` - Buscar por tipo

**Exemplo:**
```typescript
import { contentService } from '@/services/content-service';

// Buscar conteúdo da seção hero
const { data, error } = await contentService.getBySection('hero');

// Atualizar título
await contentService.upsert({
  section: 'hero',
  key: 'title',
  value: 'Novo Título',
  type: 'text'
});
```

---

### 2. Gallery Service (`gallery-service.ts`)

Gerencia galeria de imagens.

**Métodos:**
- `getAll(activeOnly?)` - Buscar galeria
- `getById(id)` - Buscar item
- `create(input)` - Adicionar imagem
- `update(input)` - Atualizar imagem
- `delete(id)` - Remover imagem
- `toggleActive(id, isActive)` - Ativar/desativar
- `reorder(items)` - Reordenar
- `count(activeOnly?)` - Contar itens

**Exemplo:**
```typescript
import { galleryService } from '@/services/gallery-service';

// Adicionar nova imagem
await galleryService.create({
  title: 'Pizza Margherita',
  image_url: 'https://...',
  alt_text: 'Deliciosa pizza',
  is_active: true
});

// Reordenar galeria
await galleryService.reorder([
  { id: 'abc', order: 0 },
  { id: 'def', order: 1 }
]);
```

---

### 3. Testimonials Service (`testimonials-service.ts`)

Gerencia depoimentos e avaliações.

**Métodos:**
- `getAll(filters?)` - Buscar depoimentos
- `getById(id)` - Buscar específico
- `create(input)` - Criar depoimento
- `update(input)` - Atualizar
- `delete(id)` - Deletar
- `toggleActive(id, isActive)` - Ativar/desativar
- `reorder(items)` - Reordenar
- `getByRating(rating)` - Filtrar por nota
- `getAverageRating()` - Calcular média
- `getRatingStats()` - Estatísticas
- `count(activeOnly?)` - Contar

**Exemplo:**
```typescript
import { testimonialsService } from '@/services/testimonials-service';

// Criar depoimento
await testimonialsService.create({
  name: 'João Silva',
  rating: 5,
  comment: 'Melhor pizza!',
  location: 'São Paulo, SP'
});

// Buscar média
const { data: average } = await testimonialsService.getAverageRating();
```

---

### 4. Settings Service (`settings-service.ts`)

Gerencia configurações globais do site.

**Métodos:**
- `getAll()` - Todas configurações
- `getByKey(key)` - Por chave
- `getByKeys(keys)` - Múltiplas chaves
- `upsert(input)` - Criar/atualizar
- `upsertMany(items)` - Múltiplas
- `delete(key)` - Deletar
- `getSEOSettings()` - Configs SEO
- `getThemeSettings()` - Configs tema
- `getAsObject()` - Como objeto chave-valor

**Exemplo:**
```typescript
import { settingsService } from '@/services/settings-service';

// Atualizar cor primária
await settingsService.upsert({
  key: 'primary_color',
  value: '#ef4444',
  description: 'Cor primária do site'
});

// Buscar configs como objeto
const { data: settings } = await settingsService.getAsObject();
// { primary_color: '#ef4444', logo_url: '/logo.png', ... }
```

---

## 🎣 Hooks com React Query

### Por que usar hooks?

✅ **Cache automático** - Dados armazenados em memória  
✅ **Revalidação** - Atualização automática  
✅ **Loading states** - Estados de carregamento  
✅ **Error handling** - Tratamento de erros  
✅ **Mutations** - Operações de escrita  
✅ **Invalidação** - Atualizar cache automaticamente  

---

### Content Hooks

```typescript
import { 
  useContent, 
  useContentBySection,
  useUpsertContent 
} from '@/hooks/use-content';

function ContentEditor() {
  // Buscar conteúdo da seção hero
  const { data, isLoading, error } = useContentBySection('hero');
  
  // Mutation para atualizar
  const mutation = useUpsertContent();
  
  const handleSave = () => {
    mutation.mutate({
      section: 'hero',
      key: 'title',
      value: 'Novo Título',
      type: 'text'
    });
  };
  
  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  
  return (
    <div>
      {data?.map(item => (
        <div key={item.id}>{item.value}</div>
      ))}
      <button onClick={handleSave}>Salvar</button>
    </div>
  );
}
```

**Hooks disponíveis:**
- `useContent()` - Todo conteúdo
- `useContentBySection(section)` - Por seção
- `useContentByKey(section, key)` - Item específico
- `useSections()` - Listar seções
- `useUpsertContent()` - Criar/atualizar
- `useUpsertManyContent()` - Múltiplos
- `useDeleteContent()` - Deletar

---

### Gallery Hooks

```typescript
import { 
  useGallery,
  useCreateGalleryItem,
  useReorderGallery 
} from '@/hooks/use-gallery';

function GalleryManager() {
  const { data: gallery } = useGallery();
  const createMutation = useCreateGalleryItem();
  const reorderMutation = useReorderGallery();
  
  const handleAddImage = (image) => {
    createMutation.mutate({
      title: image.title,
      image_url: image.url,
      alt_text: image.alt
    });
  };
  
  const handleReorder = (newOrder) => {
    reorderMutation.mutate(newOrder);
  };
  
  return (
    <div>
      {gallery?.map(item => (
        <img key={item.id} src={item.image_url} alt={item.alt_text} />
      ))}
    </div>
  );
}
```

**Hooks disponíveis:**
- `useGallery(activeOnly?)` - Galeria completa
- `useGalleryItem(id)` - Item específico
- `useGalleryCount(activeOnly?)` - Contar itens
- `useCreateGalleryItem()` - Adicionar
- `useUpdateGalleryItem()` - Atualizar
- `useDeleteGalleryItem()` - Remover
- `useToggleGalleryItem()` - Ativar/desativar
- `useReorderGallery()` - Reordenar

---

### Testimonials Hooks

```typescript
import { 
  useTestimonials,
  useAverageRating,
  useCreateTestimonial 
} from '@/hooks/use-testimonials';

function TestimonialsPage() {
  const { data: testimonials } = useTestimonials({ is_active: true });
  const { data: average } = useAverageRating();
  const createMutation = useCreateTestimonial();
  
  const handleCreate = (data) => {
    createMutation.mutate({
      name: data.name,
      rating: data.rating,
      comment: data.comment,
      location: data.location
    });
  };
  
  return (
    <div>
      <h2>Avaliação média: {average}★</h2>
      {testimonials?.map(t => (
        <TestimonialCard key={t.id} testimonial={t} />
      ))}
    </div>
  );
}
```

**Hooks disponíveis:**
- `useTestimonials(filters?)` - Todos depoimentos
- `useTestimonial(id)` - Específico
- `useTestimonialsByRating(rating)` - Por nota
- `useAverageRating()` - Média
- `useRatingStats()` - Estatísticas
- `useTestimonialsCount(activeOnly?)` - Contar
- `useCreateTestimonial()` - Criar
- `useUpdateTestimonial()` - Atualizar
- `useDeleteTestimonial()` - Deletar
- `useToggleTestimonial()` - Ativar/desativar
- `useReorderTestimonials()` - Reordenar

---

### Settings Hooks

```typescript
import { 
  useSettings,
  useSetting,
  useUpsertSetting 
} from '@/hooks/use-settings';

function SettingsPage() {
  const { data: allSettings } = useSettings();
  const { data: logo } = useSetting('logo_url');
  const mutation = useUpsertSetting();
  
  const handleUpdateLogo = (newUrl) => {
    mutation.mutate({
      key: 'logo_url',
      value: newUrl,
      description: 'URL do logo'
    });
  };
  
  return (
    <div>
      <img src={logo?.value} alt="Logo" />
      <button onClick={() => handleUpdateLogo('/new-logo.png')}>
        Atualizar Logo
      </button>
    </div>
  );
}
```

**Hooks disponíveis:**
- `useSettings()` - Todas configurações
- `useSetting(key)` - Por chave
- `useSettingsByKeys(keys)` - Múltiplas
- `useSEOSettings()` - Configs SEO
- `useThemeSettings()` - Configs tema
- `useSettingsObject()` - Como objeto
- `useUpsertSetting()` - Criar/atualizar
- `useUpsertManySettings()` - Múltiplas
- `useDeleteSetting()` - Deletar

---

## 🎯 Padrões de Uso

### 1. Buscar Dados (Query)

```typescript
const { data, isLoading, error, refetch } = useContent();

if (isLoading) return <Spinner />;
if (error) return <Error />;

return <div>{/* Renderizar data */}</div>;
```

### 2. Modificar Dados (Mutation)

```typescript
const mutation = useUpsertContent();

const handleSave = () => {
  mutation.mutate(
    { section: 'hero', key: 'title', value: 'Novo', type: 'text' },
    {
      onSuccess: () => console.log('Salvo!'),
      onError: (error) => console.error(error)
    }
  );
};

return (
  <button 
    onClick={handleSave}
    disabled={mutation.isPending}
  >
    {mutation.isPending ? 'Salvando...' : 'Salvar'}
  </button>
);
```

### 3. Invalidar Cache

```typescript
import { useQueryClient } from '@tanstack/react-query';
import { contentKeys } from '@/hooks/use-content';

const queryClient = useQueryClient();

// Invalidar manualmente
queryClient.invalidateQueries({ queryKey: contentKeys.all });
```

### 4. Atualização Otimista

```typescript
const mutation = useUpdateGalleryItem();

mutation.mutate(
  { id: '123', title: 'Novo Título' },
  {
    onMutate: async (newData) => {
      // Cancelar queries em andamento
      await queryClient.cancelQueries({ queryKey: galleryKeys.all });
      
      // Snapshot do valor anterior
      const previous = queryClient.getQueryData(galleryKeys.all);
      
      // Atualizar otimisticamente
      queryClient.setQueryData(galleryKeys.all, (old) => {
        // Atualizar data...
        return newData;
      });
      
      return { previous };
    },
    onError: (err, newData, context) => {
      // Reverter em caso de erro
      queryClient.setQueryData(galleryKeys.all, context.previous);
    },
  }
);
```

---

## 🔍 Filtros e Parâmetros

### Testimonials com Filtros

```typescript
// Apenas ativos
const { data } = useTestimonials({ is_active: true });

// Por rating
const { data } = useTestimonials({ rating: 5 });

// Busca por texto
const { data } = useTestimonials({ search: 'pizza' });

// Combinados
const { data } = useTestimonials({ 
  is_active: true, 
  rating: 5,
  search: 'excelente'
});
```

---

## ⚡ Performance

### Cache Strategy

- **staleTime:** 5 minutos (padrão)
- **cacheTime:** 10 minutos
- **refetchOnWindowFocus:** true
- **retry:** 3 tentativas

### Invalidação Automática

Mutations invalidam automaticamente queries relacionadas:

```typescript
// Ao criar conteúdo, invalida:
- contentKeys.all
- contentKeys.bySection(section)

// Ao deletar galeria, invalida:
- galleryKeys.all
- galleryKeys.active
- galleryKeys.count
```

---

## 📊 Estados das Queries

```typescript
const { 
  data,           // Dados retornados
  isLoading,      // Primeira carga
  isFetching,     // Qualquer fetch (incluindo background)
  isError,        // Erro ocorreu
  error,          // Objeto de erro
  isSuccess,      // Sucesso
  refetch,        // Função para refetch manual
} = useContent();
```

---

## 📊 Estados das Mutations

```typescript
const mutation = useCreateTestimonial();

mutation.isPending    // Em andamento
mutation.isSuccess    // Sucesso
mutation.isError      // Erro
mutation.error        // Objeto de erro
mutation.data         // Dados retornados
mutation.reset()      // Resetar estado
```

---

## 🚀 Próximos Passos

- ✅ Fase 4 completa - API REST implementada
- ⏳ Fase 5 - Upload e gerenciamento de arquivos
- ⏳ Fase 6 - Interface administrativa completa
- ⏳ Fase 7 - Integração frontend com API
- ⏳ Fase 8 - Testes e validação

---

**Última atualização:** 15/10/2025  
**Versão:** 1.0.0
