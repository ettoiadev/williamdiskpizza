
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
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ef4444%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="flex justify-center lg:justify-start mb-6">
                <div className="relative">
                  <Pizza className="h-16 w-16 text-primary animate-bounce" />
                  <Flame className="h-6 w-6 text-orange-500 absolute -top-2 -right-2 animate-pulse" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
                <span className="pizza-text-gradient">William Disk Pizza</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-2xl animate-fade-in">
                As melhores pizzas da região há 32 anos! Ingredientes frescos, massa artesanal e 
                muito amor em cada fatia. Delivery rápido e sabor inesquecível.
              </p>
            </div>
            <div className="flex-1 animate-fade-in">
              <img
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop"
                alt="Deliciosa pizza William Disk Pizza"
                className="w-full h-80 lg:h-96 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
              />
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

      {/* Location Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Onde <span className="pizza-text-gradient">Estamos</span>
          </h2>
        </div>
        <div className="border-4 border-primary/60">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3661.4!2d-45.9658!3d-23.2955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cc4a7e7b7b7b7b%3A0x7b7b7b7b7b7b7b7b!2sR.%20Bernardino%20de%20Campos%2C%20143%20-%20Jacare%C3%AD%2C%20SP!5e0!3m2!1spt!2sbr!4v1234567890"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localização William Disk Pizza"
            className="w-full"
          ></iframe>
        </div>
      </section>

      <Testimonials />

      {/* CTA Section */}
      <section className="relative py-8 pizza-gradient text-white overflow-visible">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row items-end gap-8 lg:gap-12">
            <div className="flex-1 text-left py-8">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Peça já sua pizza!</h2>
              <p className="text-xl md:text-2xl opacity-90">Atendemos de terça a domingo, das 18h às 23h</p>
            </div>
            <div className="flex-1 relative lg:-mt-20 animate-fade-in">
              <img
                src="/lovable-uploads/edc27908-56a9-4a5b-9e5a-a0ac68a9e155.png"
                alt="Deliciosa pizza com ingredientes frescos"
                className="w-full h-80 lg:h-96 object-contain rounded-2xl relative z-10"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
