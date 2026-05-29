/**
 * Keyboard sound packs — sampled layouts mirror MonkeyType's click{N} folders
 * (https://github.com/monkeytypegame/monkeytype, GPL-3.0). See public/sounds/ATTRIBUTION.md.
 */

export type SoundPackId =
  | "off"
  | "blip"
  | "click-1"
  | "click-2"
  | "click-3"
  | "click-4"
  | "click-5"
  | "click-15"
  | "click-17"
  | "click-18"
  | "click-19"
  | "click-20"
  | "click-21"
  | "click-22"
  | "click-23"
  | "click-24"
  | "click-25";

export interface SampledSoundPack {
  kind: "sampled";
  id: Exclude<SoundPackId, "off" | "blip">;
  label: string;
  /** MonkeyType folder name under public/sounds (e.g. click4). */
  folder: string;
  count: number;
  group: "basic" | "mechanical";
}

export interface SynthSoundPack {
  kind: "synth";
  id: "blip";
  label: string;
  group: "synth";
}

export type SoundPack = SampledSoundPack | SynthSoundPack;

/** MonkeyType numberOfSounds per pack — paths resolve to /sounds/{folder}/{n}.wav */
const SAMPLED: readonly SampledSoundPack[] = [
  { kind: "sampled", id: "click-1", label: "Click", folder: "click1", count: 3, group: "basic" },
  { kind: "sampled", id: "click-2", label: "Beep", folder: "click2", count: 3, group: "basic" },
  { kind: "sampled", id: "click-3", label: "Pop", folder: "click3", count: 3, group: "basic" },
  { kind: "sampled", id: "click-4", label: "NK Creams", folder: "click4", count: 6, group: "mechanical" },
  { kind: "sampled", id: "click-5", label: "Typewriter", folder: "click5", count: 6, group: "basic" },
  { kind: "sampled", id: "click-15", label: "Rubber keys", folder: "click15", count: 5, group: "mechanical" },
  { kind: "sampled", id: "click-17", label: "Akko Lavenders", folder: "click17", count: 10, group: "mechanical" },
  { kind: "sampled", id: "click-18", label: "Cherry MX Black ABS", folder: "click18", count: 10, group: "mechanical" },
  { kind: "sampled", id: "click-19", label: "Cherry MX Black PBT", folder: "click19", count: 10, group: "mechanical" },
  { kind: "sampled", id: "click-20", label: "Cherry MX Blue ABS", folder: "click20", count: 10, group: "mechanical" },
  { kind: "sampled", id: "click-21", label: "Cherry MX Blue PBT", folder: "click21", count: 10, group: "mechanical" },
  { kind: "sampled", id: "click-22", label: "Cherry MX Brown PBT", folder: "click22", count: 10, group: "mechanical" },
  { kind: "sampled", id: "click-23", label: "Kailh Box White", folder: "click23", count: 10, group: "mechanical" },
  { kind: "sampled", id: "click-24", label: "Razer Green", folder: "click24", count: 10, group: "mechanical" },
  { kind: "sampled", id: "click-25", label: "Tealios V2", folder: "click25", count: 10, group: "mechanical" },
] as const;

export const SYNTH_SOUND_PACK: SynthSoundPack = {
  kind: "synth",
  id: "blip",
  label: "Blip (synth)",
  group: "synth",
};

export const SOUND_PACKS: readonly SoundPack[] = [SYNTH_SOUND_PACK, ...SAMPLED];

export function getSoundPack(id: SoundPackId): SoundPack | undefined {
  if (id === "off") return undefined;
  if (id === "blip") return SYNTH_SOUND_PACK;
  return SAMPLED.find((p) => p.id === id);
}

export function soundPackSources(pack: SampledSoundPack): string[] {
  return Array.from({ length: pack.count }, (_, i) => `/sounds/${pack.folder}/${i + 1}.wav`);
}

export function isSoundEnabled(packId: SoundPackId): boolean {
  return packId !== "off";
}
