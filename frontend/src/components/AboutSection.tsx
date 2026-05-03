import { Shield, AlertTriangle, Target, Wifi, Server, Lock } from 'lucide-react';

const AboutSection = () => {
  const features = [
    {
      icon: Wifi,
      title: 'IoT Vulnerability',
      description: 'IoT devices often lack robust security measures, making them prime targets for cyber attacks.',
    },
    {
      icon: AlertTriangle,
      title: 'Growing Threats',
      description: 'With billions of connected devices, the attack surface for malicious actors continues to expand.',
    },
    {
      icon: Shield,
      title: 'Intrusion Detection',
      description: 'IDS monitors network traffic to identify suspicious patterns and potential security breaches.',
    },
    {
      icon: Target,
      title: 'ML-Based Detection',
      description: 'Machine learning enables real-time identification of novel attack patterns and zero-day threats.',
    },
    {
      icon: Server,
      title: 'Network Protection',
      description: 'Comprehensive monitoring of network traffic to detect and prevent unauthorized access.',
    },
    {
      icon: Lock,
      title: 'Secure IoT Ecosystem',
      description: 'Building resilient IoT networks through intelligent threat detection and prevention.',
    },
  ];

  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in-up">
          <span className="font-mono text-primary text-sm tracking-wider uppercase mb-4 block">
            [ About The Project ]
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            Understanding <span className="gradient-text">IoT Security</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            An intelligent approach to protecting Internet of Things networks from malicious intrusions using advanced machine learning algorithms.
          </p>
        </div>

        {/* What is IoT IDS */}
        <div className="cyber-card p-8 md:p-12 mb-16 fade-in-up stagger-1">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-display text-2xl font-bold mb-4 text-primary neon-text-cyan">
                What is IoT Intrusion Detection?
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                An Intrusion Detection System (IDS) for IoT is a security solution that monitors network traffic and device behavior to identify potential security threats, unauthorized access attempts, and malicious activities targeting IoT devices and networks.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Unlike traditional security systems, IoT-specific IDS must handle the unique challenges of resource-constrained devices, diverse protocols, and the massive scale of connected ecosystems.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent flex items-center justify-center">
                <Shield className="w-32 h-32 text-primary/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border border-primary/20 rounded-full animate-pulse" />
                  <div className="absolute w-64 h-64 border border-neon-green/10 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <div className="absolute w-80 h-80 border border-neon-magenta/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`cyber-card p-6 hover-lift fade-in-up stagger-${(index % 5) + 1}`}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Purpose Section */}
        <div className="mt-16 text-center fade-in-up">
          <div className="inline-block cyber-card px-8 py-6">
            <h3 className="font-display text-xl font-bold mb-3 text-neon-green neon-text-green">
              Purpose of This Project
            </h3>
            <p className="text-muted-foreground max-w-xl">
              To develop an efficient, lightweight intrusion detection system using Random Forest and SVM algorithms that can effectively identify and classify various types of cyber attacks in IoT environments.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
