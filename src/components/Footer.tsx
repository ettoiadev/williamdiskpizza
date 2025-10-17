import { Pizza, Phone, MapPin, Clock, Instagram, Facebook } from 'lucide-react';
import { useContentBySection } from '@/hooks/use-content';

const Footer = () => {
  // Buscar dados dinâmicos
  const { data: aboutData } = useContentBySection('about');
  const { data: contactData } = useContentBySection('contact');
  const { data: businessHoursData } = useContentBySection('business_hours');
  const { data: socialLinksData } = useContentBySection('social_links');
  
  // Função helper para pegar valor do conteúdo
  const getContent = (data: any[] | undefined, key: string, fallback: any = '') => {
    if (!data) return fallback;
    const item = data.find(i => i.key === key);
    return item?.value ?? fallback;
  };

  return <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Pizza className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl">William Disk Pizza</span>
            </div>
            <p className="text-gray-300 text-sm">
              {getContent(aboutData, 'subtitle', 'Há 35 anos servindo as melhores pizzas da região com ingredientes frescos e receitas tradicionais.')}
            </p>
            <div className="flex space-x-4">
              {getContent(socialLinksData, 'instagram', '') && (
                <a 
                  href={getContent(socialLinksData, 'instagram', '#')} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {getContent(socialLinksData, 'facebook', '') && (
                <a 
                  href={getContent(socialLinksData, 'facebook', '#')} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm">
                  {getContent(contactData, 'phone_primary', '(12) 3951-7565')} / {getContent(contactData, 'phone_secondary', '3961-3004')} / {getContent(contactData, 'whatsapp', '996367326')} (WhatsApp)
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm">{getContent(contactData, 'address', 'R. Bernardino de Campos, 143 - Jacareí SP')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm">{getContent(businessHoursData, 'days', 'Ter-Dom')}: {getContent(businessHoursData, 'hours', '18h às 23h')}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Links Rápidos</h3>
            <div className="space-y-2">
              <a href="/" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Início
              </a>
              <a href="/sobre" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Quem Somos
              </a>
              <a 
                href={getContent(socialLinksData, 'menu_url', 'https://cardapiodigital.williamdiskpizza.com.br')} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block text-sm text-gray-300 hover:text-white transition-colors"
              >
                Menu
              </a>
              <a href="/contato" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Contato
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">© 2025 William Disk Pizza. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;