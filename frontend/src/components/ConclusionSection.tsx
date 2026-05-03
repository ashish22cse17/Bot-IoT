import { CheckCircle, Shield, Cpu, TrendingUp } from 'lucide-react';

const ConclusionSection = () => {
  const conclusions = [
    {
      icon: Shield,
      title: 'Effective Detection',
      description: 'Both Random Forest and SVM demonstrate high effectiveness in detecting various types of intrusions in IoT networks.',
    },
    {
      icon: TrendingUp,
      title: 'High Performance',
      description: 'Random Forest achieved 97.5% accuracy, showing exceptional capability in classifying normal and malicious traffic.',
    },
    {
      icon: Cpu,
      title: 'IoT Suitability',
      description: 'The lightweight nature of these algorithms makes them suitable for deployment in resource-constrained IoT environments.',
    },
  ];

  return (
    <section id="conclusion" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in-up">
          <span className="font-mono text-primary text-sm tracking-wider uppercase mb-4 block">
            [ Conclusion ]
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            Project <span className="gradient-text">Conclusion</span>
          </h2>
        </div>

        {/* Main Conclusion */}
        <div className="max-w-4xl mx-auto">
          <div className="cyber-card p-8 md:p-12 mb-12 fade-in-up stagger-1">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-neon-green/10 border border-neon-green/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-neon-green" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  Summary of Findings
                </h3>
              </div>
            </div>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                This project successfully demonstrates the effectiveness of machine learning-based intrusion detection systems for IoT environments. Through the implementation and evaluation of Random Forest and Support Vector Machine algorithms, we have shown that these lightweight yet powerful techniques can accurately identify and classify various types of cyber attacks targeting IoT networks.
              </p>
              <p>
                The experimental results on the Bot-IoT dataset validate that our approach achieves high detection accuracy while maintaining computational efficiency suitable for resource-constrained IoT devices. Random Forest emerged as the top performer with 97.5% accuracy, closely followed by SVM with 95.2% accuracy.
              </p>
              <p className="text-neon-green">
                These findings contribute to the growing body of research aimed at securing the rapidly expanding IoT ecosystem against increasingly sophisticated cyber threats.
              </p>
            </div>
          </div>

          {/* Key Conclusions */}
          <div className="grid md:grid-cols-3 gap-6">
            {conclusions.map((item, index) => (
              <div
                key={item.title}
                className={`cyber-card p-6 hover-lift fade-in-up stagger-${index + 2}`}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
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
        </div>
      </div>
    </section>
  );
};

export default ConclusionSection;
