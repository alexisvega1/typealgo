import {
  PatternBreakdown,
  RecentSessions,
  StatCards,
} from "@/components/analytics/StatCards";
import { SkillRadar } from "@/components/analytics/SkillRadar";
import { StreakHeatmap } from "@/components/analytics/StreakHeatmap";
import { WpmChart } from "@/components/analytics/WpmChart";
import { CoachInsightsPanel } from "@/components/coach/CoachInsightsPanel";
import { TrainingPlanPanel } from "@/components/coach/TrainingPlanPanel";

export default function StatsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="mt-1 text-muted hero-tagline">
          Track algorithmic fluency, streaks, and pattern mastery
        </p>
      </div>

      <StatCards />

      <div className="mt-6">
        <StreakHeatmap />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <CoachInsightsPanel />
        <TrainingPlanPanel />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <WpmChart />
        <SkillRadar />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <PatternBreakdown />
        <RecentSessions />
      </div>
    </main>
  );
}
