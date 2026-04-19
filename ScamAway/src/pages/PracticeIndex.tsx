import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { useProgress } from "@/hooks/useProgress";
import { getScenariosFor } from "@/content/curriculum";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const channelLabel: Record<string, string> = {
  sms: "📱 Text",
  phone: "📞 Phone",
  email: "📧 Email",
  dm: "💬 DM",
  "video-call": "🎥 Video",
};

const PracticeIndex = () => {
  const { progress } = useProgress();
  const scenarios = getScenariosFor(progress.audience);

  // Helper for scaling
  const isSenior = progress.audience === "senior";

  return (
    <AppShell>
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1
            className={cn(
              "font-display font-black",
              isSenior ? "text-5xl md:text-6xl" : "text-4xl md:text-5xl",
            )}
          >
            Practice
          </h1>
          <p
            className={cn(
              "mt-2 text-muted-foreground max-w-xl",
              isSenior ? "text-xl md:text-2xl" : "text-base",
            )}
          >
            Pick a scenario. The AI plays the scammer (or sometimes a real
            business — watch out for false alarms).
          </p>
          <p className="mt-2 text-muted-foreground">Built for the <strong className="text-foreground">{progress.audience}</strong> track.</p>
        </div>
        <span className={cn("chip", isSenior && "text-lg px-4 py-2")}>
          <Sparkles className={cn("mr-1", isSenior ? "h-5 w-5" : "h-3 w-3")} />{" "}
          AI roleplay
        </span>
      </div>

      <div
        className={cn(
          "mt-8 grid gap-6",
          isSenior
            ? "sm:grid-cols-1 lg:grid-cols-2"
            : "sm:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {scenarios.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Link
              to={`/practice/${s.id}`}
              className={cn(
                "group block rounded-3xl border border-border bg-card shadow-soft hover:-translate-y-1 hover:shadow-pop transition-all",
                isSenior ? "p-8 border-2" : "p-6 border",
              )}
            >
              <div className="flex items-start justify-between">
                <span className={cn(isSenior ? "text-6xl" : "text-4xl")}>
                  {s.emoji}
                </span>
                <span className={cn("chip", isSenior && "text-lg px-3 py-1")}>
                  {channelLabel[s.channel] ?? s.channel}
                </span>
              </div>

              <h3
                className={cn(
                  "mt-4 font-display font-bold leading-tight group-hover:text-[hsl(var(--danger))] transition-colors",
                  isSenior ? "text-3xl md:text-4xl" : "text-xl",
                )}
              >
                {s.title}
              </h3>

              <p
                className={cn(
                  "mt-2 text-muted-foreground",
                  isSenior ? "text-xl md:text-2xl font-medium" : "text-sm",
                )}
              >
                {s.scammerType}
              </p>

              {s.legitimate && (
                <span
                  className={cn(
                    "mt-4 inline-block chip chip-safe",
                    isSenior && "text-lg px-4 py-2",
                  )}
                >
                  ⚠ Could be legit — judge carefully
                </span>
              )}
            </Link>
          </motion.div>
        ))}
      </div>
    </AppShell>
  );
};

export default PracticeIndex;
