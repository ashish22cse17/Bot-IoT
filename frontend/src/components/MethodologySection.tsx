import { Database, Settings, Filter, Brain, BarChart, ArrowRight } from 'lucide-react';

const MethodologySection = () => {
  const steps = [
    {
      icon: Database,
      title: 'Data Collection',
      description: 'Acquiring the Bot-IoT dataset containing network traffic samples with labeled attack categories.',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
    },
    {
      icon: Settings,
      title: 'Preprocessing',
      description: 'Cleaning data, handling missing values, normalizing features, and encoding categorical variables.',
      color: 'text-neon-green',
      bgColor: 'bg-neon-green/10',
      borderColor: 'border-neon-green/20',
    },
    {
      icon: Filter,
      title: 'Feature Selection',
      description: 'Identifying and selecting the most relevant features for accurate intrusion detection.',
      color: 'text-neon-magenta',
      bgColor: 'bg-neon-magenta/10',
      borderColor: 'border-neon-magenta/20',
    },
    {
      icon: Brain,
      title: 'Model Training',
      description: 'Training Random Forest and SVM classifiers on the processed dataset.',
      color: 'text-neon-purple',
      bgColor: 'bg-neon-purple/10',
      borderColor: 'border-neon-purple/20',
    },
    {
      icon: BarChart,
      title: 'Evaluation',
      description: 'Assessing model performance using accuracy, precision, recall, and confusion matrix.',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
    },
  ];

  return (
    <section id="methodology" className="py-24 relative bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in-up">
          <span className="font-mono text-primary text-sm tracking-wider uppercase mb-4 block">
            [ Methodology ]
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            Our <span className="gradient-text">Approach</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            A systematic methodology for developing and evaluating the intrusion detection system.
          </p>
        </div>

        {/* Steps Flow */}
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-neon-green to-neon-magenta opacity-30 -translate-y-1/2" />

            <div className="grid lg:grid-cols-5 gap-6">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className={`relative fade-in-up stagger-${index + 1}`}
                >
                  {/* Card */}
                  <div className="cyber-card p-6 h-full hover-lift">
                    {/* Step Number */}
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-background border border-primary/30 flex items-center justify-center font-display font-bold text-primary text-sm">
                      {index + 1}
                    </div>

                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-xl ${step.bgColor} border ${step.borderColor} flex items-center justify-center mb-4`}>
                      <step.icon className={`w-7 h-7 ${step.color}`} />
                    </div>

                    {/* Content */}
                    <h3 className="font-display text-lg font-semibold mb-2 text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow (hidden on last item) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 translate-x-1/2 z-10">
                      <ArrowRight className="w-6 h-6 text-primary/50" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tools Used */}
          <div className="mt-16 text-center fade-in-up">
            <h3 className="font-display text-xl font-bold mb-6">Technologies Used</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'Jupyter Notebook', 'Matplotlib'].map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary font-mono text-sm hover:neon-border-cyan transition-all duration-300"
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

export default MethodologySection;
