import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useProgress, type Audience } from "@/hooks/useProgress";

const tracks: { id: Audience; emoji: string; title: string; desc: string }[] = [
  {
    id: "teen",
    emoji: "🎓",
    title: "Teen / young adult",
    desc: "Crypto, job DMs, romance, gaming, social media scams.",
  },
  {
    id: "adult",
    emoji: "👤",
    title: "Adult",
    desc: "Phishing, refund scams, fake recruiters, investment hype.",
  },
  {
    id: "senior",
    emoji: "👵",
    title: "Senior",
    desc: "Larger text, slower pace. Medicare, grandparent, tech-support scams.",
  },
];

const Onboarding = () => {
  const nav = useNavigate();
  const { setAudience } = useProgress();

  const pick = async (a: Audience) => {
    await setAudience(a);
    nav("/app");
  };

  return (
    <div className="min-h-screen bg-hero flex items-center">
      <div className="container max-w-3xl py-16">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl md:text-5xl font-black leading-tight"
        >
          Who are we training today?
        </motion.h1>
        <p className="mt-3 text-muted-foreground text-lg">
          We'll tune scenarios, vocabulary, and reading size to fit. You can
          change this later.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {tracks.map((t, i) => (
            <motion.button
              key={t.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              onClick={() => pick(t.id)}
              className="text-left rounded-3xl border-2 border-border bg-card p-6 shadow-soft hover:-translate-y-1 hover:shadow-pop hover:border-primary/40 transition-all"
            >
              <div className="text-4xl">{t.emoji}</div>
              <h3 className="mt-4 font-display text-xl font-bold">{t.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {t.desc}
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
