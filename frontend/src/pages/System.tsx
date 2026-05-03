import { Database, Shield, AlertTriangle, Eye, Key, Zap, Settings, Filter, Brain, BarChart, ArrowRight, FileText, BarChart3, CheckCircle2, Cpu, Server } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const System = () => {
  const attackTypes = [
    { name: 'DDoS Attacks', icon: Zap, color: 'text-destructive' },
    { name: 'DoS Attacks', icon: AlertTriangle, color: 'text-orange-400' },
    { name: 'Reconnaissance', icon: Eye, color: 'text-neon-cyan' },
    { name: 'Data Theft', icon: Key, color: 'text-neon-magenta' },
  ];

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
    <div className="pt-16">
      {/* Abstract Section */}
      <section className="py-24 relative bg-secondary/30">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16 fade-in-up">
            <span className="font-mono text-primary text-sm tracking-wider uppercase mb-4 block">
              [ About Project ]
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
              System <span className="gradient-text">Overview</span>
            </h2>
          </div>

          {/* Abstract Content */}
          <div className="max-w-4xl mx-auto">
            <div className="cyber-card p-8 md:p-12 fade-in-up stagger-1">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">
                    ML-Based Intrusion Detection for IoT Networks
                  </h3>
                  <p className="text-muted-foreground text-sm">Research Abstract</p>
                </div>
              </div>

              <div className="space-y-4 text-muted-foreground leading-relaxed font-mono text-sm border-l-2 border-primary/30 pl-6">
                <p>
                  The proliferation of Internet of Things (IoT) devices has created unprecedented security challenges. Traditional security mechanisms are often inadequate for resource-constrained IoT devices, necessitating the development of intelligent, lightweight intrusion detection systems.
                </p>
                <p>
                  This project presents a machine learning-based Intrusion Detection System (IDS) specifically designed for IoT environments. We employ two powerful classification algorithms: <span className="text-primary">Random Forest</span> and <span className="text-neon-green">Support Vector Machine (SVM)</span>, to detect and classify various types of cyber attacks targeting IoT networks.
                </p>
                <p>
                  The system is trained and evaluated using the <span className="text-neon-magenta">Bot-IoT dataset</span>, which contains realistic network traffic data including DDoS attacks, DoS attacks, reconnaissance activities, and information theft attempts.
                </p>
              </div>
            </div>

            {/* Key Highlights */}
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="cyber-card p-6 text-center hover-lift fade-in-up stagger-2">
                <Brain className="w-10 h-10 text-primary mx-auto mb-4" />
                <h4 className="font-display font-semibold mb-2">ML Algorithms</h4>
                <p className="text-muted-foreground text-sm">Random Forest & SVM for intelligent detection</p>
              </div>
              <div className="cyber-card p-6 text-center hover-lift fade-in-up stagger-3">
                <BarChart3 className="w-10 h-10 text-neon-green mx-auto mb-4" />
                <h4 className="font-display font-semibold mb-2">Bot-IoT Dataset</h4>
                <p className="text-muted-foreground text-sm">Real-world IoT attack scenarios</p>
              </div>
              <div className="cyber-card p-6 text-center hover-lift fade-in-up stagger-4">
                <CheckCircle2 className="w-10 h-10 text-neon-magenta mx-auto mb-4" />
                <h4 className="font-display font-semibold mb-2">High Accuracy</h4>
                <p className="text-muted-foreground text-sm">Comprehensive performance metrics</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dataset Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16 fade-in-up">
            <span className="font-mono text-primary text-sm tracking-wider uppercase mb-4 block">
              [ Dataset ]
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
              The <span className="gradient-text">Bot-IoT</span> Dataset
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              A comprehensive dataset specifically designed for IoT security research and intrusion detection system evaluation.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Dataset Info */}
            <div className="fade-in-up stagger-1">
              <div className="cyber-card p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Database className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-foreground">Bot-IoT Dataset</h3>
                    <p className="text-muted-foreground text-sm">UNSW Canberra Cyber Security Lab</p>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed mb-6">
                  The Bot-IoT dataset was created at the UNSW Canberra Cyber Range Lab. It incorporates legitimate and simulated IoT network traffic along with various types of attacks.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-neon-green" />
                    <span className="text-foreground">Contains both normal and malicious traffic</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-neon-green" />
                    <span className="text-foreground">Features extracted for ML training</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-neon-green" />
                    <span className="text-foreground">Realistic IoT environment simulation</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Attack Types */}
            <div className="fade-in-up stagger-2">
              <h3 className="font-display text-xl font-bold mb-6 text-center lg:text-left">
                Attack Categories Covered
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {attackTypes.map((attack, index) => (
                  <div
                    key={attack.name}
                    className={`cyber-card p-6 hover-lift fade-in-up stagger-${index + 1}`}
                  >
                    <attack.icon className={`w-8 h-8 ${attack.color} mb-3`} />
                    <h4 className="font-display font-semibold text-foreground">{attack.name}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="py-24 relative bg-secondary/30">
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

      {/* Raspberry Pi Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="cyber-card p-8 md:p-12 fade-in-up border-neon-green/30">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-neon-green/10 border border-neon-green/20 flex items-center justify-center">
                  <Cpu className="w-8 h-8 text-neon-green" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-neon-green neon-text-green">
                    Real-World Deployment
                  </h3>
                  <p className="text-muted-foreground">Raspberry Pi IDS Gateway</p>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6">
                Our intrusion detection system is designed for real-world deployment using a Raspberry Pi as an IoT gateway. The ML model runs directly on the device, monitoring all network traffic in real-time and blocking malicious connections before they reach their target.
              </p>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-lg bg-background/50 border border-border">
                  <Server className="w-6 h-6 text-primary mb-2" />
                  <h4 className="font-semibold text-foreground mb-1">Edge Computing</h4>
                  <p className="text-muted-foreground text-sm">On-device ML inference</p>
                </div>
                <div className="p-4 rounded-lg bg-background/50 border border-border">
                  <Shield className="w-6 h-6 text-neon-green mb-2" />
                  <h4 className="font-semibold text-foreground mb-1">Real-time Protection</h4>
                  <p className="text-muted-foreground text-sm">Instant threat blocking</p>
                </div>
                <div className="p-4 rounded-lg bg-background/50 border border-border">
                  <Zap className="w-6 h-6 text-neon-magenta mb-2" />
                  <h4 className="font-semibold text-foreground mb-1">Low Latency</h4>
                  <p className="text-muted-foreground text-sm">Minimal network delay</p>
                </div>
              </div>

              <div className="text-center">
                <Button asChild size="lg" className="neon-border-green bg-neon-green/10 text-neon-green hover:bg-neon-green/20">
                  <Link to="/deployment">
                    View Deployment Architecture
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default System;
