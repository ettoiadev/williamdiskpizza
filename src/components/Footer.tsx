import { Pizza, Phone, MapPin, Clock, Instagram, Facebook } from 'lucide-react';
const Footer = () => {
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
              Há 32 anos servindo as melhores pizzas da região com ingredientes 
              frescos e receitas tradicionais. Sua fome, nossa paixão!
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm">(12) 3951-7565 / 3961-3004 / 996367326 (WhatsApp) </span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm">R. Bernardino de Campos, 143 - Jacareí SP</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm">Ter-Dom: 18h às 23h</span>
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
              <a href="https://cardapiodigital.williamdiskpizza.com.br" target="_blank" rel="noopener noreferrer" className="block text-sm text-gray-300 hover:text-white transition-colors">Menu</a>
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