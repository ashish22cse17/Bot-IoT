import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  CheckCircle,
  Shield,
  Cpu,
  TrendingUp,
  Rocket,
  Clock,
  Brain,
  Cloud,
  Lock,
  User,
  Code,
  BookOpen,
  Github,
  Code2,
  GitBranch,
  Star,
  Mail,
  MapPin,
  GraduationCap,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

// ─── Types ───────────────────────────────────────────────────────────────────
interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  test_samples: number;
  confusion_matrix: number[][];
  available: boolean;
}

interface CompareData {
  rf?: ModelMetrics;
  linear_svm?: ModelMetrics;
  dnn?: ModelMetrics;
  cnn?: ModelMetrics;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const MODEL_LABELS: Record<string, string> = {
  rf: "Random Forest",
  linear_svm: "Linear SVM",
  dnn: "Deep Neural Net",
  cnn: "Conv Neural Net",
};

const MODEL_COLORS: Record<string, string> = {
  rf: "hsl(150, 100%, 50%)",
  linear_svm: "hsl(185, 100%, 50%)",
  dnn: "hsl(270, 100%, 70%)",
  cnn: "hsl(330, 100%, 60%)",
};

const MODEL_KEYS = ["rf", "linear_svm", "dnn", "cnn"] as const;

// ─── Component ───────────────────────────────────────────────────────────────
const Results = () => {
  const [compare, setCompare] = useState<CompareData>({});
  const [loading, setLoading] = useState(true);
  const [bestModel, setBestModel] = useState<string>("");

  // ── Fetch /compare ─────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await axios.get("http://localhost:5020/compare");
        setCompare(res.data);

        // Determine best model by accuracy
        let best = "",
          bestAcc = -1;
        for (const key of MODEL_KEYS) {
          const m = res.data[key];
          if (m?.available && m.accuracy > bestAcc) {
            bestAcc = m.accuracy;
            best = key;
          }
        }
        setBestModel(best);
      } catch (err) {
        console.error("Failed to load /compare", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="pt-32 text-center text-muted-foreground animate-pulse">
        Loading model metrics...
      </div>
    );
  }

  // ── Chart Data ──────────────────────────────────────────────────────────────

  // Bar chart — accuracy per model
  const accuracyData = MODEL_KEYS.filter((k) => compare[k]?.available).map(
    (k) => ({
      name: MODEL_LABELS[k],
      accuracy: compare[k]!.accuracy,
      fill: MODEL_COLORS[k],
    }),
  );

  // Line chart — precision / recall / f1 / accuracy per model
  const metricsData = [
    { metric: "Precision" },
    { metric: "Recall" },
    { metric: "F1-Score" },
    { metric: "Accuracy" },
  ].map((row) => {
    const metricKey =
      row.metric === "F1-Score"
        ? "f1"
        : (row.metric.toLowerCase() as keyof ModelMetrics);
    const out: Record<string, any> = { metric: row.metric };
    MODEL_KEYS.forEach((k) => {
      if (compare[k]?.available) out[k] = (compare[k] as any)[metricKey];
    });
    return out;
  });

  // Confusion matrix pie — use best available model
  const cmSource = compare[bestModel as keyof CompareData];
  const confusionData = cmSource?.confusion_matrix
    ? (() => {
        const cm = cmSource.confusion_matrix;
        // Works for 2×2 and multi-class (show TP/TN/FP/FN of first class)
        if (cm.length === 2) {
          const [[tn, fp], [fn, tp]] = cm;
          return [
            { name: "True Positive", value: tp, color: MODEL_COLORS.rf },
            {
              name: "True Negative",
              value: tn,
              color: MODEL_COLORS.linear_svm,
            },
            { name: "False Positive", value: fp, color: MODEL_COLORS.cnn },
            { name: "False Negative", value: fn, color: MODEL_COLORS.dnn },
          ];
        }
        // multi-class: show per-class correct counts (diagonal)
        return cm.map((row, i) => ({
          name: `Class ${i} Correct`,
          value: row[i],
          color: Object.values(MODEL_COLORS)[i % 4],
        }));
      })()
    : [];

  // ── Custom Tooltip ───────────────────────────────────────────────────────────
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-card border border-primary/30 rounded-lg p-3 shadow-lg">
        <p className="text-foreground font-medium mb-1">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p
            key={i}
            className="text-sm"
            style={{ color: entry.color || entry.fill }}
          >
            {entry.name}:{" "}
            {typeof entry.value === "number"
              ? entry.value.toFixed(2)
              : entry.value}
            %
          </p>
        ))}
      </div>
    );
  };

  // ── Static content ───────────────────────────────────────────────────────────
  const conclusions = [
    {
      icon: Shield,
      title: "Effective Detection",
      description:
        "All four models — RF, SVM, DNN and CNN — demonstrate high effectiveness detecting various intrusion types in IoT networks.",
    },
    {
      icon: TrendingUp,
      title: "Deep Learning Edge",
      description:
        "DNN and CNN models leverage non-linear feature interactions, achieving superior precision on complex attack patterns.",
    },
    {
      icon: Cpu,
      title: "IoT Suitability",
      description:
        "TFLite-quantised DNN/CNN models are compact enough for Raspberry Pi deployment without sacrificing accuracy.",
    },
  ];

  const futureWork = [
    {
      icon: Clock,
      title: "Real-time Deployment",
      description:
        "Implementing live network traffic monitoring with instant threat detection on production IoT environments.",
      status: "Next Phase",
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/30",
    },
    {
      icon: Brain,
      title: "LSTM Integration",
      description:
        "Adding LSTM for temporal sequence modelling to detect slow-burn and multi-stage IoT attacks.",
      status: "Research",
      color: "text-neon-green",
      bgColor: "bg-neon-green/10",
      borderColor: "border-neon-green/30",
    },
    {
      icon: Cpu,
      title: "Edge Device Security",
      description:
        "Optimising models for direct deployment on IoT gateways for decentralised threat detection.",
      status: "Development",
      color: "text-neon-magenta",
      bgColor: "bg-neon-magenta/10",
      borderColor: "border-neon-magenta/30",
    },
    {
      icon: Cloud,
      title: "Cloud-Edge Hybrid",
      description:
        "Developing a hybrid architecture combining edge computing with cloud-based advanced analytics.",
      status: "Planned",
      color: "text-neon-purple",
      bgColor: "bg-neon-purple/10",
      borderColor: "border-neon-purple/30",
    },
    {
      icon: Lock,
      title: "Federated Learning",
      description:
        "Training models across multiple IoT networks while preserving data privacy with federated learning.",
      status: "Future",
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/30",
    },
  ];

  const teamMembers = [
    {
      name: "SHUBHAM KUMAR",
      role: "Team Member",
      icon: Code,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/30",
    },
    {
      name: "ASHISH RANJAN",
      role: "Team Member",
      icon: Code,
      color: "text-neon-green",
      bgColor: "bg-neon-green/10",
      borderColor: "border-neon-green/30",
    },
    {
      name: "MANIKANT KUMAR",
      role: "Team Member",
      icon: Code,
      color: "text-neon-purple",
      bgColor: "bg-neon-purple/10",
      borderColor: "border-neon-purple/30",
    },
    {
      name: "SACHIN KR YADAV",
      role: "Team Member",
      icon: BookOpen,
      color: "text-neon-magenta",
      bgColor: "bg-neon-magenta/10",
      borderColor: "border-neon-magenta/30",
    },
  ];

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="pt-16">
      {/* ── Results Charts ─────────────────────────────────────────────────── */}
      <section className="py-24 relative bg-secondary/30">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16 fade-in-up">
            <span className="font-mono text-primary text-sm tracking-wider uppercase mb-4 block">
              [ Results & Graphs ]
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
              Performance <span className="gradient-text">Analysis</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Comprehensive evaluation of all four models — Random Forest,
              Linear SVM, Deep Neural Network and 1D CNN — trained on the
              Bot-IoT dataset.
            </p>
          </div>

          {/* Best model badge */}
          {bestModel && (
            <div className="flex justify-center mb-10">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-neon-green/10 to-primary/10 border border-neon-green/30">
                <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                <span className="font-mono text-neon-green font-semibold">
                  Best Model: {MODEL_LABELS[bestModel]} —{" "}
                  {compare[bestModel as keyof CompareData]?.accuracy.toFixed(2)}
                  % accuracy
                </span>
              </div>
            </div>
          )}

          {/* Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* ── Bar Chart: Accuracy ── */}
            <div className="cyber-card p-6 fade-in-up stagger-1">
              <h3 className="font-display text-xl font-bold mb-6 text-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Model Accuracy Comparison
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={accuracyData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(185, 50%, 20%)"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "hsl(180, 20%, 60%)", fontSize: 11 }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fill: "hsl(180, 20%, 60%)" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="accuracy" radius={[8, 8, 0, 0]}>
                      {accuracyData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ── Pie Chart: Confusion Matrix ── */}
            <div className="cyber-card p-6 fade-in-up stagger-2">
              <h3 className="font-display text-xl font-bold mb-6 text-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                Confusion Matrix — {MODEL_LABELS[bestModel] ?? "Best Model"}
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
                      {confusionData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(240,10%,6%)",
                        border: "1px solid hsl(185,50%,20%)",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend
                      formatter={(v) => (
                        <span style={{ color: "hsl(180,20%,60%)" }}>{v}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ── Line Chart: All metrics all models ── */}
            <div className="cyber-card p-6 lg:col-span-2 fade-in-up stagger-3">
              <h3 className="font-display text-xl font-bold mb-6 text-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon-magenta animate-pulse" />
                Precision · Recall · F1 · Accuracy — All Models
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metricsData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(185, 50%, 20%)"
                    />
                    <XAxis
                      dataKey="metric"
                      tick={{ fill: "hsl(180, 20%, 60%)" }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fill: "hsl(180, 20%, 60%)" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      formatter={(v) => (
                        <span style={{ color: "hsl(180,100%,95%)" }}>
                          {MODEL_LABELS[v] ?? v}
                        </span>
                      )}
                    />
                    {MODEL_KEYS.filter((k) => compare[k]?.available).map(
                      (k) => (
                        <Line
                          key={k}
                          type="monotone"
                          dataKey={k}
                          name={k}
                          stroke={MODEL_COLORS[k]}
                          strokeWidth={3}
                          dot={{ fill: MODEL_COLORS[k], r: 6 }}
                          activeDot={{ r: 8 }}
                        />
                      ),
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ── Key Metric Cards ── */}
          <div className="mt-12 max-w-5xl mx-auto fade-in-up">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {MODEL_KEYS.filter((k) => compare[k]?.available).map((k) => (
                <div
                  key={k}
                  className={`cyber-card p-5 text-center hover-lift ${bestModel === k ? "ring-2 ring-neon-green/60" : ""}`}
                >
                  {bestModel === k && (
                    <span className="text-[10px] font-mono text-neon-green uppercase tracking-widest block mb-1">
                      ★ Best
                    </span>
                  )}
                  <div
                    className="text-3xl font-display font-bold mb-1"
                    style={{ color: MODEL_COLORS[k] }}
                  >
                    {compare[k]!.accuracy.toFixed(2)}%
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {MODEL_LABELS[k]}
                  </p>
                  <p className="text-muted-foreground text-xs mt-1">
                    F1: {compare[k]!.f1.toFixed(2)}%
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Detailed Metrics Table ── */}
          <div className="mt-10 max-w-5xl mx-auto fade-in-up">
            <div className="cyber-card p-6 overflow-x-auto">
              <h3 className="font-display text-lg font-bold mb-4 text-foreground">
                Detailed Metrics Table
              </h3>
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2 pr-4 text-muted-foreground font-mono">
                      Model
                    </th>
                    <th className="py-2 pr-4 text-muted-foreground">
                      Accuracy
                    </th>
                    <th className="py-2 pr-4 text-muted-foreground">
                      Precision
                    </th>
                    <th className="py-2 pr-4 text-muted-foreground">Recall</th>
                    <th className="py-2 pr-4 text-muted-foreground">
                      F1-Score
                    </th>
                    <th className="py-2 text-muted-foreground">Test Samples</th>
                  </tr>
                </thead>
                <tbody>
                  {MODEL_KEYS.filter((k) => compare[k]?.available).map((k) => {
                    const m = compare[k]!;
                    return (
                      <tr
                        key={k}
                        className={`border-b border-border/50 ${bestModel === k ? "bg-neon-green/5" : ""}`}
                      >
                        <td
                          className="py-3 pr-4 font-mono font-semibold"
                          style={{ color: MODEL_COLORS[k] }}
                        >
                          {MODEL_LABELS[k]}
                          {bestModel === k ? " ★" : ""}
                        </td>
                        <td className="py-3 pr-4 text-foreground">
                          {m.accuracy.toFixed(2)}%
                        </td>
                        <td className="py-3 pr-4 text-foreground">
                          {m.precision.toFixed(2)}%
                        </td>
                        <td className="py-3 pr-4 text-foreground">
                          {m.recall.toFixed(2)}%
                        </td>
                        <td className="py-3 pr-4 text-foreground">
                          {m.f1.toFixed(2)}%
                        </td>
                        <td className="py-3 text-foreground">
                          {m.test_samples.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── Conclusion ─────────────────────────────────────────────────────── */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 fade-in-up">
            <span className="font-mono text-primary text-sm tracking-wider uppercase mb-4 block">
              [ Conclusion ]
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
              Project <span className="gradient-text">Conclusion</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="cyber-card p-8 md:p-12 mb-12 fade-in-up stagger-1">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-neon-green/10 border border-neon-green/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-neon-green" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mt-2">
                  Summary of Findings
                </h3>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  This project successfully demonstrates the effectiveness of
                  machine learning and deep learning based intrusion detection
                  systems for IoT environments. Through the implementation and
                  evaluation of Random Forest, SVM, DNN and CNN algorithms, we
                  show that these techniques accurately identify and classify
                  various types of cyber attacks targeting IoT networks.
                </p>
                <p>
                  Experimental results on the Bot-IoT dataset validate high
                  detection accuracy while maintaining computational efficiency.
                  Deep learning models (DNN, CNN) achieve superior pattern
                  recognition, while classical models (RF, SVM) offer faster
                  inference — both suitable for edge IoT deployment.
                </p>
                <p className="text-neon-green">
                  The best performing model will be deployed on Raspberry Pi as
                  a real-time network gateway IDS, blocking malicious packets
                  while allowing legitimate traffic through.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {conclusions.map((item, i) => (
                <div
                  key={item.title}
                  className={`cyber-card p-6 hover-lift fade-in-up stagger-${i + 2}`}
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

      {/* ── Future Scope ───────────────────────────────────────────────────── */}
      <section className="py-24 relative bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 fade-in-up">
            <span className="font-mono text-primary text-sm tracking-wider uppercase mb-4 block">
              [ Future Scope ]
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
              What's <span className="gradient-text">Next?</span>
            </h2>
          </div>
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {futureWork.map((item, i) => (
                <div
                  key={item.title}
                  className={`cyber-card p-6 hover-lift fade-in-up stagger-${(i % 5) + 1} ${i === 0 ? "lg:col-span-2 md:col-span-2" : ""}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-lg ${item.bgColor} border ${item.borderColor} flex items-center justify-center`}
                    >
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full ${item.bgColor} border ${item.borderColor} ${item.color} text-xs font-medium`}
                    >
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

      {/* ── Team ───────────────────────────────────────────────────────────── */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 fade-in-up">
            <span className="font-mono text-primary text-sm tracking-wider uppercase mb-4 block">
              [ Team Members ]
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
              Meet Our <span className="gradient-text">Team</span>
            </h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, i) => (
                <div
                  key={member.name}
                  className={`cyber-card p-6 text-center hover-lift fade-in-up stagger-${i + 1}`}
                >
                  <div
                    className={`w-20 h-20 mx-auto rounded-full ${member.bgColor} border-2 ${member.borderColor} flex items-center justify-center mb-4`}
                  >
                    <member.icon className={`w-8 h-8 ${member.color}`} />
                  </div>
                  <h3 className="font-display font-bold mb-1 text-foreground text-lg">
                    {member.name}
                  </h3>
                  <span
                    className={`inline-block px-3 py-1 rounded-full ${member.bgColor} border ${member.borderColor} ${member.color} text-xs font-medium`}
                  >
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center fade-in-up">
              <div className="cyber-card px-10 py-8 max-w-xl mx-auto">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <User className="w-8 h-8 text-neon-green" />
                  <span className="font-display text-xl font-bold text-foreground">
                    Guided By
                  </span>
                </div>
                <p className="text-2xl font-display font-bold text-neon-green neon-text-green">
                  DR. SUDHIR KR. PANDEY
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                  Faculty Advisor, CSE Department
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GitHub ─────────────────────────────────────────────────────────── */}
      <section className="py-24 relative bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 fade-in-up">
            <span className="font-mono text-primary text-sm tracking-wider uppercase mb-4 block">
              [ Source Code ]
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">GitHub</span> Repository
            </h2>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="cyber-card p-8 text-center hover-lift fade-in-up stagger-1">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                <Github className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                IoT-IDS-ML
              </h3>
              <p className="text-muted-foreground mb-6">
                Smart IoT Intrusion Detection using RF, SVM, DNN &amp; CNN
              </p>
              <div className="flex justify-center gap-6 mb-8">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Code2 className="w-4 h-4" />
                  <span className="text-sm">Python</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Star className="w-4 h-4" />
                  <span className="text-sm">Star</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GitBranch className="w-4 h-4" />
                  <span className="text-sm">Fork</span>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/10 border border-primary/30">
                <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                <span className="font-mono text-primary">
                  Repository Coming Soon
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ────────────────────────────────────────────────────────── */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 fade-in-up">
            <span className="font-mono text-primary text-sm tracking-wider uppercase mb-4 block">
              [ Contact ]
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
              Get In <span className="gradient-text">Touch</span>
            </h2>
          </div>
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
            {[
              {
                icon: GraduationCap,
                color: "text-primary",
                bg: "bg-primary/10",
                border: "border-primary/20",
                title: "Institution",
                line1: "Loknayak Jai Prakash Institute of Technology",
                line2: "LNJPIT, Chapra",
                line2Color: "text-primary",
              },
              {
                icon: MapPin,
                color: "text-neon-green",
                bg: "bg-neon-green/10",
                border: "border-neon-green/20",
                title: "Department",
                line1: "Computer Science & Engineering",
                line2: "8th Semester",
                line2Color: "text-neon-green",
              },
              {
                icon: Mail,
                color: "text-neon-magenta",
                bg: "bg-neon-magenta/10",
                border: "border-neon-magenta/20",
                title: "Contact",
                line1: "For project inquiries",
                line2: "Via College",
                line2Color: "text-neon-magenta",
              },
            ].map((c, i) => (
              <div
                key={c.title}
                className={`cyber-card p-6 text-center hover-lift fade-in-up stagger-${i + 1}`}
              >
                <div
                  className={`w-14 h-14 mx-auto rounded-xl ${c.bg} border ${c.border} flex items-center justify-center mb-4`}
                >
                  <c.icon className={`w-7 h-7 ${c.color}`} />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">
                  {c.title}
                </h3>
                <p className="text-muted-foreground text-sm">{c.line1}</p>
                <p className={`${c.line2Color} text-sm font-mono mt-1`}>
                  {c.line2}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Results;
