import { useState, useRef, useEffect } from "react";
import {
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle,
  Shield,
  Activity,
  Zap,
  XCircle,
  Loader2,
  Download,
  RotateCcw,
  Clock,
  Cpu,
  FlaskConical,
  Brain,
  Network,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  predict,
  ModelType,
  MODEL_NAMES,
  NetworkFeatures,
  PredictionResult,
} from "@/services/predictionService";

// ── Model metadata ────────────────────────────────────────────────────────────
const MODEL_OPTIONS: {
  value: ModelType;
  label: string;
  badge: string;
  color: string;
  icon: React.ReactNode;
  description: string;
}[] = [
    {
      value: "rf",
      label: "Random Forest",
      badge: "RF",
      color: "bg-neon-green",
      icon: <Activity className="w-4 h-4" />,
      description: "Ensemble tree-based classifier. Fast and interpretable.",
    },
    {
      value: "linear_svm",
      label: "Linear SVM",
      badge: "SVM",
      color: "bg-primary",
      icon: <Zap className="w-4 h-4" />,
      description: "Support vector machine with linear kernel. High precision.",
    },
    {
      value: "dnn",
      label: "Deep Neural Network",
      badge: "DNN",
      color: "bg-neon-purple",
      icon: <Brain className="w-4 h-4" />,
      description: "Fully-connected deep network. Learns complex patterns.",
    },
    {
      value: "cnn",
      label: "Convolutional Neural Net",
      badge: "CNN",
      color: "bg-neon-magenta",
      icon: <Network className="w-4 h-4" />,
      description: "1-D CNN over feature sequence. Best for spatial structure.",
    },
  ];

const ACCENT: Record<ModelType, string> = {
  rf: "neon-green",
  linear_svm: "primary",
  dnn: "neon-purple",
  cnn: "neon-magenta",
};

const getModelMeta = (m: ModelType) =>
  MODEL_OPTIONS.find((o) => o.value === m)!;

// ── BOT-IoT realistic quick-test samples keyed by feature name ───────────────
// These cover both classical (raw numeric) and one-hot encoded features used
// by the deep-learning models trained on BOT-IoT.
function buildSampleForFeatures(
  modelFeatures: string[],
  type: "attack" | "normal",
): Record<string, number> {
  const sample: Record<string, number> = {};

  for (const f of modelFeatures) {
    const n = f.toLowerCase();

    // ── One-hot: protocol ────────────────────────────────────────────────────
    if (n.startsWith("proto_")) {
      if (type === "attack") {
        // BOT-IoT DoS/DDoS attacks predominantly use UDP
        sample[f] = n === "proto_udp" ? 1 : 0;
      } else {
        sample[f] = n === "proto_tcp" ? 1 : 0;
      }
      continue;
    }

    // ── One-hot: category ────────────────────────────────────────────────────
    if (n.startsWith("category_")) {
      if (type === "attack") {
        // BOT-IoT label: DDoS is the dominant attack category
        sample[f] = n.includes("ddos") || n.includes("dos") ? 1 : 0;
      } else {
        sample[f] = n.includes("normal") ? 1 : 0;
      }
      continue;
    }

    // ── One-hot: subcategory ─────────────────────────────────────────────────
    if (n.includes("subcategory") || n.startsWith("subcategory_")) {
      if (type === "attack") {
        sample[f] = n.includes("udp_flood") || n.includes("http_flood") ? 1 : 0;
      } else {
        sample[f] = n.includes("normal") ? 1 : 0;
      }
      continue;
    }

    // ── One-hot: state ───────────────────────────────────────────────────────
    if (n.startsWith("state_")) {
      // CON = established connection (both); RST/FIN more common in attacks
      if (type === "attack") {
        sample[f] = n.includes("rst") || n.includes("fin") ? 1 : 0;
      } else {
        sample[f] = n.includes("con") ? 1 : 0;
      }
      continue;
    }

    // ── Packet count / rate ──────────────────────────────────────────────────
    if (
      n === "pkts" ||
      n === "spkts" ||
      n.includes("pkts_per") ||
      n.includes("pktcount")
    ) {
      sample[f] = type === "attack" ? 10000 : 40;
      continue;
    }
    if (n === "dpkts") {
      sample[f] = type === "attack" ? 0 : 38; // attack = one-way flood
      continue;
    }

    // ── Byte count ───────────────────────────────────────────────────────────
    if (n === "sbytes" || n === "bytes" || n.includes("bytecount")) {
      sample[f] = type === "attack" ? 640000 : 51200;
      continue;
    }
    if (n === "dbytes") {
      sample[f] = type === "attack" ? 0 : 40960;
      continue;
    }

    // ── Rate (pkts/s, bits/s) ────────────────────────────────────────────────
    if (n === "rate" || n.includes("_rate") || n.includes("rate_")) {
      sample[f] = type === "attack" ? 100000 : 80;
      continue;
    }

    // ── Duration ─────────────────────────────────────────────────────────────
    if (n === "dur" || n.includes("duration")) {
      // Attack flows are extremely short (flood) or long (slow loris)
      sample[f] = type === "attack" ? 0.001 : 12.5;
      continue;
    }

    // ── Mean / std packet size ───────────────────────────────────────────────
    if (
      n.includes("mean") ||
      n.includes("std") ||
      n === "smeansz" ||
      n === "dmeansz"
    ) {
      sample[f] = type === "attack" ? 64 : 512;
      continue;
    }

    // ── TCP flags ────────────────────────────────────────────────────────────
    if (
      n.includes("flag") ||
      n === "syncount" ||
      n === "fincount" ||
      n === "rstcount"
    ) {
      sample[f] = type === "attack" ? 1 : 0;
      continue;
    }

    // ── Port numbers ─────────────────────────────────────────────────────────
    if (n === "sport" || n === "srcport" || n.includes("src_port")) {
      sample[f] = type === "attack" ? 12345 : 54321;
      continue;
    }
    if (n === "dport" || n === "dstport" || n.includes("dst_port")) {
      sample[f] = type === "attack" ? 80 : 443;
      continue;
    }

    // ── Load (bits/s averaged) ───────────────────────────────────────────────
    if (n === "sload" || n === "dload" || n.includes("load")) {
      sample[f] = type === "attack" ? 5120000 : 4096;
      continue;
    }

    // ── Inter-arrival time ───────────────────────────────────────────────────
    if (n.includes("iat") || n.includes("inter_arr")) {
      sample[f] = type === "attack" ? 0.00001 : 0.25;
      continue;
    }

    // ── Window size ──────────────────────────────────────────────────────────
    if (n.includes("win") || n === "swin" || n === "dwin") {
      sample[f] = type === "attack" ? 0 : 255;
      continue;
    }

    // ── Sequence / loss ──────────────────────────────────────────────────────
    if (n.includes("loss") || n.includes("retrans")) {
      sample[f] = type === "attack" ? 1 : 0;
      continue;
    }

    // ── Default ──────────────────────────────────────────────────────────────
    sample[f] = type === "attack" ? 1 : 0;
  }

  return sample;
}

// ── Component ─────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [selectedModel, setSelectedModel] = useState<ModelType>("rf");
  const [activeTab, setActiveTab] = useState("csv");
  const [file, setFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [manualInput, setManualInput] = useState<Record<string, any>>({
    protocol: "TCP",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [modelFeatures, setModelFeatures] = useState<string[]>([]);
  const [featuresLoading, setFeaturesLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [predictionHistory, setPredictionHistory] = useState<
    PredictionResult[]
  >([]);
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch backend feature list on model change
  useEffect(() => {
    let mounted = true;
    setFeaturesLoading(true);
    setManualInput({ protocol: "TCP" });
    setErrors({});

    fetch(`https://bot-iot-backend.onrender.com//models/${selectedModel}/features`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed");
        return r.json();
      })
      .then((data) => {
        if (!mounted) return;
        const feats: string[] = Array.isArray(data.features)
          ? data.features
          : [];
        if (feats.length > 0) setModelFeatures(feats);
      })
      .catch((e) => console.warn("Feature fetch failed:", e))
      .finally(() => {
        if (mounted) setFeaturesLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [selectedModel]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const f = e.target.files[0];
    if (!f.name.endsWith(".csv")) {
      setErrors({ file: "Please upload a CSV file" });
      return;
    }
    setFile(f);
    setPrediction(null);
    setErrors({});
    const reader = new FileReader();
    reader.onload = (ev) =>
      setCsvPreview((ev.target?.result as string).split("\n").slice(0, 6));
    reader.readAsText(f);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setManualInput((prev) => ({
      ...prev,
      [field]:
        field === "protocol"
          ? String(value).toUpperCase()
          : value === ""
            ? undefined
            : Number(value),
    }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateManualInput = (): boolean => {
    const newErrors: Record<string, string> = {};
    for (const f of modelFeatures) {
      const v = manualInput[f];
      if (f === "protocol") {
        if (!v || !["TCP", "UDP", "ICMP"].includes(String(v).toUpperCase()))
          newErrors.protocol = "Protocol must be TCP, UDP, or ICMP";
        continue;
      }
      if (v === undefined || v === null || v === "" || Number.isNaN(Number(v)))
        newErrors[f] = "Required numeric value";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCSVUpload = async () => {
    if (!file) return;
    setIsLoading(true);
    setPrediction(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("model", selectedModel);
      const res = await fetch("https://bot-iot-backend.onrender.com//upload", {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error((e as any).error || "Upload failed");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "predictions.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setPrediction({
        prediction: "normal",
        probability: 0,
        model: selectedModel,
        modelName: MODEL_NAMES[selectedModel],
        timestamp: new Date().toISOString(),
        probabilitySource: "model",
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualPredict = async () => {
    if (!validateManualInput()) return;
    setIsLoading(true);
    setPrediction(null);
    setApiError(null);
    try {
      const featuresToSend: Record<string, any> = {};
      for (const f of modelFeatures) {
        const v = manualInput[f];
        featuresToSend[f] =
          v === undefined || v === null || v === ""
            ? f === "protocol"
              ? "TCP"
              : 0
            : v;
      }
      const result = await predict({
        model: selectedModel,
        features: featuresToSend,
        source: "manual",
      });
      setPrediction(result);
      setPredictionHistory((prev) => [result, ...prev.slice(0, 9)]);
    } catch (e: any) {
      setApiError(e?.message || "Prediction failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickTest = async (type: "attack" | "normal") => {
    if (modelFeatures.length === 0) return;
    const features = buildSampleForFeatures(modelFeatures, type);
    setManualInput(features);
    setIsLoading(true);
    setPrediction(null);
    try {
      const result = await predict({
        model: selectedModel,
        features,
        source: "quick-test",
      });
      setPrediction(result);
      setPredictionHistory((prev) => [result, ...prev.slice(0, 9)]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setPrediction(null);
    setFile(null);
    setCsvPreview([]);
    setManualInput({ protocol: "TCP" });
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const fmt = (iso: string) => new Date(iso).toLocaleString();
  const accent = ACCENT[selectedModel] ?? "primary";
  const selectedMeta = getModelMeta(selectedModel);
  const isDL = ["dnn", "cnn"].includes(selectedModel);

  return (
    <div className="pt-16 min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="py-16 relative cyber-grid">
        <div className="container mx-auto px-4 text-center fade-in-up">
          <span className="font-mono text-primary text-sm tracking-wider uppercase mb-4 block">
            [ Live Detection ]
          </span>
          <h1 className="font-display text-3xl md:text-5xl font-bold mb-6">
            Intrusion <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Upload network traffic data or manually input features for real-time
            intrusion detection across four ML/DL models.
          </p>
        </div>
      </section>

      {/* ── Model selector ───────────────────────────────────────────────── */}
      <section className="pb-8 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Card className="cyber-card border-neon-purple/20">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {MODEL_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSelectedModel(opt.value);
                        setApiError(null);
                      }}
                      className={`relative p-4 rounded-xl border text-left transition-all duration-200 ${selectedModel === opt.value
                        ? "border-current/60 shadow-lg " +
                        opt.color.replace("bg-", "bg-") +
                        "/10"
                        : "border-border/30 bg-background/30 hover:border-border/60 hover:bg-secondary/30"
                        }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${opt.color} text-background`}
                        >
                          {opt.badge}
                        </span>
                        {selectedModel === opt.value && (
                          <CheckCircle className="w-4 h-4 text-neon-green" />
                        )}
                      </div>
                      <p className="font-display font-bold text-sm text-foreground mb-1">
                        {opt.label}
                      </p>
                      <p className="text-xs text-muted-foreground leading-snug">
                        {opt.description}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Active model bar */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/20">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-${accent} bg-${accent}/10 border border-${accent}/30`}
                  >
                    {selectedMeta.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      Active model:{" "}
                      <span className={`text-${accent}`}>
                        {selectedMeta.label}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedMeta.description}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <span
                      className={`text-xs font-mono px-2 py-1 rounded bg-${accent}/10 text-${accent} border border-${accent}/20`}
                    >
                      {selectedMeta.badge}
                    </span>
                    {isDL && (
                      <span className="text-xs font-mono px-2 py-1 rounded bg-neon-purple/10 text-neon-purple border border-neon-purple/20">
                        TFLite
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground font-mono">
                      {featuresLoading
                        ? "loading…"
                        : `${modelFeatures.length} features`}
                    </span>
                  </div>
                </div>

                {/* DNN/CNN confidence note */}
                {isDL && (
                  <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-neon-purple/5 border border-neon-purple/20 text-xs text-muted-foreground">
                    <Info className="w-4 h-4 text-neon-purple shrink-0 mt-0.5" />
                    <span>
                      <span className="text-neon-purple font-semibold">
                        DNN / CNN note:
                      </span>{" "}
                      Deep-learning models use argmax (hard decision) —
                      confidence bar shows 95% for attack / 5% for normal as a
                      visual indicator only, not a real probability.
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Tabs ─────────────────────────────────────────────────────────── */}
      <section className="py-8 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-8"
            >
              <TabsList className="grid grid-cols-3 w-full max-w-xl mx-auto bg-secondary/50 p-1">
                <TabsTrigger
                  value="csv"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  CSV Upload
                </TabsTrigger>
                <TabsTrigger
                  value="manual"
                  className="data-[state=active]:bg-neon-green data-[state=active]:text-background"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Manual Input
                </TabsTrigger>
                <TabsTrigger
                  value="quick"
                  className="data-[state=active]:bg-neon-magenta data-[state=active]:text-background"
                >
                  <FlaskConical className="w-4 h-4 mr-2" />
                  Quick Test
                </TabsTrigger>
              </TabsList>

              {/* CSV Tab */}
              <TabsContent value="csv" className="fade-in-up">
                <Card className="cyber-card border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="w-5 h-5 text-primary" />
                      CSV File Upload
                    </CardTitle>
                    <CardDescription>
                      Batch prediction using{" "}
                      <span className={`text-${accent} font-semibold`}>
                        {selectedMeta.label}
                      </span>
                      .
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${errors.file
                        ? "border-destructive/50 bg-destructive/5"
                        : "border-primary/30 hover:border-primary/50"
                        }`}
                    >
                      <FileText className="w-12 h-12 text-primary/50 mx-auto mb-4" />
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="hidden"
                        id="csv-upload"
                      />
                      <label
                        htmlFor="csv-upload"
                        className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {file ? (
                          <span className="text-primary font-medium">
                            {file.name}
                          </span>
                        ) : (
                          <>
                            <span className="block font-medium mb-1">
                              Click to upload CSV
                            </span>
                            <span className="text-sm">or drag and drop</span>
                          </>
                        )}
                      </label>
                      {errors.file && (
                        <p className="text-destructive text-sm mt-2">
                          {errors.file}
                        </p>
                      )}
                    </div>

                    {csvPreview.length > 0 && (
                      <div className="bg-secondary/30 rounded-lg p-4 overflow-x-auto">
                        <p className="text-sm text-muted-foreground mb-2">
                          Preview (first 5 rows):
                        </p>
                        <pre className="font-mono text-xs text-foreground/80">
                          {csvPreview.map((line, i) => (
                            <div
                              key={i}
                              className={
                                i === 0 ? "text-primary font-bold" : ""
                              }
                            >
                              {line}
                            </div>
                          ))}
                        </pre>
                      </div>
                    )}

                    <Button
                      onClick={handleCSVUpload}
                      disabled={!file || isLoading}
                      className="w-full neon-border-cyan"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                          Analyzing with {selectedMeta.badge}…
                        </>
                      ) : (
                        <>
                          <Shield className="mr-2 w-4 h-4" />
                          Analyze Traffic
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Manual Tab */}
              <TabsContent value="manual" className="fade-in-up">
                <Card className="cyber-card border-neon-green/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-neon-green" />
                      Manual Feature Input
                    </CardTitle>
                    <CardDescription>
                      Single prediction using{" "}
                      <span className={`text-${accent} font-semibold`}>
                        {selectedMeta.label}
                      </span>
                      .
                      <div className="text-xs text-muted-foreground mt-2">
                        {featuresLoading
                          ? "Loading fields…"
                          : `${modelFeatures.length} features: ${modelFeatures.join(", ")}`}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {modelFeatures.map((f) => {
                        const value = manualInput[f] ?? "";
                        const error = errors[f];
                        if (f === "protocol") {
                          return (
                            <div key={f}>
                              <label className="text-sm text-muted-foreground mb-1 block">
                                Protocol{" "}
                                <span className="text-destructive">*</span>
                              </label>
                              <Select
                                value={String(value || "TCP")}
                                onValueChange={(v) =>
                                  handleInputChange("protocol", v)
                                }
                              >
                                <SelectTrigger
                                  className={`bg-background/50 ${error ? "border-destructive" : ""}`}
                                >
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-background border-border">
                                  <SelectItem value="TCP">TCP</SelectItem>
                                  <SelectItem value="UDP">UDP</SelectItem>
                                  <SelectItem value="ICMP">ICMP</SelectItem>
                                </SelectContent>
                              </Select>
                              {error && (
                                <span className="text-destructive text-xs">
                                  {error}
                                </span>
                              )}
                            </div>
                          );
                        }
                        const label = f
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (s) => s.toUpperCase());
                        return (
                          <div key={f}>
                            <label className="text-sm text-muted-foreground mb-1 block">
                              {label}
                            </label>
                            <Input
                              type="number"
                              value={value}
                              onChange={(e) =>
                                handleInputChange(
                                  f as keyof NetworkFeatures,
                                  e.target.value,
                                )
                              }
                              placeholder="0"
                              className={`bg-background/50 ${error ? "border-destructive" : ""}`}
                            />
                            {error && (
                              <span className="text-destructive text-xs">
                                {error}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {apiError && (
                      <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                        {apiError}
                      </div>
                    )}

                    <Button
                      onClick={handleManualPredict}
                      disabled={
                        isLoading ||
                        featuresLoading ||
                        modelFeatures.length === 0
                      }
                      className="w-full bg-neon-green/10 text-neon-green hover:bg-neon-green/20 border border-neon-green/30"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                          Predicting with {selectedMeta.badge}…
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 w-4 h-4" />
                          Run Prediction
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Quick Test Tab */}
              {/* Quick Test Tab */}
              <TabsContent value="quick" className="fade-in-up">
                <Card className="cyber-card border-neon-magenta/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FlaskConical className="w-5 h-5 text-neon-magenta" />
                      Quick Test Mode
                    </CardTitle>
                    <CardDescription>
                      Test{" "}
                      <span className={`text-${accent} font-semibold`}>
                        {selectedMeta.label}
                      </span>{" "}
                      with BOT-IoT realistic traffic samples. Features are
                      auto-built from the model's actual feature list.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {featuresLoading ? (
                      <p className="text-xs text-muted-foreground text-center font-mono">
                        Loading model features before test…
                      </p>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-4">
                        {/* Attack card — values come from buildSampleForFeatures */}
                        {(() => {
                          const sample = modelFeatures.length > 0
                            ? buildSampleForFeatures(modelFeatures, "attack")
                            : null;
                          return (
                            <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
                              <div className="flex items-center gap-2 mb-3">
                                <AlertTriangle className="w-5 h-5 text-destructive" />
                                <h4 className="font-display font-bold text-destructive">
                                  Attack Sample
                                </h4>
                              </div>
                              {sample ? (
                                <ul className="space-y-1.5 text-base text-muted-foreground font-mono max-h-64 overflow-y-auto pr-1">
                                  {Object.entries(sample).map(([k, v]) => (
                                    <li key={k} className="flex justify-between gap-2">
                                      <span className="text-foreground/70 truncate">{k}:</span>
                                      <span className="text-destructive font-semibold shrink-0">{v}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-xs text-muted-foreground">No features loaded.</p>
                              )}
                            </div>
                          );
                        })()}

                        {/* Normal card — values come from buildSampleForFeatures */}
                        {(() => {
                          const sample = modelFeatures.length > 0
                            ? buildSampleForFeatures(modelFeatures, "normal")
                            : null;
                          return (
                            <div className="p-4 rounded-xl bg-neon-green/5 border border-neon-green/20">
                              <div className="flex items-center gap-2 mb-3">
                                <CheckCircle className="w-5 h-5 text-neon-green" />
                                <h4 className="font-display font-bold text-neon-green">
                                  Normal Sample
                                </h4>
                              </div>
                              {sample ? (
                                <ul className="space-y-1.5 text-base text-muted-foreground font-mono max-h-64 overflow-y-auto pr-1">
                                  {Object.entries(sample).map(([k, v]) => (
                                    <li key={k} className="flex justify-between gap-2">
                                      <span className="text-foreground/70 truncate">{k}:</span>
                                      <span className="text-neon-green font-semibold shrink-0">{v}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-xs text-muted-foreground">No features loaded.</p>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        onClick={() => handleQuickTest("attack")}
                        disabled={isLoading || featuresLoading || modelFeatures.length === 0}
                        className="flex-1 bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/30"
                      >
                        {isLoading ? (
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        ) : (
                          <AlertTriangle className="mr-2 w-4 h-4" />
                        )}
                        Simulate Attack
                      </Button>
                      <Button
                        onClick={() => handleQuickTest("normal")}
                        disabled={isLoading || featuresLoading || modelFeatures.length === 0}
                        className="flex-1 bg-neon-green/10 text-neon-green hover:bg-neon-green/20 border border-neon-green/30"
                      >
                        {isLoading ? (
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="mr-2 w-4 h-4" />
                        )}
                        Simulate Normal Traffic
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* ── Prediction result ─────────────────────────────────────────── */}
          {prediction && (
            <div className="max-w-4xl mx-auto mt-12 fade-in-up">
              <Card
                className={`cyber-card ${prediction.prediction === "attack" ? "border-destructive/50" : "border-neon-green/50"}`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    {prediction.prediction === "attack" ? (
                      <AlertTriangle className="w-6 h-6 text-destructive" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-neon-green" />
                    )}
                    Prediction Result
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Main banner */}
                  <div
                    className={`p-6 rounded-xl text-center ${prediction.prediction === "attack"
                      ? "bg-destructive/10 border border-destructive/30"
                      : "bg-neon-green/10 border border-neon-green/30"
                      }`}
                  >
                    {prediction.prediction === "attack" ? (
                      <XCircle className="w-16 h-16 text-destructive mx-auto mb-3" />
                    ) : (
                      <CheckCircle className="w-16 h-16 text-neon-green mx-auto mb-3" />
                    )}
                    <h3
                      className={`font-display text-2xl font-bold ${prediction.prediction === "attack"
                        ? "text-destructive"
                        : "text-neon-green"
                        }`}
                    >
                      {prediction.prediction === "attack"
                        ? "INTRUSION DETECTED"
                        : "NORMAL TRAFFIC"}
                    </h3>
                    {prediction.attackType &&
                      prediction.prediction === "attack" && (
                        <p className="text-destructive/80 mt-2">
                          Attack Type:{" "}
                          <span className="font-bold">
                            {prediction.attackType}
                          </span>
                        </p>
                      )}
                  </div>

                  {/* Meta grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-secondary/30">
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <Cpu className="w-4 h-4" />
                        <span className="text-sm">Model Used</span>
                      </div>
                      <p className="font-display font-bold text-foreground">
                        {prediction.modelName}
                      </p>
                      <span
                        className={`text-xs font-mono px-2 py-0.5 rounded bg-${accent}/10 text-${accent} border border-${accent}/20 mt-1 inline-block`}
                      >
                        {selectedMeta.badge}
                      </span>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/30">
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">Timestamp</span>
                      </div>
                      <p className="font-mono text-sm text-foreground">
                        {fmt(prediction.timestamp)}
                      </p>
                    </div>
                  </div>

                  {/* Confidence bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground flex items-center gap-1">
                        Confidence Level
                        {prediction.probabilitySource === "argmax" && (
                          <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-neon-purple/10 text-neon-purple border border-neon-purple/20 ml-1">
                            argmax
                          </span>
                        )}
                      </span>
                      <span
                        className={
                          prediction.prediction === "attack"
                            ? "text-destructive"
                            : "text-neon-green"
                        }
                      >
                        {prediction.probability.toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      value={prediction.probability}
                      className={`h-3 ${prediction.prediction === "attack" ? "[&>div]:bg-destructive" : "[&>div]:bg-neon-green"}`}
                    />
                    {prediction.probabilitySource === "argmax" && (
                      <p className="text-xs text-muted-foreground mt-1">
                        * DNN/CNN models output a hard class label (argmax).
                        Confidence shown is indicative only.
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={clearResults}
                      className="flex-1"
                    >
                      <RotateCcw className="mr-2 w-4 h-4" />
                      Clear Results
                    </Button>
                    <Button className="flex-1 neon-border-cyan">
                      <Download className="mr-2 w-4 h-4" />
                      Download Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ── History ───────────────────────────────────────────────────── */}
          {predictionHistory.length > 0 && (
            <div className="max-w-4xl mx-auto mt-12">
              <h3 className="font-display text-xl font-bold mb-4 text-foreground flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                Recent Predictions
              </h3>
              <div className="space-y-3">
                {predictionHistory.slice(0, 5).map((r, i) => (
                  <div
                    key={`${r.timestamp}-${i}`}
                    className={`p-4 rounded-lg border flex items-center justify-between ${r.prediction === "attack"
                      ? "bg-destructive/5 border-destructive/20"
                      : "bg-neon-green/5 border-neon-green/20"
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      {r.prediction === "attack" ? (
                        <XCircle className="w-6 h-6 text-destructive" />
                      ) : (
                        <CheckCircle className="w-6 h-6 text-neon-green" />
                      )}
                      <div>
                        <p
                          className={`font-bold ${r.prediction === "attack" ? "text-destructive" : "text-neon-green"}`}
                        >
                          {r.prediction === "attack"
                            ? "Attack Detected"
                            : "Normal Traffic"}
                          {r.attackType && ` — ${r.attackType}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {r.modelName} • {fmt(r.timestamp)}
                          {r.probabilitySource === "argmax" && (
                            <span className="ml-2 text-xs font-mono text-neon-purple">
                              [argmax]
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`font-mono font-bold ${r.prediction === "attack" ? "text-destructive" : "text-neon-green"}`}
                    >
                      {r.probability.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Footer note ───────────────────────────────────────────────── */}
          <div className="max-w-2xl mx-auto mt-12">
            <div className="p-6 rounded-xl bg-neon-magenta/5 border border-neon-magenta/20 text-center">
              <Zap className="w-8 h-8 text-neon-magenta mx-auto mb-3" />
              <h4 className="font-display font-bold text-foreground mb-2">
                4-Model Backend Connected
              </h4>
              <p className="text-muted-foreground text-sm">
                RF, Linear SVM, DNN, and CNN endpoints are served by{" "}
                <code className="text-primary bg-primary/10 px-1 rounded">
                  app.py
                </code>{" "}
                on{" "}
                <code className="text-primary bg-primary/10 px-1 rounded">
                  localhost:5020
                </code>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
