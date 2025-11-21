import { useState } from "react";
import { Play, Download, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import heroBackground from "@/assets/statsbg.jpg";

const HeroSection = () => {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${heroBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background/90" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center pt-16">
        <div className="space-y-12 animate-slide-in-up">
          {/* Logo */}
          <h1 className="font-pixel text-4xl md:text-6xl lg:text-8xl pixel-title leading-tight drop-shadow-2xl">
            DINKY<br/>BATTLE
          </h1>

          {/* Play Button */}
          <Dialog>
            <DialogTrigger asChild>
              <button className="group inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary border-4 border-foreground/20 hover:bg-primary/90 transition-all duration-200 btn-arcade">
                <Play className="w-10 h-10 md:w-14 md:h-14 text-foreground fill-foreground group-hover:scale-110 transition-transform" />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-full bg-card border-4 border-foreground/20">
              <div className="aspect-video w-full bg-muted rounded-lg flex items-center justify-center">
                <p className="text-foreground font-bold">Gameplay Video Player (Demo)</p>
              </div>
            </DialogContent>
          </Dialog>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button 
              size="lg"
              className="bg-primary text-foreground hover:bg-primary/90 font-bold text-base md:text-lg px-8 py-6 btn-arcade"
            >
              <Download className="mr-2 h-5 w-5" />
              Get it on PC
            </Button>
            
            <Button 
              size="lg"
              className="bg-secondary text-foreground hover:bg-secondary/90 font-bold text-base md:text-lg px-8 py-6 btn-arcade"
              
            >

              <MessageCircle className="mr-2 h-5 w-5" />
              Join our DISCORD
            </Button>
          </div>

          {/* Tagline */}
          <p className="text-body text-lg md:text-xl max-w-2xl mx-auto drop-shadow-lg">
            Master intense 1v1 battles with spectacular pixel art. Climb the ranks and become the ultimate champion!
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
