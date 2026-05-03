import { Database, Shield, AlertTriangle, Eye, Key, Zap } from 'lucide-react';

const DatasetSection = () => {
  const attackTypes = [
    { name: 'DDoS Attacks', icon: Zap, color: 'text-destructive' },
    { name: 'DoS Attacks', icon: AlertTriangle, color: 'text-orange-400' },
    { name: 'Reconnaissance', icon: Eye, color: 'text-neon-cyan' },
    { name: 'Data Theft', icon: Key, color: 'text-neon-magenta' },
  ];

  return (
    <section id="dataset" className="py-24 relative">
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

        <div className="grid lg:grid-cols-2 gap-12 items-center">
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
                The Bot-IoT dataset was created at the UNSW Canberra Cyber Range Lab. It incorporates legitimate and simulated IoT network traffic along with various types of attacks. The dataset provides labeled data for training and testing machine learning models for intrusion detection.
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

            {/* Why Bot-IoT */}
            <div className="mt-8 p-6 border border-neon-green/20 rounded-xl bg-neon-green/5">
              <h4 className="font-display font-semibold text-neon-green mb-3 neon-text-green">
                Why Bot-IoT Dataset?
              </h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-neon-green mt-1">•</span>
                  Specifically designed for IoT network environments
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neon-green mt-1">•</span>
                  Contains realistic attack scenarios from botnets
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neon-green mt-1">•</span>
                  Well-labeled data for supervised learning
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neon-green mt-1">•</span>
                  Widely used benchmark in security research
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DatasetSection;
