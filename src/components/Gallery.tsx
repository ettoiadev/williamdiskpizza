
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { X, ChevronLeft, ChevronRight, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGallery } from '@/hooks/use-gallery';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  
  // Buscar galeria do banco (apenas itens ativos)
  const { data: galleryData, isLoading } = useGallery(true);
  
  // Mapear dados para formato do componente
  const images = galleryData?.map(item => ({
    id: item.id,
    src: item.image_url,
    alt: item.alt_text,
    title: item.title
  })) || [];

  const openModal = (index: number) => {
    setSelectedImage(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Nossa <span className="pizza-text-gradient">Galeria</span>
          </h2>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (!images || images.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Nossa <span className="pizza-text-gradient">Galeria</span>
          </h2>
          <div className="text-center py-12">
            <ImageIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">Nenhuma foto disponível no momento</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          Nossa <span className="pizza-text-gradient">Galeria</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <Card 
              key={image.id} 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
              onClick={() => openModal(index)}
            >
              <CardContent className="p-0">
                <div className="relative h-64 overflow-hidden rounded-lg">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">{image.title}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modal */}
        {selectedImage !== null && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full">
              <Button
                variant="outline"
                size="icon"
                className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white"
                onClick={closeModal}
              >
                <X className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              <img
                src={images[selectedImage].src}
                alt={images[selectedImage].alt}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg">
                <p className="text-center font-semibold">{images[selectedImage].title}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
