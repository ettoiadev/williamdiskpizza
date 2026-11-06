/**
 * Content Manager Page
 * 
 * Página para editar todo o conteúdo dinâmico do site.
 * Organizado por seções com formulários específicos.
 * 
 * @module pages/admin/ContentManager
 */

import { useState, useEffect, useRef } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { useContentBySection, useUpsertManyContent } from '@/hooks/use-content';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Save } from 'lucide-react';
import { CMS_SECTIONS } from '@/config/constants';
import { ImageUpload } from '@/components/ImageUpload';
import { RichTextEditor } from '@/components/RichTextEditor';

/**
 * ContentManager - Gerenciador de conteúdo
 */
export default function ContentManager() {
  const [activeSection, setActiveSection] = useState('hero');
  
  const { data: sectionData, isLoading } = useContentBySection(activeSection);
  const updateMutation = useUpsertManyContent();

  const [formData, setFormData] = useState<Record<string, any>>({});

  // Rastreia qual seção já foi carregada no formulário.
  // Evita que os refetches em segundo plano do React Query
  // (refetchInterval / refetchOnWindowFocus) sobrescrevam edições
  // não salvas, o que deixava os campos "travados" no valor do banco.
  const loadedSectionRef = useRef<string | null>(null);

  // Ao trocar de seção, libera o recarregamento dos dados da nova seção.
  useEffect(() => {
    loadedSectionRef.current = null;
  }, [activeSection]);

  // Popula o formData apenas na primeira vez que os dados da seção ativa
  // chegam. Refetches posteriores não apagam o que o usuário digitou.
  useEffect(() => {
    if (sectionData && loadedSectionRef.current !== activeSection) {
      const data: Record<string, any> = {};
      sectionData.forEach(item => {
        data[item.key] = item.value;
      });
      setFormData(data);
      loadedSectionRef.current = activeSection;
    }
  }, [sectionData, activeSection]);

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  /**
   * Validar URL
   */
  const isValidUrl = (string: string): boolean => {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  /**
   * Salvar alterações com validação
   */
  const handleSave = () => {
    try {
      // ✅ Filtrar e validar entradas
      const updates = Object.entries(formData)
        .filter(([_, value]) => {
          // Remover apenas valores nulos ou undefined.
          // Strings vazias SÃO permitidas, para que o usuário consiga
          // limpar/apagar o conteúdo de um campo e salvar essa alteração.
          if (value === null || value === undefined) return false;
          return true;
        })
        .map(([key, value]) => {
          // Determinar tipo baseado no valor com validação
          let type: 'text' | 'image' | 'json' | 'number' = 'text';
          let processedValue = value;
          
          if (typeof value === 'number') {
            // ✅ Validar número
            if (!isNaN(value) && isFinite(value)) {
              type = 'number';
            } else {
              throw new Error(`Campo "${key}" contém número inválido`);
            }
          } else if (typeof value === 'object' && value !== null) {
            // ✅ Validar objeto (não aceitar arrays vazios)
            if (Array.isArray(value)) {
              if (value.length === 0) {
                throw new Error(`Campo "${key}" contém array vazio`);
              }
            }
            type = 'json';
          } else if (typeof value === 'string') {
            const trimmedValue = value.trim();
            
            // ✅ Validar tamanho (limite de 50KB)
            const sizeInBytes = new Blob([trimmedValue]).size;
            if (sizeInBytes > 50000) {
              throw new Error(`Campo "${key}" excede limite de 50KB (tamanho: ${Math.round(sizeInBytes / 1024)}KB)`);
            }
            
            // ✅ Validar URL corretamente
            if (trimmedValue.startsWith('http://') || trimmedValue.startsWith('https://')) {
              if (isValidUrl(trimmedValue)) {
                type = 'image';
              } else {
                throw new Error(`Campo "${key}" contém URL inválida: ${trimmedValue}`);
              }
            }
            
            processedValue = trimmedValue;
          }

          return {
            section: activeSection,
            key,
            value: processedValue,
            type,
          };
        });

      // ✅ Verificar se há alterações para salvar
      if (updates.length === 0) {
        console.warn('[ContentManager] Nenhuma alteração válida para salvar');
        return;
      }

      console.log('[ContentManager] Salvando', updates.length, 'itens');
      updateMutation.mutate(updates);
    } catch (error) {
      console.error('[ContentManager] Erro ao validar dados:', error);
      // Mostrar erro ao usuário
      alert(error instanceof Error ? error.message : 'Erro ao validar dados');
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gerenciar Conteúdo
          </h1>
          <p className="text-gray-600 mt-2">
            Edite textos, imagens e informações do site
          </p>
        </div>

        {/* Tabs por Seção */}
        <Tabs value={activeSection} onValueChange={setActiveSection}>
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="about">Sobre</TabsTrigger>
            <TabsTrigger value="contact">Contato</TabsTrigger>
            <TabsTrigger value="business_hours">Horário</TabsTrigger>
            <TabsTrigger value="promo_banner">Promo</TabsTrigger>
            <TabsTrigger value="social_links">Social</TabsTrigger>
          </TabsList>

          {/* Hero Section */}
          <TabsContent value="hero" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Seção Hero (Banner Principal)</CardTitle>
                <CardDescription>
                  Conteúdo exibido no topo da página inicial
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="hero-title">Título</Label>
                  <Input
                    id="hero-title"
                    value={formData.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="William Disk Pizza"
                  />
                </div>
                
                <div>
                  <Label htmlFor="hero-subtitle">Subtítulo</Label>
                  <Textarea
                    id="hero-subtitle"
                    value={formData.subtitle || ''}
                    onChange={(e) => handleChange('subtitle', e.target.value)}
                    placeholder="Descrição da pizzaria..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="hero-image">URL da Imagem</Label>
                  <Input
                    id="hero-image"
                    value={formData.image_url || ''}
                    onChange={(e) => handleChange('image_url', e.target.value)}
                    placeholder="/images/hero.png"
                  />
                  {/* Upload de imagem para preencher automaticamente a URL */}
                  <div className="mt-3">
                    <ImageUpload
                      multiple={false}
                      folder="hero"
                      buttonText="Enviar imagem"
                      onUploadComplete={(urls) => {
                        if (urls && urls[0]) {
                          handleChange('image_url', urls[0]);
                        }
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats Section */}
          <TabsContent value="stats" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
                <CardDescription>
                  Números exibidos abaixo do hero
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stats-years">Anos de Tradição</Label>
                  <Input
                    id="stats-years"
                    type="number"
                    value={formData.years || 35}
                    onChange={(e) => handleChange('years', parseInt(e.target.value))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="stats-clients">Clientes</Label>
                  <Input
                    id="stats-clients"
                    value={formData.clients || ''}
                    onChange={(e) => handleChange('clients', e.target.value)}
                    placeholder="+10k"
                  />
                </div>
                
                <div>
                  <Label htmlFor="stats-delivery">Tempo de Entrega</Label>
                  <Input
                    id="stats-delivery"
                    value={formData.delivery_time || ''}
                    onChange={(e) => handleChange('delivery_time', e.target.value)}
                    placeholder="30min"
                  />
                </div>
                
                <div>
                  <Label htmlFor="stats-rating">Avaliação</Label>
                  <Input
                    id="stats-rating"
                    value={formData.rating || ''}
                    onChange={(e) => handleChange('rating', e.target.value)}
                    placeholder="4.9★"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Section */}
          <TabsContent value="contact" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informações de Contato</CardTitle>
                <CardDescription>
                  Telefones, email e endereço
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="contact-phone">Telefone Principal</Label>
                  <Input
                    id="contact-phone"
                    value={formData.phone_primary || ''}
                    onChange={(e) => handleChange('phone_primary', e.target.value)}
                    placeholder="(12) 3951-7565"
                  />
                </div>
                
                <div>
                  <Label htmlFor="contact-phone2">Telefone Secundário</Label>
                  <Input
                    id="contact-phone2"
                    value={formData.phone_secondary || ''}
                    onChange={(e) => handleChange('phone_secondary', e.target.value)}
                    placeholder="(12) 3961-3004"
                  />
                </div>
                
                <div>
                  <Label htmlFor="contact-whatsapp">WhatsApp</Label>
                  <Input
                    id="contact-whatsapp"
                    value={formData.whatsapp || ''}
                    onChange={(e) => handleChange('whatsapp', e.target.value)}
                    placeholder="5512996367326"
                  />
                </div>
                
                <div>
                  <Label htmlFor="contact-email">Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="contato@williamdiskpizza.com.br"
                  />
                </div>
                
                <div>
                  <Label htmlFor="contact-address">Endereço</Label>
                  <Input
                    id="contact-address"
                    value={formData.address || ''}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="R. Bernardino de Campos, 143"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Section */}
          <TabsContent value="features" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Diferenciais (Features)</CardTitle>
                <CardDescription>
                  Três principais características da pizzaria
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Feature 1 */}
                <div className="p-4 border rounded-lg space-y-3">
                  <h4 className="font-semibold text-sm text-gray-700">Feature 1</h4>
                  <div>
                    <Label htmlFor="feature1-title">Título</Label>
                    <Input
                      id="feature1-title"
                      value={formData.feature1_title || ''}
                      onChange={(e) => handleChange('feature1_title', e.target.value)}
                      placeholder="Entrega Rápida"
                    />
                  </div>
                  <div>
                    <Label htmlFor="feature1-description">Descrição</Label>
                    <Textarea
                      id="feature1-description"
                      value={formData.feature1_description || ''}
                      onChange={(e) => handleChange('feature1_description', e.target.value)}
                      placeholder="Delivery em até 30 minutos..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="p-4 border rounded-lg space-y-3">
                  <h4 className="font-semibold text-sm text-gray-700">Feature 2</h4>
                  <div>
                    <Label htmlFor="feature2-title">Título</Label>
                    <Input
                      id="feature2-title"
                      value={formData.feature2_title || ''}
                      onChange={(e) => handleChange('feature2_title', e.target.value)}
                      placeholder="Ingredientes Frescos"
                    />
                  </div>
                  <div>
                    <Label htmlFor="feature2-description">Descrição</Label>
                    <Textarea
                      id="feature2-description"
                      value={formData.feature2_description || ''}
                      onChange={(e) => handleChange('feature2_description', e.target.value)}
                      placeholder="Selecionamos os melhores ingredientes..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="p-4 border rounded-lg space-y-3">
                  <h4 className="font-semibold text-sm text-gray-700">Feature 3</h4>
                  <div>
                    <Label htmlFor="feature3-title">Título</Label>
                    <Input
                      id="feature3-title"
                      value={formData.feature3_title || ''}
                      onChange={(e) => handleChange('feature3_title', e.target.value)}
                      placeholder="Tradição Familiar"
                    />
                  </div>
                  <div>
                    <Label htmlFor="feature3-description">Descrição</Label>
                    <Textarea
                      id="feature3-description"
                      value={formData.feature3_description || ''}
                      onChange={(e) => handleChange('feature3_description', e.target.value)}
                      placeholder="35 anos servindo pizzas..."
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Section */}
          <TabsContent value="about" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sobre a Pizzaria</CardTitle>
                <CardDescription>
                  História e informações sobre o negócio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="about-title">Título</Label>
                  <Input
                    id="about-title"
                    value={formData.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Nossa História"
                  />
                </div>
                
                <div>
                  <Label htmlFor="about-subtitle">Subtítulo</Label>
                  <Textarea
                    id="about-subtitle"
                    value={formData.subtitle || ''}
                    onChange={(e) => handleChange('subtitle', e.target.value)}
                    placeholder="Uma história de paixão, tradição e muito sabor que começou há 35 anos"
                    rows={2}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Aparece no topo da página Sobre e no rodapé do site
                  </p>
                </div>
                
                <div>
                  <Label>Descrição</Label>
                  <div className="mt-2">
                    <RichTextEditor
                      value={formData.description || ''}
                      onChange={(value) => handleChange('description', value)}
                      placeholder="Conte a história da pizzaria..."
                      minHeight="300px"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Use a barra de ferramentas para formatar o texto: negrito, itálico, listas, etc.
                  </p>
                </div>

                <div>
                  <Label htmlFor="about-image">URL da Imagem</Label>
                  <Input
                    id="about-image"
                    value={formData.image_url || ''}
                    onChange={(e) => handleChange('image_url', e.target.value)}
                    placeholder="/images/about.jpg"
                  />
                  <div className="mt-3">
                    <ImageUpload
                      multiple={false}
                      folder="about"
                      buttonText="Enviar imagem"
                      onUploadComplete={(urls) => {
                        if (urls && urls[0]) {
                          handleChange('image_url', urls[0]);
                        }
                      }}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="about-mission">Missão</Label>
                  <Textarea
                    id="about-mission"
                    value={formData.mission || ''}
                    onChange={(e) => handleChange('mission', e.target.value)}
                    placeholder="Proporcionar momentos únicos através do sabor autêntico das nossas pizzas..."
                    rows={4}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Aparece na seção "Nossa Missão" da página Sobre
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Hours */}
          <TabsContent value="business_hours" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Horário de Funcionamento</CardTitle>
                <CardDescription>
                  Dias e horários de atendimento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="hours-days">Dias</Label>
                  <Input
                    id="hours-days"
                    value={formData.days || ''}
                    onChange={(e) => handleChange('days', e.target.value)}
                    placeholder="Terça a Domingo"
                  />
                </div>
                
                <div>
                  <Label htmlFor="hours-time">Horário</Label>
                  <Input
                    id="hours-time"
                    value={formData.hours || ''}
                    onChange={(e) => handleChange('hours', e.target.value)}
                    placeholder="18:00 às 23:00"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Promo Banner */}
          <TabsContent value="promo_banner" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Banner Promocional</CardTitle>
                <CardDescription>
                  Banner de promoção exibido no topo do site
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    id="promo-active"
                    checked={formData.is_active || false}
                    onChange={(e) => handleChange('is_active', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="promo-active" className="cursor-pointer">
                    Exibir banner promocional
                  </Label>
                </div>

                <div>
                  <Label htmlFor="promo-text">Texto da Promoção</Label>
                  <Input
                    id="promo-text"
                    value={formData.text || ''}
                    onChange={(e) => handleChange('text', e.target.value)}
                    placeholder="Escreva aqui sua promoção"
                  />
                </div>

                <div>
                  <Label htmlFor="promo-link">Link (opcional)</Label>
                  <Input
                    id="promo-link"
                    value={formData.link || ''}
                    onChange={(e) => handleChange('link', e.target.value)}
                    placeholder="https://cardapiodigital.williamdiskpizza.com.br"
                  />
                </div>

                <div>
                  <Label htmlFor="promo-bg-color">Cor de Fundo</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="color"
                      value={formData.bg_color || '#ef4444'}
                      onChange={(e) => handleChange('bg_color', e.target.value)}
                      className="w-20 h-10"
                    />
                    <Input
                      value={formData.bg_color || '#ef4444'}
                      onChange={(e) => handleChange('bg_color', e.target.value)}
                      placeholder="#ef4444"
                      className="flex-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Links */}
          <TabsContent value="social_links" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Redes Sociais</CardTitle>
                <CardDescription>
                  Links para redes sociais e WhatsApp
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="social-facebook">Facebook</Label>
                  <Input
                    id="social-facebook"
                    value={formData.facebook || ''}
                    onChange={(e) => handleChange('facebook', e.target.value)}
                    placeholder="https://facebook.com/williamdiskpizza"
                  />
                </div>

                <div>
                  <Label htmlFor="social-instagram">Instagram</Label>
                  <Input
                    id="social-instagram"
                    value={formData.instagram || ''}
                    onChange={(e) => handleChange('instagram', e.target.value)}
                    placeholder="https://instagram.com/williamdiskpizza"
                  />
                </div>

                <div>
                  <Label htmlFor="social-whatsapp">WhatsApp (número com código do país)</Label>
                  <Input
                    id="social-whatsapp"
                    value={formData.whatsapp || ''}
                    onChange={(e) => handleChange('whatsapp', e.target.value)}
                    placeholder="5512996367326"
                  />
                </div>

                <div>
                  <Label htmlFor="social-phone">Telefone para exibição</Label>
                  <Input
                    id="social-phone"
                    value={formData.phone || ''}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="(12) 99636-7326"
                  />
                </div>

                <div>
                  <Label htmlFor="social-menu-url">Link do Cardápio Digital</Label>
                  <Input
                    id="social-menu-url"
                    value={formData.menu_url || ''}
                    onChange={(e) => handleChange('menu_url', e.target.value)}
                    placeholder="https://cardapiodigital.williamdiskpizza.com.br"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Botão Salvar */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            size="lg"
            className="min-w-[200px]"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
