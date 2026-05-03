import { TreeDeciduous, Cpu, Zap, BarChart2, Shield, Layers } from 'lucide-react';

const AlgorithmsSection = () => {
  const algorithms = [
    {
      name: 'Random Forest',
      icon: TreeDeciduous,
      color: 'text-neon-green',
      bgColor: 'bg-neon-green/10',
      borderColor: 'border-neon-green/30',
      glowClass: 'neon-border-green',
      description: 'An ensemble learning method that constructs multiple decision trees during training and outputs the mode of classes for classification.',
      features: [
        'Handles high-dimensional data effectively',
        'Robust against overfitting',
        'Provides feature importance ranking',
        'Works well with imbalanced datasets',
      ],
      pros: [
        'High accuracy',
        'Low computational cost',
        'Handles missing values',
      ],
    },
    {
      name: 'Support Vector Machine',
      icon: Cpu,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/30',
      glowClass: 'neon-border-cyan',
      description: 'A supervised learning algorithm that finds the optimal hyperplane to separate different classes with maximum margin.',
      features: [
        'Effective in high-dimensional spaces',
        'Memory efficient using support vectors',
        'Versatile with different kernel functions',
        'Works well for binary classification',
      ],
      pros: [
        'Strong generalization',
        'Effective with clear margins',
        'Works well with limited data',
      ],
    },
  ];

  return (
    <section id="algorithms" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in-up">
          <span className="font-mono text-primary text-sm tracking-wider uppercase mb-4 block">
            [ Algorithms ]
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            Machine Learning <span className="gradient-text">Algorithms</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Two powerful classification algorithms optimized for IoT intrusion detection.
          </p>
        </div>

        {/* Algorithms Grid */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {algorithms.map((algo, index) => (
            <div
              key={algo.name}
              className={`cyber-card p-8 hover-lift fade-in-up stagger-${index + 1}`}
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-xl ${algo.bgColor} border ${algo.borderColor} flex items-center justify-center`}>
                  <algo.icon className={`w-8 h-8 ${algo.color}`} />
                </div>
                <div>
                  <h3 className={`font-display text-2xl font-bold ${algo.color}`}>
                    {algo.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">Classification Algorithm</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed mb-6">
                {algo.description}
              </p>

              {/* Features */}
              <div className="mb-6">
                <h4 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  Key Features
                </h4>
                <ul className="space-y-2">
                  {algo.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${algo.color.replace('text-', 'bg-')}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pros */}
              <div className="flex flex-wrap gap-2">
                {algo.pros.map((pro) => (
                  <span
                    key={pro}
                    className={`px-3 py-1 rounded-full ${algo.bgColor} border ${algo.borderColor} ${algo.color} text-xs font-medium`}
                  >
                    {pro}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Why Lightweight */}
        <div className="mt-16 max-w-4xl mx-auto fade-in-up">
          <div className="cyber-card p-8 border-neon-magenta/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-neon-magenta/5 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-8 h-8 text-neon-magenta" />
                <h3 className="font-display text-xl font-bold text-neon-magenta neon-text-magenta">
                  Why Lightweight Algorithms for IoT?
                </h3>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Resource Constraints</h4>
                    <p className="text-muted-foreground text-sm">IoT devices have limited CPU, memory, and power resources.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BarChart2 className="w-5 h-5 text-neon-green mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Real-time Processing</h4>
                    <p className="text-muted-foreground text-sm">Fast detection is critical for immediate threat response.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Cpu className="w-5 h-5 text-neon-magenta mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Edge Deployment</h4>
                    <p className="text-muted-foreground text-sm">Models must run efficiently on edge devices and gateways.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AlgorithmsSection;
