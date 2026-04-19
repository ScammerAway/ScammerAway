import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { useProgress } from "@/hooks/useProgress";
import { getLessonsFor } from "@/content/curriculum";
import { cn } from "@/lib/utils";

const LearnIndex = () => {
  const { progress } = useProgress();
  const lessons = getLessonsFor(progress.audience);

  // Senior-specific scaling logic
  const isSenior = progress.audience === "senior";

  return (
    <AppShell>
      <h1 className={cn(
        "font-display font-black",
        isSenior ? "text-5xl md:text-7xl" : "text-4xl md:text-5xl"
      )}>
        Lessons
      </h1>
      <p className={cn(
        "mt-2 text-muted-foreground",
        isSenior ? "text-xl md:text-2xl" : "text-base"
      )}>
        Built for the <strong className="text-foreground">{progress.audience}</strong> track.
      </p>

      {/* Adjusted Grid: Fewer columns for Seniors to allow larger text */}
      <div className={cn(
        "mt-8 grid gap-6",
        isSenior ? "grid-cols-1 lg:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"
      )}>
        {lessons.map((l, i) => {
          const done = progress.completedLessons.includes(l.id);
          return (
            <motion.div 
              key={l.id} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to={`/learn/${l.id}`}
                className={cn(
                  "block rounded-3xl border border-border bg-card shadow-soft hover:-translate-y-1 hover:shadow-pop transition-all",
                  isSenior ? "p-10 border-2" : "p-6 border"
                )}
              >
                <div className="flex items-start justify-between">
                  {/* Bigger Emoji for Seniors */}
                  <span className={cn(isSenior ? "text-7xl" : "text-4xl")}>{l.emoji}</span>
                  {done && (
                    <span className={cn(
                      "chip chip-safe", 
                      isSenior && "text-xl px-4 py-2"
                    )}>
                      ✓ Done
                    </span>
                  )}
                </div>
                
                {/* Bigger Lesson Title */}
                <h3 className={cn(
                  "mt-6 font-display font-bold leading-tight",
                  isSenior ? "text-3xl md:text-4xl" : "text-xl"
                )}>
                  {l.title}
                </h3>
                
                {/* Bigger Lesson Summary */}
                <p className={cn(
                  "mt-3 text-muted-foreground",
                  isSenior ? "text-xl md:text-2xl leading-relaxed line-clamp-4" : "text-sm line-clamp-3"
                )}>
                  {l.summary}
                </p>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </AppShell>
  );
};

export default LearnIndex;