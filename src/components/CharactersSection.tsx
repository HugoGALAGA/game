import { useState } from "react";
import characterDude from "@/assets/character-dude1.png";
import characterOwer from "@/assets/character-ower1.png";
import characterPink from "@/assets/character-pink1.png";

interface Character {
  id: string;
  name: string;
  quote: string;
  description: string;
  image: string;
}

const characters: Character[] = [
  {
    id: "dude",
    name: "DUDE",
    quote: "I fight for the streets!",
    description: "“Un luchador astuto que aprendió a pelear en torneos clandestinos. Rápido, ágil e impredecible, Dude utiliza una mezcla de artes marciales y pelea callejera para abrumar a sus oponentes con combos rapidísimos.”",
    image: characterDude,
  },
  {
    id: "ower",
    name: "OWER",
    quote: "Power conquers all!",
    description: "Un poderoso guerrero vestido con una armadura pesada, que empuña una fuerza devastadora. Los ataques de Ower son lentos pero infligen un daño enorme. Domina sus movimientos de poder brutales para aplastar a tus enemigos con una fuerza imparable.",
    image: characterOwer,
  },
  {
    id: "pink",
    name: "PINK",
    quote: "Swift as the wind!",
    description: "Una ninja elegante con una velocidad y precisión incomparables. Pink se especializa en ataques rápidos y maniobras evasivas. Su estilo de combate lleno de gracia le permite moverse alrededor de los oponentes mientras asesta golpes críticos.",
    image: characterPink,
  },
];

const CharactersSection = () => {
  const [activeCharacter, setActiveCharacter] = useState<Character>(characters[0]);

  return (
    <section id="characters" className="relative min-h-screen py-20 bg-gradient-cosmic">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="font-pixel text-4xl md:text-6xl pixel-title inline-block pb-4">
            CHARACTERS
          </h2>
        </div>

        {/* Character Display */}
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Character Image */}
          <div className="relative">
            <div className="aspect-[3/4] relative rounded-lg overflow-hidden bg-card/60 border-4 border-foreground/20 shadow-arcade card-arcade">
              <img
                src={activeCharacter.image}
                alt={activeCharacter.name}
                className="w-full h-full object-contain transition-all duration-500 ease-in-out animate-fade-in"
                key={activeCharacter.id}
              />
            </div>
          </div>

          {/* Character Info */}
          <div className="space-y-8">
            <div className="space-y-4" key={activeCharacter.id}>
              <h3 className="font-pixel text-3xl md:text-5xl pixel-title animate-fade-in">
                {activeCharacter.name}
              </h3>
              
              <p className="text-xl md:text-2xl text-accent italic font-bold animate-fade-in drop-shadow-lg">
                "{activeCharacter.quote}"
              </p>
              
              <p className="text-lg text-body leading-relaxed animate-fade-in drop-shadow-md">
                {activeCharacter.description}
              </p>
            </div>

            {/* Character Thumbnails */}
            <div className="flex gap-4 pt-8">
              {characters.map((character) => (
                <button
                  key={character.id}
                  onClick={() => setActiveCharacter(character)}
                  className={`
                    relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden border-4 transition-all duration-200 btn-arcade
                    ${activeCharacter.id === character.id 
                      ? "border-primary scale-110" 
                      : "border-foreground/20 hover:border-primary/70 hover:scale-105 opacity-70 hover:opacity-100"
                    }
                  `}
                >
                  <img
                    src={character.image}
                    alt={character.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CharactersSection;
