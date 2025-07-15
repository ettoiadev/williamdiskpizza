
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Pizza, Users, Heart, Award, Clock, Utensils } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Pizza className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Conheça a <span className="pizza-text-gradient">Willian Disk Pizza</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Uma história de paixão, tradição e muito sabor que começou há mais de 10 anos
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Nossa História</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  A Willian Disk Pizza nasceu em 2014 do sonho de Willian, um apaixonado 
                  pela culinária italiana que decidiu trazer para São Paulo o verdadeiro 
                  sabor das pizzas artesanais.
                </p>
                <p>
                  Começamos pequenos, em uma cozinha familiar, mas com um grande objetivo: 
                  servir pizzas feitas com ingredientes frescos, massa preparada diariamente 
                  e muito amor em cada receita.
                </p>
                <p>
                  Hoje, após mais de 10 anos, somos referência na região, mantendo sempre 
                  a qualidade e o carinho que nos trouxeram até aqui. Cada pizza é preparada 
                  com dedicação, como se fosse para nossa própria família.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-80 h-80 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                <Pizza className="h-32 w-32 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Nossos <span className="pizza-text-gradient">Valores</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Paixão</h3>
                <p className="text-gray-600">
                  Fazemos cada pizza com amor e dedicação, como se fosse para nossa 
                  própria família.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Qualidade</h3>
                <p className="text-gray-600">
                  Ingredientes selecionados diariamente e receitas especiais para 
                  garantir o melhor sabor.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Tradição Familiar</h3>
                <p className="text-gray-600">
                  Receitas passadas de geração em geração, mantendo a autenticidade 
                  e o sabor original.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Nossa <span className="pizza-text-gradient">Equipe</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Utensils className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Willian</h3>
                <p className="text-primary font-medium mb-2">Fundador & Chef</p>
                <p className="text-gray-600 text-sm">
                  Criador das receitas especiais e responsável pela qualidade 
                  de cada pizza que sai do forno.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Equipe de Produção</h3>
                <p className="text-primary font-medium mb-2">Pizzaiolos Especializados</p>
                <p className="text-gray-600 text-sm">
                  Profissionais treinados nas técnicas tradicionais para garantir 
                  a perfeição em cada massa.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Equipe de Delivery</h3>
                <p className="text-primary font-medium mb-2">Entregadores Dedicados</p>
                <p className="text-gray-600 text-sm">
                  Garantem que sua pizza chegue quentinha e no prazo, com todo 
                  o cuidado que ela merece.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 pizza-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">Nossa Missão</h2>
          <p className="text-xl max-w-4xl mx-auto leading-relaxed opacity-90">
            "Proporcionar momentos únicos através do sabor autêntico das nossas pizzas, 
            mantendo viva a tradição familiar e criando memórias afetivas em cada entrega. 
            Queremos estar presente nos melhores momentos da vida dos nossos clientes."
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
