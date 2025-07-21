import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Pizza, Clock, Star, Phone, MapPin, Heart } from 'lucide-react';
const Index = () => {
  return <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 to-primary/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Pizza className="h-16 w-16 text-primary animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="pizza-text-gradient">William Disk Pizza</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              As melhores pizzas da região! Ingredientes frescos, massa artesanal e 
              muito amor em cada fatia. Delivery rápido e sabor inesquecível.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="pizza-gradient text-white hover:opacity-90 text-lg px-8 py-3" asChild>
                <a href="tel:+551239517565">
                  <Phone className="mr-2 h-5 w-5" />
                  Fazer Pedido Agora
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white text-lg px-8 py-3" onClick={() => window.open('https://cardapiodigital.williamdiskpizza.com.br', '_blank')}>
                Ver Menu Completo
              </Button>
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
            <Card className="text-center hover:shadow-lg transition-shadow">
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

            <Card className="text-center hover:shadow-lg transition-shadow">
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

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Tradição Familiar</h3>
                <p className="text-gray-600">
                  Mais de 10 anos servindo pizzas com receitas especiais da família. 
                  Tradição e sabor únicos!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Nossas <span className="pizza-text-gradient">Especialidades</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[{
            name: 'Pizza Margherita',
            desc: 'Tradicional com manjericão fresco'
          }, {
            name: 'Pizza Pepperoni',
            desc: 'Clássica americana com muito sabor'
          }, {
            name: 'Pizza Quatro Queijos',
            desc: 'Mix perfeito dos melhores queijos'
          }, {
            name: 'Pizza Portuguesa',
            desc: 'Completa com ingredientes especiais'
          }].map((pizza, index) => <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="w-full h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg mb-4 flex items-center justify-center">
                    <Pizza className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{pizza.name}</h3>
                  <p className="text-sm text-gray-600">{pizza.desc}</p>
                </CardContent>
              </Card>)}
          </div>
          <div className="text-center mt-8">
            <Button className="pizza-gradient text-white hover:opacity-90" onClick={() => window.open('https://cardapiodigital.williamdiskpizza.com.br', '_blank')}>
              Ver Menu Completo
            </Button>
          </div>
        </div>
      </section>

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
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-3" asChild>
              <a href="tel:+551239517565">
                <Phone className="mr-2 h-5 w-5" />
                Ligar Agora
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Index;