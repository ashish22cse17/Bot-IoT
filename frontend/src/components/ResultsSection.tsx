import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

const ResultsSection = () => {
  // Sample data for charts
  const accuracyData = [
    { name: 'Random Forest', accuracy: 97.5, fill: 'hsl(150, 100%, 50%)' },
    { name: 'SVM', accuracy: 95.2, fill: 'hsl(185, 100%, 50%)' },
  ];

  const metricsData = [
    { metric: 'Precision', RF: 97.8, SVM: 94.5 },
    { metric: 'Recall', RF: 96.9, SVM: 95.8 },
    { metric: 'F1-Score', RF: 97.3, SVM: 95.1 },
    { metric: 'Accuracy', RF: 97.5, SVM: 95.2 },
  ];

  const confusionData = [
    { name: 'True Positive', value: 4850, color: 'hsl(150, 100%, 50%)' },
    { name: 'True Negative', value: 4720, color: 'hsl(185, 100%, 50%)' },
    { name: 'False Positive', value: 125, color: 'hsl(330, 100%, 50%)' },
    { name: 'False Negative', value: 155, color: 'hsl(30, 100%, 50%)' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-primary/30 rounded-lg p-3 shadow-lg">
          <p className="text-foreground font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <section id="results" className="py-24 relative bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in-up">
          <span className="font-mono text-primary text-sm tracking-wider uppercase mb-4 block">
            [ Results & Graphs ]
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            Performance <span className="gradient-text">Analysis</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Comprehensive evaluation metrics demonstrating the effectiveness of our intrusion detection models.
          </p>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Accuracy Comparison */}
          <div className="cyber-card p-6 fade-in-up stagger-1">
            <h3 className="font-display text-xl font-bold mb-6 text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Model Accuracy Comparison
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={accuracyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(185, 50%, 20%)" />
                  <XAxis dataKey="name" tick={{ fill: 'hsl(180, 20%, 60%)' }} />
                  <YAxis domain={[90, 100]} tick={{ fill: 'hsl(180, 20%, 60%)' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="accuracy" radius={[8, 8, 0, 0]}>
                    {accuracyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Confusion Matrix Pie */}
          <div className="cyber-card p-6 fade-in-up stagger-2">
            <h3 className="font-display text-xl font-bold mb-6 text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              Confusion Matrix Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={confusionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {confusionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(240, 10%, 6%)', 
                      border: '1px solid hsl(185, 50%, 20%)',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend 
                    formatter={(value) => <span style={{ color: 'hsl(180, 20%, 60%)' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Performance Metrics Comparison */}
          <div className="cyber-card p-6 lg:col-span-2 fade-in-up stagger-3">
            <h3 className="font-display text-xl font-bold mb-6 text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neon-magenta animate-pulse" />
              Precision, Recall & F1-Score Comparison
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metricsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(185, 50%, 20%)" />
                  <XAxis dataKey="metric" tick={{ fill: 'hsl(180, 20%, 60%)' }} />
                  <YAxis domain={[90, 100]} tick={{ fill: 'hsl(180, 20%, 60%)' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    formatter={(value) => <span style={{ color: 'hsl(180, 100%, 95%)' }}>{value}</span>}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="RF" 
                    name="Random Forest"
                    stroke="hsl(150, 100%, 50%)" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(150, 100%, 50%)', r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="SVM" 
                    name="SVM"
                    stroke="hsl(185, 100%, 50%)" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(185, 100%, 50%)', r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Key Findings */}
        <div className="mt-12 max-w-4xl mx-auto fade-in-up">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="cyber-card p-6 text-center hover-lift">
              <div className="text-4xl font-display font-bold text-neon-green neon-text-green mb-2">97.5%</div>
              <p className="text-muted-foreground text-sm">Random Forest Accuracy</p>
            </div>
            <div className="cyber-card p-6 text-center hover-lift">
              <div className="text-4xl font-display font-bold text-primary neon-text-cyan mb-2">95.2%</div>
              <p className="text-muted-foreground text-sm">SVM Accuracy</p>
            </div>
            <div className="cyber-card p-6 text-center hover-lift">
              <div className="text-4xl font-display font-bold text-neon-magenta neon-text-magenta mb-2">10K+</div>
              <p className="text-muted-foreground text-sm">Samples Tested</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;
