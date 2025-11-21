import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer id="news" className="relative bg-card border-t-4 border-foreground/20 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {/* Company Logo */}
          <div className="text-center md:text-left">
            <h3 className="font-pixel pixel-title text-lg mb-2">
              DINKY BATTLE
            </h3>
            <p className="text-sm text-foreground/70 font-semibold">
              © 2025 EggByte Studio
            </p>
          </div>

          {/* Legal Links */}
          <div className="flex justify-center gap-6">
            <a
              href="https://en.wikipedia.org/wiki/End-user_license_agreement"
              className="text-sm text-foreground/70 hover:text-primary transition-colors font-semibold"
            >
              EULA
            </a>
            <span className="text-foreground/50">•</span>
            <a
              href="https://store.steampowered.com/eula/239160_eula_1?eulaLang=spanish"
              className="text-sm text-foreground/70 hover:text-primary transition-colors font-semibold"
            >
              Privacy Policy
            </a>
            <span className="text-foreground/50">•</span>
            <a
              href="https://en.wikipedia.org/wiki/Terms_of_service"
              className="text-sm text-foreground/70 hover:text-primary transition-colors font-semibold"
            >
              Terms of Service
            </a>
          </div>

          {/* Age Rating */}
          <div className="flex justify-center md:justify-end items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border-4 border-foreground/20 shadow-solid">
              <Shield className="w-5 h-5 text-foreground" />
              <span className="text-sm font-bold text-foreground">TEEN 13+</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t-2 border-foreground/20 text-center">
          <p className="text-xs text-foreground/70 font-medium">
            All game content, characters, and artwork are property of EggByte Studio.
            <br />
            Made with love for pixel art fighting game enthusiasts worldwide 👾.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
