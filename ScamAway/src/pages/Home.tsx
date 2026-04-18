import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, MessageSquare, Target, Trophy, ChevronRight, Flame } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/hooks/useProgress";
import { getLessonsFor, getScenariosFor } from "@/content/curriculum";

const Home = () => {
  const { progress } = useProgress();
  const lessons = getLessonsFor(progress.audience);
  const scenarios = getScenariosFor(progress.audience);
  const completedPct = Math.round((progress.completedLessons.length / Math.max(lessons.length, 1)) * 100);

  return (
    <AppShell>
      <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm text-muted-foreground">Welcome!</p>
        <h1 className="font-display text-4xl md:text-5xl font-black mt-1">
          Today's training
        </h1>
      </motion.section>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Link
          to="/practice"
          className="group rounded-3xl p-6 shadow-pop hover:-translate-y-1 transition-all text-[hsl(var(--danger-foreground))] [background:var(--gradient-danger)] md:col-span-2"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
                <Flame className="h-3 w-3" /> Recommended
              </span>
              <h2 className="mt-4 font-display text-3xl font-bold">Roleplay an AI scammer</h2>
              <p className="mt-2 max-w-md text-white/85">
                Pick a scenario. Reply how you would in real life. Get scored on red flags caught.
              </p>
            </div>
            <MessageSquare className="h-8 w-8 opacity-80" />
          </div>
          <Button variant="secondary" className="mt-6 bg-white/95 text-foreground hover:bg-white">
            Start practice <ChevronRight />
          </Button>
        </Link>

        <Link
          to="/test"
          className="group rounded-3xl p-6 shadow-soft hover:-translate-y-1 transition-all text-[hsl(var(--safe-foreground))] [background:var(--gradient-safe)]"
        >
          <Target className="h-8 w-8 opacity-90" />
          <h2 className="mt-4 font-display text-2xl font-bold">Take the Test</h2>
          <p className="mt-2 text-sm text-white/85">Mixed scenarios. Time pressure. Real XP.</p>
          <div className="mt-6 inline-flex items-center gap-1 text-sm font-semibold">
            Begin <ChevronRight className="h-4 w-4" />
          </div>
        </Link>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-4 rounded-3xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-centerz justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-display text-xl font-bold">Lessons</h3>
            </div>
            <span className="chip">{completedPct}% complete</span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {lessons.map((l) => {
              const done = progress.completedLessons.includes(l.id);
              return (
                <Link
                  key={l.id}
                  to={`/learn/${l.id}`}
                  className="group flex items-start gap-3 rounded-2xl border border-border bg-background p-4 hover:border-primary/40 hover:bg-secondary/50 transition"
                >
                  <span className="text-2xl">{l.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold leading-tight">{l.title}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{l.summary}</div>
                  </div>
                  {done && <span className="chip-safe chip">✓</span>}
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </AppShell>
  );
};

export default Home;
