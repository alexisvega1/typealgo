import type { Howl } from "howler";
import type { SoundPackId } from "@/lib/sound-packs";
import { getSoundPack, soundPackSources } from "@/lib/sound-packs";

type HowlerModule = typeof import("howler");

let howlerPromise: Promise<HowlerModule> | null = null;
let audioCtx: AudioContext | null = null;
const howlCache = new Map<string, Howl>();
let preloadedPackId: SoundPackId | "off" | null = null;
let globalVolume = 0.35;

function getHowler(): Promise<HowlerModule> {
  howlerPromise ??= import("howler");
  return howlerPromise;
}

function synthCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
  }
  return audioCtx;
}

function playSynthBlip(correct: boolean, volume: number): void {
  const ac = synthCtx();
  if (!ac) return;
  if (ac.state === "suspended") void ac.resume();

  const now = ac.currentTime;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(correct ? 920 : 220, now);
  gain.gain.setValueAtTime(Math.min(1, Math.max(0, volume)) * (correct ? 0.08 : 0.12), now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + (correct ? 0.045 : 0.07));
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(now);
  osc.stop(now + 0.08);
}

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

async function getHowl(src: string): Promise<Howl> {
  const cached = howlCache.get(src);
  if (cached) return cached;

  const { Howl } = await getHowler();
  const howl = new Howl({ src: [src], preload: true, html5: false });
  howlCache.set(src, howl);
  return howl;
}

/** Warm Howl instances for a sampled pack (MonkeyType preloads active pack only). */
export async function preloadSoundPack(packId: SoundPackId, volume = globalVolume): Promise<void> {
  globalVolume = volume;
  if (packId === "off" || packId === "blip") {
    preloadedPackId = packId;
    return;
  }

  const pack = getSoundPack(packId);
  if (!pack || pack.kind !== "sampled") return;
  if (preloadedPackId === packId) return;

  const { Howler } = await getHowler();
  Howler.volume(volume);

  await Promise.all(soundPackSources(pack).map((src) => getHowl(src)));
  preloadedPackId = packId;
}

export function setSoundVolume(volume: number): void {
  globalVolume = volume;
  if (typeof window === "undefined") return;
  void getHowler().then(({ Howler }) => Howler.volume(volume));
}

export function playTypingClick(correct: boolean, packId: SoundPackId, volume = globalVolume): void {
  if (packId === "off") return;
  globalVolume = volume;

  if (packId === "blip") {
    playSynthBlip(correct, volume);
    return;
  }

  const pack = getSoundPack(packId);
  if (!pack || pack.kind !== "sampled") return;

  void (async () => {
    const { Howler } = await getHowler();
    Howler.volume(volume);

    const src = randomItem(soundPackSources(pack));
    const howl = await getHowl(src);
    howl.volume(volume);
    howl.seek(0);
    howl.play();
  })();
}

/** Preview a pack from settings (always plays a “correct” click). */
export function previewSoundPack(packId: SoundPackId, volume = globalVolume): void {
  playTypingClick(true, packId, volume);
}
