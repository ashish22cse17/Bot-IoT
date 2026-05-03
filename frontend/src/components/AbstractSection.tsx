import { FileText, Brain, BarChart3, CheckCircle2 } from 'lucide-react';

const AbstractSection = () => {
  return (
    <section id="abstract" className="py-24 relative bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in-up">
          <span className="font-mono text-primary text-sm tracking-wider uppercase mb-4 block">
            [ Abstract ]
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            Project <span className="gradient-text">Abstract</span>
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
                The system is trained and evaluated using the <span className="text-neon-magenta">Bot-IoT dataset</span>, which contains realistic network traffic data including DDoS attacks, DoS attacks, reconnaissance activities, and information theft attempts. This dataset provides a comprehensive representation of real-world IoT attack scenarios.
              </p>
              <p>
                Our experimental results demonstrate high accuracy in detecting intrusions, with detailed performance metrics including precision, recall, F1-score, and confusion matrices. The lightweight nature of the chosen algorithms makes them suitable for deployment in resource-constrained IoT environments.
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
  );
};

export default AbstractSection;
