import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import feature1 from "@/assets/Beleccion.png";
import feature2 from "@/assets/Battle.png";
import feature3 from "@/assets/Belo.png";

interface Feature {
  id: number;
  title: string;
  image: string;
}

const features: Feature[] = [
  {
    id: 1,
    title: "SUPERB PIXEL ART! SPLENDID SKILL EFFECTS!",
    image: feature1,
  },
  {
    id: 2,
    title: "INTENSE 1V1 REAL-TIME BATTLES",
    image: feature2,
  },
  {
    id: 3,
    title: "SKILL-BASED ELO RANKING SYSTEM",
    image: feature3,
  },
];

const GameFeaturesCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % features.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section id="features" className="relative min-h-screen py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="font-pixel text-4xl md:text-6xl pixel-title inline-block pb-4">
            GAME FEATURE
          </h2>
        </div>

        {/* Carousel */}
        <div className="relative max-w-7xl mx-auto">
          {/* Main Image */}
          <div className="relative aspect-video rounded-lg overflow-hidden shadow-arcade border-4 border-foreground/20 card-arcade">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                
                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                  <h3 className="font-pixel text-2xl md:text-4xl lg:text-5xl pixel-title leading-tight">
                    {feature.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <Button
            onClick={prevSlide}
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card border-4 border-foreground/20 hover:bg-primary hover:border-primary btn-arcade"
          >
            <ChevronLeft className="h-6 w-6 text-foreground" />
          </Button>

          <Button
            onClick={nextSlide}
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card border-4 border-foreground/20 hover:bg-primary hover:border-primary btn-arcade"
          >
            <ChevronRight className="h-6 w-6 text-foreground" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-3 mt-8">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`rounded-full transition-all duration-200 border-2 ${
                  index === currentIndex
                    ? "bg-foreground w-12 h-4 border-foreground"
                    : "bg-transparent w-4 h-4 border-foreground/40 hover:border-foreground/70"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GameFeaturesCarousel;
