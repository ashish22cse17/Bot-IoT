// ── Model types — must match app.py ALL_MODEL_NAMES ─────────────────────────
export type ModelType = 'rf' | 'linear_svm' | 'dnn' | 'cnn';

export type PredictionLabel = 'attack' | 'normal';

export interface NetworkFeatures {
  packetSize: number;
  flowDuration: number;
  protocol: string;
  srcPort: number;
  dstPort: number;
  packetRate: number;
  byteRate?: number;
  flowPackets?: number;
  tcpFlags?: number;
  payloadSize?: number;
}

export interface PredictionRequest {
  model: ModelType;
  features: Record<string, any>;
  source?: 'csv' | 'manual' | 'quick-test';
}

export interface PredictionResult {
  prediction: PredictionLabel;
  probability: number;
  model: ModelType;
  modelName: string;
  timestamp: string;
  attackType?: string;
  features?: Record<string, any>;
  /** 'model' = real softmax probability (RF/SVM), 'argmax' = hard decision (DNN/CNN) */
  probabilitySource: 'model' | 'argmax';
}

// ── Quick Test samples (BOT-IoT realistic values) ────────────────────────────
export const ATTACK_SAMPLE: NetworkFeatures = {
  packetSize: 64,
  flowDuration: 100,
  protocol: 'UDP',
  srcPort: 12345,
  dstPort: 80,
  packetRate: 50000,
  byteRate: 3200000,
  flowPackets: 5000,
  tcpFlags: 0,
  payloadSize: 0,
};

export const NORMAL_SAMPLE: NetworkFeatures = {
  packetSize: 1024,
  flowDuration: 5000,
  protocol: 'TCP',
  srcPort: 54321,
  dstPort: 443,
  packetRate: 100,
  byteRate: 102400,
  flowPackets: 50,
  tcpFlags: 24,
  payloadSize: 512,
};

// ── Display names ─────────────────────────────────────────────────────────────
export const MODEL_NAMES: Record<ModelType, string> = {
  rf: 'Random Forest (RF)',
  linear_svm: 'Linear SVM',
  dnn: 'Deep Neural Network (DNN)',
  cnn: 'Convolutional Neural Network (CNN)',
};

// Mirrors app.py DL_MODELS keys
const DL_MODELS: ModelType[] = ['dnn', 'cnn'];

// ── Main predict function ─────────────────────────────────────────────────────
export async function predict(request: PredictionRequest): Promise<PredictionResult> {
  const processedFeatures: Record<string, number> = {};

  for (const key in request.features) {
    const value = request.features[key];

    // One-hot encoded protocol columns: proto_tcp, proto_udp, proto_icmp …
    if (key.toLowerCase().startsWith('proto_')) {
      processedFeatures[key] =
        key.toLowerCase() === `proto_${String(value).toLowerCase()}` ? 1 : 0;
      continue;
    }
    // One-hot encoded category columns
    if (key.toLowerCase().startsWith('category_')) {
      processedFeatures[key] = key.toLowerCase().includes(String(value).toLowerCase()) ? 1 : 0;
      continue;
    }
    // One-hot encoded state columns
    if (key.toLowerCase().startsWith('state_')) {
      processedFeatures[key] = key.toLowerCase().includes(String(value).toLowerCase()) ? 1 : 0;
      continue;
    }

    processedFeatures[key] = Number(value) || 0;
  }

  const payload = { model: request.model, ...processedFeatures };
  console.debug('PREDICT PAYLOAD:', payload);

  const response = await fetch('http://localhost:5020/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as any).error || 'Prediction failed');
  }

  const data = await response.json();
  const isAttack = data.prediction === 1;
  const isDL = DL_MODELS.includes(request.model);

  // RF / SVM  → real softmax probabilities available
  // DNN / CNN → TFLite argmax, no probability vector returned.
  //             We show 95% for the predicted class so the UI is still
  //             meaningful (hard decision, high confidence implied).
  let probability: number;
  let probabilitySource: 'model' | 'argmax';
if (!isDL && data.probabilities && Array.isArray(data.probabilities)) {
  probability = Math.max(...data.probabilities) * 100;
  probabilitySource = 'model';
} else {
  probability = isAttack ? 95.0 : 5.0;
  probabilitySource = 'argmax';
}

  return {
    prediction: isAttack ? 'attack' : 'normal',
    probability: Math.min(99.9, Math.max(0.1, probability)),
    model: request.model,
    modelName: MODEL_NAMES[request.model],
    timestamp: new Date().toISOString(),
    features: request.features,
    probabilitySource,
  };
}

// ── Batch prediction ──────────────────────────────────────────────────────────
export async function predictBatch(
  features: NetworkFeatures[],
  model: ModelType,
): Promise<PredictionResult[]> {
  const results: PredictionResult[] = [];
  for (const feature of features) {
    results.push(await predict({ model, features: feature, source: 'csv' }));
  }
  return results;
}

// ── CSV → NetworkFeatures ─────────────────────────────────────────────────────
export function parseCSVToFeatures(csvContent: string): NetworkFeatures[] {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const col = (name: string, fallback: number) => {
    const i = headers.indexOf(name);
    return i >= 0 ? i : fallback;
  };

  return lines.slice(1).reduce<NetworkFeatures[]>((acc, line) => {
    const vals = line.split(',').map((v) => v.trim());
    if (vals.length !== headers.length) return acc;
    acc.push({
      packetSize: parseFloat(vals[col('packetsize', 0)]) || 0,
      flowDuration: parseFloat(vals[col('flowduration', 1)]) || 0,
      protocol: vals[col('protocol', 2)] ?? 'TCP',
      srcPort: parseInt(vals[col('srcport', 3)]) || 0,
      dstPort: parseInt(vals[col('dstport', 4)]) || 0,
      packetRate: parseFloat(vals[col('packetrate', 5)]) || 0,
    });
    return acc;
  }, []);
}

// ── Feature validator ─────────────────────────────────────────────────────────
export function validateFeatures(
  features: Partial<NetworkFeatures>,
): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (features.packetSize === undefined || features.packetSize < 0 || features.packetSize > 65535)
    errors.packetSize = 'Packet size must be between 0 and 65535';
  if (features.flowDuration === undefined || features.flowDuration < 0)
    errors.flowDuration = 'Flow duration must be a positive number';
  if (!features.protocol || !['TCP', 'UDP', 'ICMP'].includes(features.protocol.toUpperCase()))
    errors.protocol = 'Protocol must be TCP, UDP, or ICMP';
  if (features.srcPort === undefined || features.srcPort < 0 || features.srcPort > 65535)
    errors.srcPort = 'Source port must be between 0 and 65535';
  if (features.dstPort === undefined || features.dstPort < 0 || features.dstPort > 65535)
    errors.dstPort = 'Destination port must be between 0 and 65535';
  if (features.packetRate === undefined || features.packetRate < 0)
    errors.packetRate = 'Packet rate must be a positive number';

  return { valid: Object.keys(errors).length === 0, errors };
}