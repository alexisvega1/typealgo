import { SettingsBar } from "@/components/typing/SettingsBar";
import { TypingTest } from "@/components/typing/TypingTest";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <div id="typing-filters-panel">
        <SettingsBar />
      </div>
      <TypingTest />
    </main>
  );
}
