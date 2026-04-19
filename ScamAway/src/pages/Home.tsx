import { Link, useNavigate} from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, MessageSquare, Target, ChevronRight, Flame } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { useProgress, type Audience } from "@/hooks/useProgress";
import { getLessonsFor, getScenariosFor } from "@/content/curriculum";
import { cn } from "@/lib/utils";

const tracks: { id: Audience; emoji: string; title: string; desc: string }[] = [
  { id: "teen", emoji: "🎓", title: "Teen / Young Adult", desc: "Crypto, job DMs, gaming." },
  { id: "adult", emoji: "👤", title: "Adult", desc: "Phishing, refunds, recruiters." },
  { id: "senior", emoji: "👵", title: "Senior", desc: "Medicare, grandparent, tech-support." },
  { id: "all", emoji: "🌐", title: "Everything", desc: "Show every scenario across audiences." },
];

const Home = () => {
  const { progress, setAudience } = useProgress();
  const nav = useNavigate();
  const lessons = getLessonsFor(progress.audience);
  const scenarios = getScenariosFor(progress.audience);
  const completedPct = Math.round((progress.completedLessons.length / Math.max(lessons.length, 1)) * 100);

  const pick = async (a: Audience) => {
  await setAudience(a);
  nav("/app");
  };
  // Senior-specific scaling logic
  const isSenior = progress.audience === "senior";

  return (
    <AppShell>
      <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className={cn("text-muted-foreground", isSenior ? "text-xl" : "text-sm")}>Welcome!</p>
        <h1 className={cn(
          "font-display font-black mt-1",
          isSenior ? "text-5xl md:text-7xl" : "text-4xl md:text-5xl"
        )}>
          Today's training
        </h1>
      </motion.section>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {tracks.map((t, i) => (
            <motion.button
              key={t.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              onClick={() => pick(t.id)}
              className="text-left rounded-3xl border-2 border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
            >
              <div className="text-4xl">{t.emoji}</div>
              <div className="mt-3 text-lg font-semibold">{t.title}</div>
              <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
            </motion.button>
          ))}
        </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Link
          to="/practice"
          className={cn(
            "group rounded-3xl shadow-pop hover:-translate-y-1 transition-all text-[hsl(var(--danger-foreground))] [background:var(--gradient-danger)] md:col-span-2",
            isSenior ? "p-10" : "p-6"
          )}
        >
          <div className="flex items-start justify-between">
            <div>
              <span className={cn(
                "inline-flex items-center gap-1.5 rounded-full bg-background/20 backdrop-blur font-semibold",
                isSenior ? "px-5 py-2 text-lg" : "px-3 py-1 text-xs"
              )}>
                <Flame className={isSenior ? "h-5 w-5" : "h-3 w-3"} /> Recommended
              </span>
              <h2 className={cn("mt-4 font-display font-bold", isSenior ? "text-4xl md:text-5xl" : "text-3xl")}>
                Roleplay an AI scammer
              </h2>
              <p className={cn("mt-2 max-w-md text-white/85", isSenior ? "text-xl md:text-2xl" : "text-base")}>
                Pick a scenario. Reply how you would in real life. Get scored on red flags caught.
              </p>
            </div>
            <MessageSquare className={cn("opacity-80", isSenior ? "h-12 w-12" : "h-8 w-8")} />
          </div>
          <Button variant="secondary" className={cn("mt-6 bg-background/95 text-foreground hover:bg-background", isSenior ? "h-16 px-8 text-xl rounded-2xl" : "")}>
            Start practice <ChevronRight />
          </Button>
        </Link>

        {/* TAKE THE TEST SECTION - FONT UPDATED FOR SENIORS */}
        <Link
          to="/test"
          className={cn(
            "group rounded-3xl shadow-soft hover:-translate-y-1 transition-all text-[hsl(var(--safe-foreground))] [background:var(--gradient-safe)]",
            isSenior ? "p-10" : "p-6"
          )}
        >
          <Target className={cn("opacity-90", isSenior ? "h-12 w-12" : "h-8 w-8")} />
          <h2 className={cn("mt-4 font-display font-bold", isSenior ? "text-3xl md:text-4xl" : "text-2xl")}>
            Take the Test
          </h2>
          <p className={cn(
            "mt-2 text-white/85", 
            isSenior ? "text-xl md:text-2xl leading-relaxed" : "text-sm"
          )}>
            Mixed scenarios. Time pressure. 
          </p>
          <div className={cn("mt-6 inline-flex items-center gap-1 font-semibold", isSenior ? "text-xl" : "text-sm")}>
            Begin <ChevronRight className={isSenior ? "h-6 w-6" : "h-4 w-4"} />
          </div>
        </Link>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className={cn(
          "lg:col-span-4 rounded-3xl border border-border bg-card shadow-soft",
          isSenior ? "p-10" : "p-6"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className={cn("text-muted-foreground", isSenior ? "h-8 w-8" : "h-5 w-5")} />
              <h3 className={cn("font-display font-bold", isSenior ? "text-3xl" : "text-xl")}>Lessons</h3>
            </div>
            <span className={cn("chip", isSenior && "text-xl px-4 py-2")}>{completedPct}% complete</span>
          </div>

          {/* LESSONS GRID - LARGER FONTS & SINGLE COLUMN FOR SENIORS */}
          <div className={cn(
            "mt-6 grid gap-4", 
            isSenior ? "grid-cols-1" : "sm:grid-cols-2"
          )}>
            {lessons.map((l) => {
              const done = progress.completedLessons.includes(l.id);
              return (
                <Link
                  key={l.id}
                  to={`/learn/${l.id}`}
                  className={cn(
                    "group flex items-start gap-4 rounded-2xl border border-border bg-background hover:border-primary/40 hover:bg-secondary/50 transition",
                    isSenior ? "p-8 border-2" : "p-4"
                  )}
                >
                  <span className={cn(isSenior ? "text-6xl" : "text-2xl")}>{l.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className={cn("font-bold leading-tight", isSenior ? "text-2xl md:text-3xl" : "text-base")}>
                      {l.title}
                    </div>
                    <div className={cn(
                      "mt-1 text-muted-foreground", 
                      isSenior ? "text-lg md:text-xl line-clamp-3" : "text-xs line-clamp-2"
                    )}>
                      {l.summary}
                    </div>
                  </div>
                  {done && <span className={cn("chip-safe chip", isSenior && "text-xl w-10 h-10")}>✓</span>}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
  <div className="mt-10"></div> 
  <div
    className={cn(
      "rounded-3xl border border-border bg-card shadow-soft",
      isSenior ? "p-10" : "p-6"
    )}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <MessageSquare
          className={cn(
            "text-primary",
            isSenior ? "h-8 w-8" : "h-5 w-5"
          )}
        />
        <h2
          className={cn(
            "font-display font-bold",
            isSenior ? "text-3xl" : "text-xl"
          )}
        >
          Scenarios {progress.audience === "all" && "(everything)"}
        </h2>
      </div>
    </div>

    {/* MATCHED GRID + DENSITY */}
    <div
      className={cn(
        "mt-6 grid gap-4",
        isSenior ? "grid-cols-1" : "sm:grid-cols-2"
      )}
    >
      {scenarios.map((s) => (
        <Link
          key={s.id}
          to={`/practice?scenario=${s.id}`}
          className={cn(
            "group flex items-start gap-4 rounded-2xl border border-border bg-background hover:border-primary/40 hover:bg-secondary/50 transition",
            isSenior ? "p-8 border-2" : "p-4"
          )}
        >
          {/* SAME EMOJI SCALE */}
          <span className={cn(isSenior ? "text-6xl" : "text-2xl")}>
            {s.emoji}
          </span>

          <div className="min-w-0 flex-1">
            {/* SAME TITLE WEIGHT + SIZE */}
            <div
              className={cn(
                "font-bold leading-tight",
                isSenior ? "text-2xl md:text-3xl" : "text-base"
              )}
            >
              {s.title}
            </div>

            {/* MATCH LESSONS: treat metadata like summary */}
            <div
              className={cn(
                "mt-1 text-muted-foreground",
                isSenior
                  ? "text-lg md:text-xl leading-relaxed"
                  : "text-xs"
              )}
            >
              {s.channel} · {s.scammerType}
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
    </AppShell>
  );
};

export default Home;