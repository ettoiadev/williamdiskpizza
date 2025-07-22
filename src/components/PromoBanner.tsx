
import { useState, useEffect } from 'react';
import { X, Clock, Pizza } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PromoBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Mostra o banner após 3 segundos na página
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-white p-4 shadow-lg animate-slide-in-down">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Pizza className="h-6 w-6 animate-pulse" />
          <div>
            <p className="font-bold">🍕 PROMOÇÃO ESPECIAL!</p>
            <p className="text-sm opacity-90">
              2 Pizzas Grandes por apenas R$ 89,90 • Válido até domingo
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            <span>Oferta limitada</span>
          </div>
          
          <Button
            size="sm"
            variant="secondary"
            className="bg-white text-primary hover:bg-gray-100"
            asChild
          >
            <a href="tel:+551239517565">
              Aproveitar
            </a>
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/20 p-1"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
