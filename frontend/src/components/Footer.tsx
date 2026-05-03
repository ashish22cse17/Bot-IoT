import { Shield, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-border bg-card/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <span className="font-display font-bold text-primary neon-text-cyan">
              Smart IoT IDS
            </span>
          </div>

          {/* Center Info */}
          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              A 8th Semester College Project
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              Department of CSE | LNJPIT, Chapra
            </p>
          </div>

          {/* Copyright */}
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-destructive fill-destructive" />
            <span>© {currentYear}</span>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-8 pt-6 border-t border-border/50 text-center">
          <p className="text-muted-foreground text-xs font-mono">
            Random Forest | Support Vector Machine | Bot-IoT Dataset | Machine Learning
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
