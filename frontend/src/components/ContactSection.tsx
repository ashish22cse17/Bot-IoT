import { Mail, MapPin, GraduationCap } from 'lucide-react';

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 relative bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in-up">
          <span className="font-mono text-primary text-sm tracking-wider uppercase mb-4 block">
            [ Contact ]
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            For queries or collaboration opportunities regarding this project.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="cyber-card p-6 text-center hover-lift fade-in-up stagger-1">
            <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
              <GraduationCap className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-2">Institution</h3>
            <p className="text-muted-foreground text-sm">
              Loknayak Jai Prakash Institute of Technology
            </p>
            <p className="text-primary text-sm font-mono mt-1">LNJPIT, Chapra</p>
          </div>

          <div className="cyber-card p-6 text-center hover-lift fade-in-up stagger-2">
            <div className="w-14 h-14 mx-auto rounded-xl bg-neon-green/10 border border-neon-green/20 flex items-center justify-center mb-4">
              <MapPin className="w-7 h-7 text-neon-green" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-2">Department</h3>
            <p className="text-muted-foreground text-sm">
              Computer Science & Engineering
            </p>
            <p className="text-neon-green text-sm font-mono mt-1">7th Semester</p>
          </div>

          <div className="cyber-card p-6 text-center hover-lift fade-in-up stagger-3">
            <div className="w-14 h-14 mx-auto rounded-xl bg-neon-magenta/10 border border-neon-magenta/20 flex items-center justify-center mb-4">
              <Mail className="w-7 h-7 text-neon-magenta" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-2">Contact</h3>
            <p className="text-muted-foreground text-sm">
              For project inquiries
            </p>
            <p className="text-neon-magenta text-sm font-mono mt-1">Via College</p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center fade-in-up">
          <p className="text-muted-foreground text-sm">
            This is a college project for academic purposes under the guidance of SHUDHIR SIR.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
