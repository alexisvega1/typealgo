import type { CompanyTrackId, DomainFluencyId, FrameworkId, LanguageId } from "@/lib/types";

export interface FrameworkFluencyTrack {
  id: FrameworkId;
  name: string;
  /** Parent language — frameworks are NOT languages. */
  parentLanguage: LanguageId;
  domain: DomainFluencyId;
  description: string;
  implemented: boolean;
  expansionPriority: number;
  exampleMotifs: string[];
  trackWeights: Partial<Record<CompanyTrackId, number>>;
}

/**
 * Framework / domain fluency layer.
 * Hierarchy: Language → Framework → Domain specialization
 */
export const FRAMEWORK_FLUENCY_TRACKS: FrameworkFluencyTrack[] = [
  {
    id: "numpy",
    name: "NumPy",
    parentLanguage: "python",
    domain: "ml-systems",
    description: "Array/tensor manipulation reflexes",
    implemented: false,
    expansionPriority: 1,
    exampleMotifs: ["np.zeros", "arr.reshape", "np.dot", "broadcasting"],
    trackWeights: { deepmind: 0.85, openai: 0.72, anthropic: 0.68, google: 0.55 },
  },
  {
    id: "pandas",
    name: "pandas",
    parentLanguage: "python",
    domain: "data-engineering",
    description: "DataFrame groupby, merge, pivot fluency",
    implemented: false,
    expansionPriority: 2,
    exampleMotifs: ["df.groupby().agg()", "pd.merge", "df.fillna"],
    trackWeights: { openai: 0.7, anthropic: 0.65, google: 0.6 },
  },
  {
    id: "pytorch",
    name: "PyTorch",
    parentLanguage: "python",
    domain: "ml-systems",
    description: "nn.Module, training loop, autograd motifs",
    implemented: false,
    expansionPriority: 3,
    exampleMotifs: ["torch.nn.Sequential", "model.train()", "torch.no_grad()"],
    trackWeights: { openai: 0.82, anthropic: 0.78, deepmind: 0.75, meta: 0.45 },
  },
  {
    id: "jax",
    name: "JAX",
    parentLanguage: "python",
    domain: "ml-systems",
    description: "jit, vmap, grad — research infra idioms",
    implemented: false,
    expansionPriority: 4,
    exampleMotifs: ["jax.jit", "jax.vmap", "jax.grad", "pjit"],
    trackWeights: { deepmind: 0.9, openai: 0.65, anthropic: 0.55 },
  },
  {
    id: "tensorflow",
    name: "TensorFlow",
    parentLanguage: "python",
    domain: "ml-systems",
    description: "Keras layers, tf.data pipelines",
    implemented: false,
    expansionPriority: 5,
    exampleMotifs: ["tf.keras.Sequential", "model.compile", "tf.data"],
    trackWeights: { google: 0.75, deepmind: 0.6, openai: 0.45 },
  },
];

export function getFrameworkTrack(id: FrameworkId): FrameworkFluencyTrack | undefined {
  return FRAMEWORK_FLUENCY_TRACKS.find((f) => f.id === id);
}

export function frameworksForLanguage(languageId: LanguageId): FrameworkFluencyTrack[] {
  return FRAMEWORK_FLUENCY_TRACKS.filter((f) => f.parentLanguage === languageId);
}

export function frameworkTrackWeight(
  frameworkId: FrameworkId,
  trackId: CompanyTrackId,
): number {
  const fw = getFrameworkTrack(frameworkId);
  if (!fw) return 0.4;
  if (trackId === "general") return 0.55;
  return fw.trackWeights[trackId] ?? 0.4;
}
