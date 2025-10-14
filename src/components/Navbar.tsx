
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/images/0224011b-9067-486b-a363-2b2b99b36403.png" 
                alt="William Disk Pizza Logo" 
                className="h-10 w-10 object-contain"
              />
              <span className="font-bold text-xl pizza-text-gradient">
                William Disk Pizza
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-primary bg-primary/10' 
                  : 'text-gray-700 hover:text-primary hover:bg-primary/5'
              }`}
            >
              Início
            </Link>
            <Link
              to="/sobre"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/sobre') 
                  ? 'text-primary bg-primary/10' 
                  : 'text-gray-700 hover:text-primary hover:bg-primary/5'
              }`}
            >
              Quem Somos
            </Link>
            <a
              href="https://cardapiodigital.williamdiskpizza.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors flex items-center gap-1"
            >
              Menu
              <ExternalLink className="h-3 w-3" />
            </a>
            <Link
              to="/contato"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/contato') 
                  ? 'text-primary bg-primary/10' 
                  : 'text-gray-700 hover:text-primary hover:bg-primary/5'
              }`}
            >
              Contato
            </Link>
            <Button 
              className="pizza-gradient text-white hover:opacity-90"
              asChild
            >
              <a href="tel:+551239517565">Fazer Pedido</a>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-primary focus:outline-none focus:text-primary"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link
                to="/"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-primary bg-primary/10' 
                    : 'text-gray-700 hover:text-primary hover:bg-primary/5'
                }`}
                onClick={toggleMenu}
              >
                Início
              </Link>
              <Link
                to="/sobre"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/sobre') 
                    ? 'text-primary bg-primary/10' 
                    : 'text-gray-700 hover:text-primary hover:bg-primary/5'
                }`}
                onClick={toggleMenu}
              >
                Quem Somos
              </Link>
              <a
                href="https://cardapiodigital.williamdiskpizza.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors"
                onClick={toggleMenu}
              >
                Menu
              </a>
              <Link
                to="/contato"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/contato') 
                    ? 'text-primary bg-primary/10' 
                    : 'text-gray-700 hover:text-primary hover:bg-primary/5'
                }`}
                onClick={toggleMenu}
              >
                Contato
              </Link>
              <div className="px-3 py-2">
                <Button 
                  className="w-full pizza-gradient text-white hover:opacity-90"
                  asChild
                >
                  <a href="tel:+551239517565">Fazer Pedido</a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
