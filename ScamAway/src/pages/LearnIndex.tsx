import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { useProgress } from "@/hooks/useProgress";
import { getLessonsFor } from "@/content/curriculum";

const LearnIndex = () => {
  const { progress } = useProgress();
  const lessons = getLessonsFor(progress.audience);

  return (
    <AppShell>
      <h1 className="font-display text-4xl md:text-5xl font-black">Lessons</h1>
      <p className="mt-2 text-muted-foreground">Built for the <strong className="text-foreground">{progress.audience}</strong> track.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((l, i) => {
          const done = progress.completedLessons.includes(l.id);
          return (
            <motion.div key={l.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Link
                to={`/learn/${l.id}`}
                className="block rounded-3xl border border-border bg-card p-6 shadow-soft hover:-translate-y-1 hover:shadow-pop transition-all"
              >
                <div className="flex items-start justify-between">
                  <span className="text-4xl">{l.emoji}</span>
                  {done && <span className="chip chip-safe">✓ Done</span>}
                </div>
                <h3 className="mt-4 font-display text-xl font-bold leading-tight">{l.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{l.summary}</p>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </AppShell>
  );
};

export default LearnIndex;
