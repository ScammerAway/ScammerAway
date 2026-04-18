import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { useProgress } from "@/hooks/useProgress";
import { getScenariosFor } from "@/content/curriculum";
import { Sparkles } from "lucide-react";

const channelLabel: Record<string, string> = {
  sms: "📱 Text", phone: "📞 Phone", email: "📧 Email", dm: "💬 DM", "video-call": "🎥 Video",
};

const PracticeIndex = () => {
  const { progress } = useProgress();
  const scenarios = getScenariosFor(progress.audience);

  return (
    <AppShell>
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-4xl md:text-5xl font-black">Practice</h1>
          <p className="mt-2 text-muted-foreground max-w-xl">
            Pick a scenario. The AI plays the scammer (or sometimes a real business — watch out for false alarms).
          </p>
        </div>
        <span className="chip"><Sparkles className="h-3 w-3" /> AI roleplay</span>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {scenarios.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Link
              to={`/practice/${s.id}`}
              className="group block rounded-3xl border border-border bg-card p-6 shadow-soft hover:-translate-y-1 hover:shadow-pop transition-all"
            >
              <div className="flex items-start justify-between">
                <span className="text-4xl">{s.emoji}</span>
                <span className="chip">{channelLabel[s.channel] ?? s.channel}</span>
              </div>
              <h3 className="mt-4 font-display text-xl font-bold leading-tight group-hover:text-[hsl(var(--danger))] transition-colors">
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.scammerType}</p>
              {s.legitimate && (
                <span className="mt-3 inline-block chip chip-safe">⚠ Could be legit — judge carefully</span>
              )}
            </Link>
          </motion.div>
        ))}
      </div>
    </AppShell>
  );
};

export default PracticeIndex;
