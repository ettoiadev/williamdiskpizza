
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Maria Silva",
      rating: 5,
      comment: "A melhor pizza de Jacareí! A massa é perfeita e os ingredientes são sempre frescos. Já sou cliente há mais de 10 anos.",
      location: "Centro, Jacareí"
    },
    {
      id: 2,
      name: "João Santos",
      rating: 5,
      comment: "Delivery sempre pontual e as pizzas chegam quentinhas. A pizza portuguesa é sensacional! Recomendo para toda família.",
      location: "Vila Branca, Jacareí"
    },
    {
      id: 3,
      name: "Ana Costa",
      rating: 5,
      comment: "Tradição e qualidade que se mantém ao longo dos anos. A pizza margherita é a minha favorita. Atendimento sempre excelente!",
      location: "Jardim Paraíba, Jacareí"
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          O que nossos <span className="pizza-text-gradient">clientes</span> dizem
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1">
                    {renderStars(testimonial.rating)}
                  </div>
                  <Quote className="h-8 w-8 text-primary/20" />
                </div>
                
                <p className="text-gray-600 mb-4 italic">
                  "{testimonial.comment}"
                </p>
                
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <p className="text-gray-600">
            +500 avaliações positivas • ⭐ 4.9/5.0 
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
