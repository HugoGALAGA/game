import storyBackground from "@/assets/story-background.png";

const StorySection = () => {
  return (
    <section 
      id="story" 
      className="relative min-h-screen py-20 flex items-center justify-center"
      style={{
        backgroundImage: `url(${storyBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/70 to-background/95" />
      
      <div className="relative z-10 container mx-auto px-4 max-w-4xl text-center">
        {/* Title */}
        <h2 className="font-pixel text-4xl md:text-6xl pixel-title mb-12 animate-slide-in-up">
          The Story of Dinky Battle
        </h2>
        
        {/* Story text */}
        <div className="bg-card/80 rounded-lg p-8 md:p-12 shadow-arcade border-4 border-foreground/20 card-arcade backdrop-blur-sm animate-fade-in">
          <p className="text-lg md:text-xl text-body leading-relaxed">
            En un mundo donde la fuerza lo es todo, guerreros de todas las esquinas compiten en la legendaria <span className="text-primary font-bold">Arena de la Suma Cero</span>. No luchan por la gloria ni por la riqueza, sino por algo mucho más valioso: <span className="text-accent font-bold">ELO</span>. Cada victoria y cada derrota queda registrada, forjando leyendas y rompiendo egos. ¿Tienes lo necesario para grabar tu nombre en la cima?
          </p>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
