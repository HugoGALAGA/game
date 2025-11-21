import { MessageCircle, Twitter, Youtube, Twitch } from "lucide-react";

const SocialSidebar = () => {
  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-4">
      <a
        href="https://discord.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full bg-muted/50 backdrop-blur-md border border-border/50 flex items-center justify-center text-foreground hover:text-primary hover:bg-primary/10 hover:border-primary/50 hover:shadow-glow-cyan transition-all duration-300 group"
        aria-label="Discord"
      >
        <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </a>
      
      <a
        href="https://x.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full bg-muted/50 backdrop-blur-md border border-border/50 flex items-center justify-center text-foreground hover:text-primary hover:bg-primary/10 hover:border-primary/50 hover:shadow-glow-cyan transition-all duration-300 group"
        aria-label="Twitter"
      >
        <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </a>
      
      <a
        href="https://youtube.com"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full bg-muted/50 backdrop-blur-md border border-border/50 flex items-center justify-center text-foreground hover:text-secondary hover:bg-secondary/10 hover:border-secondary/50 hover:shadow-glow-magenta transition-all duration-300 group"
        aria-label="YouTube"
      >
        <Youtube className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </a>
      
      <a
        href="https://www.twitch.tv/"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full bg-muted/50 backdrop-blur-md border border-border/50 flex items-center justify-center text-foreground hover:text-secondary hover:bg-secondary/10 hover:border-secondary/50 hover:shadow-glow-magenta transition-all duration-300 group"
        aria-label="Twitch"
      >
        <Twitch className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </a>
    </div>
  );
};

export default SocialSidebar;
