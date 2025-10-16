
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote, Loader2, MessageSquare } from 'lucide-react';
import { useTestimonials, useAverageRating } from '@/hooks/use-testimonials';

const Testimonials = () => {
  // Buscar depoimentos ativos do banco
  const { data: testimonials, isLoading } = useTestimonials({ is_active: true });
  const { data: averageRating } = useAverageRating();

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

  // Loading state
  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            O que nossos <span className="pizza-text-gradient">clientes</span> dizem
          </h2>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (!testimonials || testimonials.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            O que nossos <span className="pizza-text-gradient">clientes</span> dizem
          </h2>
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">Nenhum depoimento disponível no momento</p>
          </div>
        </div>
      </section>
    );
  }

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
            {testimonials.length}+ avaliações • ⭐ {averageRating || 5.0}/5.0 
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
