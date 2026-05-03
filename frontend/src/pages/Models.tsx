import { TreeDeciduous, Cpu, Zap, BarChart2, Shield, Layers, Eye, Network, GitBranch, Binary, Activity, TrendingUp, Brain } from 'lucide-react';

const Models = () => {
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
      pros: ['High accuracy', 'Low computational cost', 'Handles missing values'],
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
      pros: ['Strong generalization', 'Effective with clear margins', 'Works well with limited data'],
    },
    {
      name: 'Deep Neural Network',
      icon: Brain,
      color: 'text-neon-purple',
      bgColor: 'bg-neon-purple/10',
      borderColor: 'border-neon-purple/30',
      glowClass: 'neon-border-purple',
      description: 'A fully-connected multi-layer neural network that learns hierarchical representations from raw network features to detect complex attack patterns.',
      features: [
        'Learns non-linear feature interactions',
        'Scales well with large datasets',
        'Automatic feature abstraction across layers',
        'High detection rate on complex attack types',
      ],
      pros: ['Captures complex patterns', 'High recall on attacks', 'Adaptable architecture'],
    },
    {
      name: 'Convolutional Neural Network',
      icon: Network,
      color: 'text-neon-magenta',
      bgColor: 'bg-neon-magenta/10',
      borderColor: 'border-neon-magenta/30',
      glowClass: 'neon-border-magenta',
      description: 'A 1-D convolutional network applied over the feature sequence, capturing local spatial structure within network traffic flows for precise classification.',
      features: [
        'Detects local patterns across feature windows',
        'Parameter sharing reduces overfitting',
        'Robust to feature ordering variations',
        'Deployed via TFLite for edge efficiency',
      ],
      pros: ['Best spatial structure detection', 'Lightweight inference', 'Strong on BOT-IoT'],
    },
  ];

  const networkFeatures = [
    { name: 'Packet Size', description: 'Total bytes in network packet', icon: Binary },
    { name: 'Flow Duration', description: 'Time between first and last packet', icon: Activity },
    { name: 'Protocol Type', description: 'TCP, UDP, ICMP classification', icon: Network },
    { name: 'Port Numbers', description: 'Source and destination ports', icon: GitBranch },
    { name: 'Packet Rate', description: 'Packets per second in flow', icon: TrendingUp },
    { name: 'Byte Rate', description: 'Data transfer rate', icon: Zap },
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-24 relative cyber-grid">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 fade-in-up">
            <span className="font-mono text-primary text-sm tracking-wider uppercase mb-4 block">
              [ Machine Learning Models ]
            </span>
            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
              ML <span className="gradient-text">Algorithms</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Four powerful ML/DL classification algorithms optimized for IoT intrusion detection.
            </p>
          </div>
        </div>
      </section>

      {/* Algorithms Section */}
      <section className="py-24 relative bg-secondary/30">
        <div className="container mx-auto px-4">
          {/* Algorithms Grid */}
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {algorithms.map((algo, index) => (
              <div
                key={algo.name}
                className={`cyber-card p-8 hover-lift fade-in-up stagger-${(index % 4) + 1}`}
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
                    <p className="text-muted-foreground text-sm">
                      {['Random Forest', 'Support Vector Machine'].includes(algo.name)
                        ? 'Classical ML Algorithm'
                        : 'Deep Learning Algorithm'}
                    </p>
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
                <div className="flex items-center gap-3 mb-6">
                  <Zap className="w-8 h-8 text-neon-magenta" />
                  <h3 className="font-display text-xl font-bold text-neon-magenta neon-text-magenta">
                    Why These Algorithms for IoT?
                  </h3>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Resource Constraints</h4>
                      <p className="text-muted-foreground text-sm">
                        IoT devices have limited CPU, memory, and power — RF and SVM stay lightweight while DNN/CNN run via TFLite.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <BarChart2 className="w-5 h-5 text-neon-green mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Real-time Processing</h4>
                      <p className="text-muted-foreground text-sm">
                        Fast inference is critical — all four models deliver sub-millisecond predictions on live traffic.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Cpu className="w-5 h-5 text-neon-magenta mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Edge Deployment</h4>
                      <p className="text-muted-foreground text-sm">
                        Models must run efficiently on edge devices — TFLite compression enables DNN/CNN on constrained hardware.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Network Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 fade-in-up">
            <span className="font-mono text-primary text-sm tracking-wider uppercase mb-4 block">
              [ Feature Engineering ]
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
              Network <span className="gradient-text">Features</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Key network traffic features extracted for intrusion detection.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {networkFeatures.map((feature, index) => (
              <div
                key={feature.name}
                className={`cyber-card p-6 hover-lift fade-in-up stagger-${(index % 5) + 1}`}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2 text-foreground">
                  {feature.name}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SHAP / Explainability Section */}
      <section className="py-24 relative bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="cyber-card p-8 md:p-12 fade-in-up border-primary/30">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Eye className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-primary neon-text-cyan">
                    Explainable AI (XAI)
                  </h3>
                  <p className="text-muted-foreground">Understanding Model Decisions</p>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6">
                Our intrusion detection system incorporates SHAP (SHapley Additive exPlanations) values to provide transparency in model predictions. This allows security analysts to understand why a particular network flow was classified as malicious or benign.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-background/50 border border-border">
                  <h4 className="font-display font-semibold text-foreground mb-2">Feature Importance</h4>
                  <p className="text-muted-foreground text-sm">
                    Identifies which network features contributed most to the detection decision.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-background/50 border border-border">
                  <h4 className="font-display font-semibold text-foreground mb-2">Decision Transparency</h4>
                  <p className="text-muted-foreground text-sm">
                    Provides clear explanations for each classification, building trust in the system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Models;