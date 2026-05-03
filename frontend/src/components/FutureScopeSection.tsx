import { Rocket, Clock, Brain, Cpu, Cloud, Lock } from 'lucide-react';

const FutureScopeSection = () => {
  const futureWork = [
    {
      icon: Clock,
      title: 'Real-time Deployment',
      description: 'Implementing the IDS for real-time network traffic monitoring and instant threat detection in production IoT environments.',
      status: 'Next Phase',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/30',
    },
    {
      icon: Brain,
      title: 'Deep Learning Integration',
      description: 'Exploring deep learning models like LSTM and CNN for improved pattern recognition and zero-day attack detection.',
      status: 'Research',
      color: 'text-neon-green',
      bgColor: 'bg-neon-green/10',
      borderColor: 'border-neon-green/30',
    },
    {
      icon: Cpu,
      title: 'Edge Device Security',
      description: 'Optimizing models for direct deployment on edge devices and IoT gateways for decentralized threat detection.',
      status: 'Development',
      color: 'text-neon-magenta',
      bgColor: 'bg-neon-magenta/10',
      borderColor: 'border-neon-magenta/30',
    },
    {
      icon: Cloud,
      title: 'Cloud-Edge Hybrid',
      description: 'Developing a hybrid architecture combining edge computing with cloud-based advanced analytics for comprehensive security.',
      status: 'Planned',
      color: 'text-neon-purple',
      bgColor: 'bg-neon-purple/10',
      borderColor: 'border-neon-purple/30',
    },
    {
      icon: Lock,
      title: 'Federated Learning',
      description: 'Implementing federated learning to train models across multiple IoT networks while preserving data privacy.',
      status: 'Future',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/30',
    },
  ];

  return (
    <section id="future" className="py-24 relative bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in-up">
          <span className="font-mono text-primary text-sm tracking-wider uppercase mb-4 block">
            [ Future Scope ]
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            What's <span className="gradient-text">Next?</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Potential enhancements and future directions for extending this research.
          </p>
        </div>

        {/* Future Work Cards */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {futureWork.map((item, index) => (
              <div
                key={item.title}
                className={`cyber-card p-6 hover-lift fade-in-up stagger-${(index % 5) + 1} ${
                  index === 0 ? 'lg:col-span-2 md:col-span-2' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${item.bgColor} border ${item.borderColor} flex items-center justify-center`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <span className={`px-3 py-1 rounded-full ${item.bgColor} border ${item.borderColor} ${item.color} text-xs font-medium`}>
                    {item.status}
                  </span>
                </div>
                <h3 className="font-display text-lg font-semibold mb-2 text-foreground">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center fade-in-up">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-primary/10 to-neon-green/10 border border-primary/20">
              <Rocket className="w-6 h-6 text-primary animate-float" />
              <span className="text-foreground font-medium">
                This research opens doors to advanced IoT security solutions
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FutureScopeSection;
