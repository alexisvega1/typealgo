/**
 * Future ML engineering expansion — preserves Type / Recall / Review / Sprint model.
 * Motifs here will extend SyntaxMotif or use a parallel MLMotif type when implemented.
 */
export const ML_ENGINEERING_DOMAINS = [
  {
    id: "numpy",
    name: "NumPy",
    focus: ["array creation", "broadcasting", "indexing", "linear algebra chunks"],
    exampleChunks: ["np.zeros", "arr.reshape", "np.dot", "np.argmax"],
  },
  {
    id: "pandas",
    name: "pandas",
    focus: ["groupby", "merge", "pivot", "apply", "missing data"],
    exampleChunks: ["df.groupby().agg()", "pd.merge", "df.fillna"],
  },
  {
    id: "pytorch",
    name: "PyTorch",
    focus: ["nn.Module", "autograd", "DataLoader", "training loop motifs"],
    exampleChunks: ["torch.nn.Sequential", "model.train()", "torch.no_grad()"],
  },
  {
    id: "jax",
    name: "JAX",
    focus: ["jit", "vmap", "grad", "functional transforms"],
    exampleChunks: ["jax.jit", "jax.vmap", "jax.grad"],
  },
  {
    id: "tensorflow",
    name: "TensorFlow",
    focus: ["keras layers", "tf.data", "custom training step"],
    exampleChunks: ["tf.keras.Sequential", "model.compile"],
  },
  {
    id: "sql",
    name: "SQL",
    focus: ["joins", "window functions", "CTEs", "aggregations"],
    exampleChunks: ["ROW_NUMBER() OVER", "LEFT JOIN", "GROUP BY"],
  },
  {
    id: "spark",
    name: "Spark",
    focus: ["RDD/DataFrame transforms", "groupByKey", "broadcast joins"],
    exampleChunks: ["df.groupBy().agg", "spark.read.parquet"],
  },
  {
    id: "bash",
    name: "Linux / bash",
    focus: ["pipes", "grep/awk", "process management", "debugging"],
    exampleChunks: ["grep -r", "xargs", "tail -f"],
  },
  {
    id: "cuda",
    name: "CUDA kernels",
    focus: ["thread blocks", "shared memory", "kernel launch"],
    exampleChunks: ["__global__", "blockIdx", "cudaMalloc"],
  },
  {
    id: "distributed",
    name: "Distributed systems",
    focus: ["consistency", "sharding", "message queues", "RPC patterns"],
    exampleChunks: ["leader election", "idempotency key"],
  },
] as const;

export const ML_TRAINING_MODES = {
  type: "API chunk fluency — muscle memory for tensor/data transforms",
  recall: "Blank-out critical API segments — retrieval under pressure",
  review: "Consolidate debugging patterns and common mistakes",
  sprint: "ML interview simulation — implement under time box",
} as const;

export const ML_INTERVIEW_TASK_TYPES = [
  "implement DataLoader batching",
  "write vectorized numpy alternative to loop",
  "debug shape mismatch in forward pass",
  "SQL window function for ranking",
  "pandas groupby aggregation",
  "custom nn.Module forward",
] as const;
