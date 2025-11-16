import Image from 'next/image';
import { useState } from 'react';

// Example gallery data - ganti dengan data real dari CMS/database
const galleryData = [
  {
    id: 1,
    src: '/images/gallery/2024-11-talkshow-parenting/photo-01.jpg',
    alt: 'Talkshow Parenting - Mendaki Gunung Mendidik Anak',
    title: 'Talkshow Parenting',
    date: '2024-11-15',
    category: 'event'
  },
  {
    id: 2,
    src: '/images/gallery/2024-11-talkshow-parenting/photo-02.jpg',
    alt: 'Diskusi interaktif dengan para ayah',
    title: 'Diskusi Ayah',
    date: '2024-11-15',
    category: 'event'
  },
  {
    id: 3,
    src: '/images/gallery/2024-10-workshop-fbe/photo-01.jpg',
    alt: 'Workshop Family Based Education',
    title: 'Workshop FBE',
    date: '2024-10-20',
    category: 'workshop'
  },
  // Add more photos...
];

// Simple Gallery Grid
export function GalleryGrid() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">Gallery Event</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryData.map((photo) => (
          <div 
            key={photo.id} 
            className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={85}
            />
            
            {/* Caption overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <h3 className="text-white font-semibold">{photo.title}</h3>
              <p className="text-white/80 text-sm">{photo.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Gallery dengan Lightbox/Modal
export function GalleryWithLightbox() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">Gallery Event</h2>
      
      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {galleryData.map((photo) => (
          <button
            key={photo.id}
            onClick={() => setSelectedImage(photo)}
            className="relative aspect-square overflow-hidden rounded-lg hover:opacity-80 transition-opacity"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              quality={85}
            />
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>
          
          <div className="relative max-w-4xl max-h-[80vh] w-full h-full">
            <Image
              src={selectedImage.src}
              alt={selectedImage.alt}
              fill
              className="object-contain"
              quality={90}
              priority
            />
          </div>
          
          <div className="absolute bottom-4 left-4 right-4 text-center text-white">
            <h3 className="text-xl font-semibold">{selectedImage.title}</h3>
            <p className="text-sm opacity-80">{selectedImage.alt}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Gallery by Category/Event
export function GalleryByEvent() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'event', 'workshop', 'gathering'];
  
  const filteredPhotos = selectedCategory === 'all' 
    ? galleryData 
    : galleryData.filter(photo => photo.category === selectedCategory);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">Gallery Event</h2>
      
      {/* Category Filter */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Masonry-style Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        {filteredPhotos.map((photo) => (
          <div 
            key={photo.id} 
            className="break-inside-avoid relative overflow-hidden rounded-lg shadow-lg"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={800}
              height={600}
              className="w-full h-auto hover:scale-105 transition-transform"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={85}
            />
            
            <div className="p-4 bg-white">
              <h3 className="font-semibold text-lg">{photo.title}</h3>
              <p className="text-sm text-gray-600">{photo.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Carousel/Slider Gallery
export function GalleryCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryData.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryData.length) % galleryData.length);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">Featured Photos</h2>
      
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl shadow-2xl">
        <Image
          src={galleryData[currentIndex].src}
          alt={galleryData[currentIndex].alt}
          fill
          className="object-cover"
          sizes="100vw"
          quality={90}
          priority
        />
        
        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {/* Caption */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
          <h3 className="text-white text-2xl font-semibold">{galleryData[currentIndex].title}</h3>
          <p className="text-white/90">{galleryData[currentIndex].alt}</p>
        </div>
        
        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {galleryData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default GalleryGrid;
