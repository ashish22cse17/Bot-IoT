import { Shield, ChevronDown, Cpu, Lock, Wifi } from 'lucide-react';
import { useEffect, useState } from 'react';

const HeroSection = () => {
  const [typedText, setTypedText] = useState('');
  const fullText = 'Protecting IoT Networks with Machine Learning';

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden cyber-grid">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-green/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-neon-magenta/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <Cpu className="absolute top-20 left-[10%] w-8 h-8 text-primary/30 animate-float" />
        <Lock className="absolute top-32 right-[15%] w-10 h-10 text-neon-green/30 animate-float" style={{ animationDelay: '0.5s' }} />
        <Wifi className="absolute bottom-32 left-[20%] w-8 h-8 text-neon-magenta/30 animate-float" style={{ animationDelay: '1s' }} />
        <Shield className="absolute bottom-40 right-[10%] w-12 h-12 text-primary/20 animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-8">
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <span className="text-sm font-mono text-primary">College Project - 7th Semester</span>
          </div>

          {/* Main Title */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="text-foreground">Smart </span>
            <span className="gradient-text">IoT Intrusion</span>
            <br />
            <span className="text-foreground">Detection System</span>
          </h1>

          {/* Subtitle with Typing Effect */}
          <div className="h-8 mb-8">
            <p className="font-mono text-lg md:text-xl text-primary neon-text-cyan">
              {typedText}
              <span className="animate-pulse">_</span>
            </p>
          </div>

          {/* Algorithms Badge */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <span className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary font-mono text-sm neon-border-cyan">
              Random Forest
            </span>
            <span className="px-4 py-2 rounded-lg bg-neon-green/10 border border-neon-green/30 text-neon-green font-mono text-sm neon-border-green">
              Support Vector Machine
            </span>
          </div>

          {/* Student Info */}
          <div className="cyber-card inline-block px-8 py-6 mb-12">
            <p className="text-lg font-semibold text-foreground mb-2">SHUBHAM KUMAR</p>
            <p className="text-muted-foreground text-sm">Department of Computer Science & Engineering</p>
            <p className="text-primary text-sm font-mono mt-2">LNJPIT, Chapra</p>
            <p className="text-muted-foreground text-xs mt-1">Guide: SHUDHIR SIR</p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <a href="#about" className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
          <span className="text-xs font-mono uppercase tracking-wider">Scroll Down</span>
          <ChevronDown className="w-6 h-6 animate-bounce group-hover:text-primary" />
        </a>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
