
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Gallery from '@/components/Gallery';
import Testimonials from '@/components/Testimonials';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import PromoBanner from '@/components/PromoBanner';
import { Pizza, Clock, Star, Phone, MapPin, Heart, Award, Users, Flame } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <PromoBanner />
      <Navbar />
      <FloatingWhatsApp />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 to-primary/5 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ef4444" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Pizza className="h-16 w-16 text-primary animate-bounce" />
                <Flame className="h-6 w-6 text-orange-500 absolute -top-2 -right-2 animate-pulse" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              <span className="pizza-text-gradient">William Disk Pizza</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto animate-fade-in">
              As melhores pizzas da região há 32 anos! Ingredientes frescos, massa artesanal e 
              muito amor em cada fatia. Delivery rápido e sabor inesquecível.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Button size="lg" className="pizza-gradient text-white hover:opacity-90 text-lg px-8 py-3 hover:scale-105 transition-transform" asChild>
                <a href="tel:+551239517565">
                  <Phone className="mr-2 h-5 w-5" />
                  Fazer Pedido Agora
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white text-lg px-8 py-3 hover:scale-105 transition-transform" onClick={() => window.open('https://cardapiodigital.williamdiskpizza.com.br', '_blank')}>
                Ver Menu Completo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-3xl font-bold text-primary mb-2">32</div>
              <div className="text-sm text-gray-600">Anos de Tradição</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-3xl font-bold text-primary mb-2">+10k</div>
              <div className="text-sm text-gray-600">Clientes Felizes</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-3xl font-bold text-primary mb-2">30min</div>
              <div className="text-sm text-gray-600">Entrega Rápida</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-3xl font-bold text-primary mb-2">4.9★</div>
              <div className="text-sm text-gray-600">Avaliação</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Por que escolher a <span className="pizza-text-gradient">William Disk Pizza?</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Entrega Rápida</h3>
                <p className="text-gray-600">
                  Delivery em até 30 minutos para toda a região. Sua pizza quentinha 
                  direto no seu endereço!
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Ingredientes Frescos</h3>
                <p className="text-gray-600">
                  Selecionamos os melhores ingredientes diariamente. Qualidade 
                  que você pode sentir em cada mordida.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Tradição Familiar</h3>
                <p className="text-gray-600">
                  32 anos servindo pizzas com receitas especiais da família. 
                  Tradição e sabor únicos!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Specialties Section com imagens melhoradas */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Nossas <span className="pizza-text-gradient">Especialidades</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Pizza Margherita',
                desc: 'Tradicional com manjericão fresco',
                image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=200&fit=crop',
                price: 'A partir de R$ 35,90'
              },
              {
                name: 'Pizza Pepperoni',
                desc: 'Clássica americana com muito sabor',
                image: 'https://images.unsplash.com/photo-1520201163981-8cc95007dd2a?w=300&h=200&fit=crop',
                price: 'A partir de R$ 42,90'
              },
              {
                name: 'Pizza Quatro Queijos',
                desc: 'Mix perfeito dos melhores queijos',
                image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=300&h=200&fit=crop',
                price: 'A partir de R$ 45,90'
              },
              {
                name: 'Pizza Portuguesa',
                desc: 'Completa com ingredientes especiais',
                image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300&h=200&fit=crop',
                price: 'A partir de R$ 48,90'
              }
            ].map((pizza, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105 group overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <img
                      src={pizza.image}
                      alt={pizza.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{pizza.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{pizza.desc}</p>
                    <p className="text-primary font-bold">{pizza.price}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button className="pizza-gradient text-white hover:opacity-90 hover:scale-105 transition-transform" onClick={() => window.open('https://cardapiodigital.williamdiskpizza.com.br', '_blank')}>
              Ver Menu Completo
            </Button>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <Gallery />

      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <section className="py-16 pizza-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Peça já sua pizza!</h2>
          <p className="text-xl mb-8 opacity-90">Atendemos de terça a domingo, das 18h às 23h</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              <span className="text-lg font-semibold">(12) 3951-7565 / 3961-3004 / 99636-7326 (WhatsApp)</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>R. Bernardino de Campos, 143 - Jacareí SP</span>
            </div>
          </div>
          <div className="mt-6">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-3 hover:scale-105 transition-transform" asChild>
              <a href="tel:+551239517565">
                <Phone className="mr-2 h-5 w-5" />
                Ligar Agora
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
