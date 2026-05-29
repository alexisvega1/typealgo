"use client";

import { useCallback } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { CODE_FONTS, THEMES, type CodeFontId, type ThemeId } from "@/lib/appearance-options";
import { SOUND_PACKS, type SoundPackId } from "@/lib/sound-packs";
import { previewSoundPack } from "@/lib/typing-sound";
import { signOut } from "@/lib/sync/engine";
import { useAppearanceStore } from "@/stores/appearance-store";
import { useSyncStore } from "@/stores/sync-store";

interface UserSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function UserSettingsModal({ open, onClose }: UserSettingsModalProps) {
  const theme = useAppearanceStore((s) => s.theme);
  const codeFont = useAppearanceStore((s) => s.codeFont);
  const soundPack = useAppearanceStore((s) => s.soundPack);
  const soundVolume = useAppearanceStore((s) => s.soundVolume);
  const setTheme = useAppearanceStore((s) => s.setTheme);
  const setCodeFont = useAppearanceStore((s) => s.setCodeFont);
  const setSoundPack = useAppearanceStore((s) => s.setSoundPack);
  const setSoundVolume = useAppearanceStore((s) => s.setSoundVolume);

  const userId = useSyncStore((s) => s.userId);
  const userEmail = useSyncStore((s) => s.userEmail);
  const userAvatar = useSyncStore((s) => s.userAvatar);
  const syncStatus = useSyncStore((s) => s.status);

  const previewSound = useCallback(() => {
    previewSoundPack(soundPack, soundVolume);
  }, [soundPack, soundVolume]);

  const handleSignOut = () => {
    void signOut();
    onClose();
  };

  const dialog = (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="settings-overlay"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="settings-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
          >
            <div className="settings-modal-header">
              <h2 id="settings-title" className="text-lg font-semibold">
                Settings
              </h2>
              <button type="button" className="settings-close-btn" onClick={onClose} aria-label="Close">
                ×
              </button>
            </div>

            <section className="settings-section">
              <h3 className="settings-section-title">Theme</h3>
              <div className="settings-theme-grid">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={clsx("settings-theme-chip", theme === t.id && "settings-theme-chip-active")}
                    onClick={() => setTheme(t.id as ThemeId)}
                    aria-pressed={theme === t.id}
                  >
                    <span
                      className="settings-theme-swatch"
                      style={{
                        background: t.swatch.bg,
                        borderColor: t.swatch.accent,
                        color: t.swatch.fg,
                      }}
                    >
                      Aa
                    </span>
                    <span className="settings-theme-label">{t.label}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="settings-section">
              <h3 className="settings-section-title">Code font</h3>
              <div className="settings-font-list">
                {CODE_FONTS.map((font) => (
                  <button
                    key={font.id}
                    type="button"
                    className={clsx(
                      "settings-font-option",
                      codeFont === font.id && "settings-font-option-active",
                    )}
                    style={{ fontFamily: font.stack }}
                    onClick={() => setCodeFont(font.id as CodeFontId)}
                    aria-pressed={codeFont === font.id}
                  >
                    {font.label}
                  </button>
                ))}
              </div>
            </section>

            <section className="settings-section">
              <h3 className="settings-section-title">Sound</h3>
              <p className="settings-section-hint">
                Sampled mechanical packs use the same recordings as{" "}
                <a href="https://monkeytype.com" target="_blank" rel="noopener noreferrer">
                  MonkeyType
                </a>
                .
              </p>
              <div className="settings-sound-list">
                <button
                  type="button"
                  className={clsx("settings-sound-option", soundPack === "off" && "settings-sound-option-active")}
                  onClick={() => setSoundPack("off")}
                  aria-pressed={soundPack === "off"}
                >
                  Off
                </button>
                {SOUND_PACKS.map((pack) => (
                  <button
                    key={pack.id}
                    type="button"
                    className={clsx(
                      "settings-sound-option",
                      soundPack === pack.id && "settings-sound-option-active",
                    )}
                    onClick={() => {
                      setSoundPack(pack.id as SoundPackId);
                      previewSoundPack(pack.id as SoundPackId, soundVolume);
                    }}
                    aria-pressed={soundPack === pack.id}
                  >
                    {pack.label}
                  </button>
                ))}
              </div>
              {soundPack !== "off" && (
                <div className="settings-volume-row">
                  <label htmlFor="sound-volume">Volume</label>
                  <input
                    id="sound-volume"
                    type="range"
                    min={0.05}
                    max={1}
                    step={0.05}
                    value={soundVolume}
                    onChange={(e) => setSoundVolume(Number(e.target.value))}
                    onMouseUp={previewSound}
                    onTouchEnd={previewSound}
                  />
                  <button type="button" className="settings-preview-sound" onClick={previewSound}>
                    Preview
                  </button>
                </div>
              )}
            </section>

            {userId && (
              <section className="settings-section settings-account">
                <h3 className="settings-section-title">Account</h3>
                <div className="settings-account-row">
                  {userAvatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={userAvatar} alt="" className="settings-account-avatar" />
                  ) : (
                    <span className="settings-account-avatar settings-account-avatar-fallback">?</span>
                  )}
                  <div className="min-w-0">
                    <p className="settings-account-email truncate">{userEmail ?? "Signed in"}</p>
                    <p className="settings-account-status capitalize">{syncStatus}</p>
                  </div>
                </div>
                <button type="button" className="settings-signout-btn" onClick={handleSignOut}>
                  Sign out
                </button>
              </section>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (typeof document === "undefined") return null;
  return createPortal(dialog, document.body);
}
