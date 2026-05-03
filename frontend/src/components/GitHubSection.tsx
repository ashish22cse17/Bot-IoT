import { Github, Code2, GitBranch, Star } from 'lucide-react';

const GitHubSection = () => {
  return (
    <section id="github" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in-up">
          <span className="font-mono text-primary text-sm tracking-wider uppercase mb-4 block">
            [ Source Code ]
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">GitHub</span> Repository
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Access the complete source code and documentation for this project.
          </p>
        </div>

        {/* GitHub Card */}
        <div className="max-w-2xl mx-auto">
          <div className="cyber-card p-8 text-center hover-lift fade-in-up stagger-1">
            {/* GitHub Icon */}
            <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
              <Github className="w-10 h-10 text-primary" />
            </div>

            <h3 className="font-display text-2xl font-bold text-foreground mb-2">
              IoT-IDS-ML
            </h3>
            <p className="text-muted-foreground mb-6">
              Smart IoT Intrusion Detection using Random Forest & SVM
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Code2 className="w-4 h-4" />
                <span className="text-sm">Python</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Star className="w-4 h-4" />
                <span className="text-sm">Star</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <GitBranch className="w-4 h-4" />
                <span className="text-sm">Fork</span>
              </div>
            </div>

            {/* Coming Soon Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/10 border border-primary/30">
              <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              <span className="font-mono text-primary">Repository Coming Soon</span>
            </div>

            {/* Note */}
            <p className="text-muted-foreground text-sm mt-6">
              The complete source code, Jupyter notebooks, and documentation will be made available upon project completion.
            </p>
          </div>

          {/* Technologies */}
          <div className="mt-8 text-center fade-in-up stagger-2">
            <h4 className="font-display text-lg font-semibold text-foreground mb-4">
              Technologies Used
            </h4>
            <div className="flex flex-wrap justify-center gap-3">
              {['Python', 'Machine Learning', 'Pandas', 'NumPy', 'Scikit-learn', 'Jupyter Notebook', 'Matplotlib'].map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 rounded-lg bg-secondary border border-border text-muted-foreground font-mono text-sm hover:border-primary/30 hover:text-primary transition-all duration-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GitHubSection;
