
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Phone, MapPin, Clock, Mail, MessageSquare, Instagram, Facebook } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    toast({
      title: "Mensagem enviada!",
      description: "Entraremos em contato em breve. Obrigado!",
    });
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <MessageSquare className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Entre em <span className="pizza-text-gradient">Contato</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Estamos aqui para atender você! Faça seu pedido ou tire suas dúvidas
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info & Form Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-8">
                  Fale <span className="pizza-text-gradient">Conosco</span>
                </h2>
                <p className="text-gray-600 mb-8">
                  Estamos sempre prontos para atender você da melhor forma possível. 
                  Entre em contato através de qualquer um dos canais abaixo:
                </p>
              </div>

              <div className="space-y-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Telefone</h3>
                        <p className="text-gray-600 mb-1">(12) 3951-7565 / 3961-3004 / 996367326 (WhatsApp)</p>
                        <p className="text-sm text-gray-500">
                          Pedidos e informações - Ter-Dom, 18h às 23h
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Endereço</h3>
                        <p className="text-gray-600 mb-1">R. Bernardino de Campos, 143 - Jacareí SP</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Horário de Funcionamento</h3>
                        <p className="text-gray-600 mb-1">Terça a Domingo</p>
                        <p className="text-gray-600 font-medium">18:00 às 23:00</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Email</h3>
                        <p className="text-gray-600 mb-2">contato@williandiskpizza.com.br</p>
                        <div className="flex space-x-4">
                          <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                            <Instagram className="h-5 w-5" />
                          </a>
                          <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                            <Facebook className="h-5 w-5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Envie sua Mensagem</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome *</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Seu nome completo"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="(11) 99999-9999"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Mensagem *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Deixe sua mensagem, sugestão ou faça seu pedido..."
                        className="min-h-32"
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full pizza-gradient text-white hover:opacity-90">
                      Enviar Mensagem
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Faça seu <span className="pizza-text-gradient">Pedido Agora</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">Ligue Direto</h3>
                <p className="text-gray-600 mb-6">
                  Fale diretamente com nossa equipe para fazer seu pedido personalizado
                </p>
                <Button className="pizza-gradient text-white hover:opacity-90" asChild>
                  <a href="tel:+551239517565">
                    <Phone className="mr-2 h-4 w-4" />
                    (12) 3951-7565
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">Menu Online</h3>
                <p className="text-gray-600 mb-6">
                  Acesse nosso cardápio completo no iFood e faça seu pedido
                </p>
                <Button 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                  asChild
                >
                  <a href="https://cardapiodigital.williamdiskpizza.com.br" target="_blank" rel="noopener noreferrer">
                    Ver Menu Completo
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
