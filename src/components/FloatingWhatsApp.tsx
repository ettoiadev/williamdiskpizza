
import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const FloatingWhatsApp = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const whatsappNumber = "5512996367326"; // Número do WhatsApp
  const defaultMessage = "Olá! Gostaria de fazer um pedido de pizza.";

  const openWhatsApp = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      {/* Botão Principal */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
          size="icon"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </div>

      {/* Menu Expandido */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-40 bg-white rounded-lg shadow-xl border p-4 min-w-72 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">William Disk Pizza</h3>
              <p className="text-sm text-gray-600">Online agora</p>
            </div>
          </div>
          
          <p className="text-sm text-gray-700 mb-4">
            Olá! 👋 Como podemos ajudar você hoje?
          </p>
          
          <div className="space-y-2">
            <Button
              onClick={openWhatsApp}
              className="w-full bg-green-500 hover:bg-green-600 text-white text-sm"
            >
              💬 Fazer Pedido
            </Button>
            <Button
              onClick={() => {
                const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Gostaria de saber sobre o cardápio e preços.")}`;
                window.open(url, '_blank');
              }}
              variant="outline"
              className="w-full border-green-500 text-green-600 hover:bg-green-50 text-sm"
            >
              📋 Ver Cardápio
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 mt-3 text-center">
            Resposta em poucos minutos
          </p>
        </div>
      )}
    </>
  );
};

export default FloatingWhatsApp;
