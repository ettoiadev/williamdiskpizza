/**
 * Settings Manager Page
 * 
 * Página para gerenciar configurações do site.
 * Organizado em abas: Geral, SEO, Tema.
 * 
 * @module pages/admin/SettingsManager
 */

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { useSettings, useUpsertManySettings } from '@/hooks/use-settings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageUpload } from '@/components/ImageUpload';
import { Loader2, Save, Settings, Palette, Search } from 'lucide-react';

/**
 * SettingsManager - Gerenciador de configurações
 */
export default function SettingsManager() {
  const [activeTab, setActiveTab] = useState('general');
  
  const { data: settings, isLoading } = useSettings();
  const updateMutation = useUpsertManySettings();

  const [formData, setFormData] = useState<Record<string, any>>({
    // Geral
    'site.title': '',
    'site.description': '',
    'site.email': '',
    'site.phone': '',
    'site.address': '',
    'site.whatsapp': '',
    'site.order_phone': '',
    
    // SEO
    'seo.meta_title': '',
    'seo.meta_description': '',
    'seo.og_image': '',
    'seo.keywords': '',
    
    // Tema
    'theme.primary_color': '#ef4444',
    'theme.secondary_color': '#fbbf24',
    'theme.logo_url': '',
    'theme.favicon_url': '',
  });

  // Carregar dados quando settings mudar
  useEffect(() => {
    if (settings) {
      const data: Record<string, any> = {};
      settings.forEach(setting => {
        data[setting.key] = setting.value;
      });
      setFormData(prev => ({ ...prev, ...data }));
    }
  }, [settings]);

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const updates = Object.entries(formData).map(([key, value]) => ({
      key,
      value,
      type: typeof value === 'string' && value.startsWith('http') ? 'image' : 'text',
    }));

    updateMutation.mutate(updates);
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
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600 mt-2">
            Configure informações gerais, SEO e tema do site
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">
              <Settings className="mr-2 h-4 w-4" />
              Geral
            </TabsTrigger>
            <TabsTrigger value="seo">
              <Search className="mr-2 h-4 w-4" />
              SEO
            </TabsTrigger>
            <TabsTrigger value="theme">
              <Palette className="mr-2 h-4 w-4" />
              Tema
            </TabsTrigger>
          </TabsList>

          {/* Aba Geral */}
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informações Gerais</CardTitle>
                <CardDescription>
                  Informações básicas do site e contato
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="site-title">Título do Site</Label>
                  <Input
                    id="site-title"
                    value={formData['site.title'] || ''}
                    onChange={(e) => handleChange('site.title', e.target.value)}
                    placeholder="William Disk Pizza"
                  />
                </div>

                <div>
                  <Label htmlFor="site-description">Descrição</Label>
                  <Textarea
                    id="site-description"
                    value={formData['site.description'] || ''}
                    onChange={(e) => handleChange('site.description', e.target.value)}
                    placeholder="Descrição do site..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="site-email">Email</Label>
                    <Input
                      id="site-email"
                      type="email"
                      value={formData['site.email'] || ''}
                      onChange={(e) => handleChange('site.email', e.target.value)}
                      placeholder="contato@exemplo.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="site-phone">Telefone</Label>
                    <Input
                      id="site-phone"
                      value={formData['site.phone'] || ''}
                      onChange={(e) => handleChange('site.phone', e.target.value)}
                      placeholder="(12) 3951-7565"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="site-whatsapp">WhatsApp (com código do país)</Label>
                  <Input
                    id="site-whatsapp"
                    value={formData['site.whatsapp'] || ''}
                    onChange={(e) => handleChange('site.whatsapp', e.target.value)}
                    placeholder="5512996367326"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Usado no botão flutuante de WhatsApp
                  </p>
                </div>

                <div>
                  <Label htmlFor="site-order-phone">Telefone para Pedidos (com código do país)</Label>
                  <Input
                    id="site-order-phone"
                    value={formData['site.order_phone'] || ''}
                    onChange={(e) => handleChange('site.order_phone', e.target.value)}
                    placeholder="+551239517565"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Usado no botão "Fazer Pedido" do menu superior
                  </p>
                </div>

                <div>
                  <Label htmlFor="site-address">Endereço</Label>
                  <Input
                    id="site-address"
                    value={formData['site.address'] || ''}
                    onChange={(e) => handleChange('site.address', e.target.value)}
                    placeholder="R. Bernardino de Campos, 143 - Jacareí SP"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba SEO */}
          <TabsContent value="seo" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Otimização para Motores de Busca</CardTitle>
                <CardDescription>
                  Configure meta tags e imagens para redes sociais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="seo-title">Meta Title</Label>
                  <Input
                    id="seo-title"
                    value={formData['seo.meta_title'] || ''}
                    onChange={(e) => handleChange('seo.meta_title', e.target.value)}
                    placeholder="William Disk Pizza - As melhores pizzas de Jacareí"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recomendado: 50-60 caracteres
                  </p>
                </div>

                <div>
                  <Label htmlFor="seo-description">Meta Description</Label>
                  <Textarea
                    id="seo-description"
                    value={formData['seo.meta_description'] || ''}
                    onChange={(e) => handleChange('seo.meta_description', e.target.value)}
                    placeholder="Pizzas artesanais com ingredientes frescos..."
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recomendado: 150-160 caracteres
                  </p>
                </div>

                <div>
                  <Label htmlFor="seo-keywords">Palavras-chave (separadas por vírgula)</Label>
                  <Input
                    id="seo-keywords"
                    value={formData['seo.keywords'] || ''}
                    onChange={(e) => handleChange('seo.keywords', e.target.value)}
                    placeholder="pizza, delivery, jacareí, pizzaria"
                  />
                </div>

                <div>
                  <Label>Imagem Open Graph (compartilhamento em redes sociais)</Label>
                  <Input
                    value={formData['seo.og_image'] || ''}
                    onChange={(e) => handleChange('seo.og_image', e.target.value)}
                    placeholder="URL da imagem"
                    className="mb-2"
                  />
                  <ImageUpload
                    multiple={false}
                    folder="seo"
                    buttonText="Enviar imagem OG"
                    onUploadComplete={(urls) => {
                      if (urls && urls[0]) {
                        handleChange('seo.og_image', urls[0]);
                      }
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Recomendado: 1200x630px (formato 1.91:1)
                  </p>
                  {formData['seo.og_image'] && (
                    <div className="mt-3">
                      <img
                        src={formData['seo.og_image']}
                        alt="Preview OG"
                        className="w-full max-w-md rounded-lg border"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Tema */}
          <TabsContent value="theme" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Identidade Visual</CardTitle>
                <CardDescription>
                  Personalize cores, logo e favicon do site
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Cores */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Cores</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="theme-primary">Cor Primária</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="theme-primary"
                          type="color"
                          value={formData['theme.primary_color'] || '#ef4444'}
                          onChange={(e) => handleChange('theme.primary_color', e.target.value)}
                          className="w-20 h-10"
                        />
                        <Input
                          value={formData['theme.primary_color'] || '#ef4444'}
                          onChange={(e) => handleChange('theme.primary_color', e.target.value)}
                          placeholder="#ef4444"
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="theme-secondary">Cor Secundária</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="theme-secondary"
                          type="color"
                          value={formData['theme.secondary_color'] || '#fbbf24'}
                          onChange={(e) => handleChange('theme.secondary_color', e.target.value)}
                          className="w-20 h-10"
                        />
                        <Input
                          value={formData['theme.secondary_color'] || '#fbbf24'}
                          onChange={(e) => handleChange('theme.secondary_color', e.target.value)}
                          placeholder="#fbbf24"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preview de cores */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium mb-2">Preview:</p>
                    <div className="flex gap-2">
                      <div
                        className="w-16 h-16 rounded-lg shadow-sm"
                        style={{ backgroundColor: formData['theme.primary_color'] }}
                      />
                      <div
                        className="w-16 h-16 rounded-lg shadow-sm"
                        style={{ backgroundColor: formData['theme.secondary_color'] }}
                      />
                    </div>
                  </div>
                </div>

                {/* Logo */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Logo</h3>
                  <Input
                    value={formData['theme.logo_url'] || ''}
                    onChange={(e) => handleChange('theme.logo_url', e.target.value)}
                    placeholder="URL do logo"
                    className="mb-2"
                  />
                  <ImageUpload
                    multiple={false}
                    folder="theme"
                    buttonText="Enviar logo"
                    onUploadComplete={(urls) => {
                      if (urls && urls[0]) {
                        handleChange('theme.logo_url', urls[0]);
                      }
                    }}
                  />
                  <p className="text-xs text-gray-500">
                    Recomendado: PNG transparente, 200x60px
                  </p>
                  {formData['theme.logo_url'] && (
                    <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium mb-2">Preview:</p>
                      <img
                        src={formData['theme.logo_url']}
                        alt="Logo preview"
                        className="h-16 object-contain"
                      />
                    </div>
                  )}
                </div>

                {/* Favicon */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Favicon</h3>
                  <Input
                    value={formData['theme.favicon_url'] || ''}
                    onChange={(e) => handleChange('theme.favicon_url', e.target.value)}
                    placeholder="URL do favicon"
                    className="mb-2"
                  />
                  <ImageUpload
                    multiple={false}
                    folder="theme"
                    buttonText="Enviar favicon"
                    onUploadComplete={(urls) => {
                      if (urls && urls[0]) {
                        handleChange('theme.favicon_url', urls[0]);
                      }
                    }}
                  />
                  <p className="text-xs text-gray-500">
                    Recomendado: PNG ou ICO, 32x32px ou 64x64px
                  </p>
                  {formData['theme.favicon_url'] && (
                    <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium mb-2">Preview:</p>
                      <img
                        src={formData['theme.favicon_url']}
                        alt="Favicon preview"
                        className="h-8 w-8 object-contain"
                      />
                    </div>
                  )}
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
                Salvar Configurações
              </>
            )}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
