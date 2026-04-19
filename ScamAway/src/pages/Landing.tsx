import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, MessageSquare, BookOpen, Target, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProgress, type Audience } from "@/hooks/useProgress";
import { AppShell } from "@/components/AppShell";

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
const Landing = () => {
  const nav = useNavigate();
  const { setAudience } = useProgress();
  const pick = async (a: Audience) => {
    await setAudience(a);
    nav("/app");
  };

  return (
    <AppShell>
    <div className="min-h-screen overflow-hidden bg-hero">
        <section className="container flex flex-col items-center justify-center text-center pt-4 pb-4" style = {{paddingTop: 0}}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-3xl"
        >
          <span className="chip mb-6">
            <Sparkles className="h-3 w-3" /> AI-powered scam roleplay
          </span>
          <h1 className="font-display text-0 md:text-5xl font-black leading-[1.05] text-foreground" style={{padding: '0'}}>
            Spot the scam <em className="not-italic text-[hsl(var(--danger))]">before</em> it spots you.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl">
            ScammerAway teaches teens, adults, and seniors to recognize scams by letting you practice — safely — against an AI that roleplays the scammers themselves.
          </p>
        </motion.div>
      </section>
      <div className="bg-hero flex items-center">
            <div className="container max-w-3xl py-16" style = {{paddingTop: '10px'}}>
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display text-3xl md:text-5xl font-black leading-tight"
                style= {{textAlign: 'center'}}
              >
                Who are we training today?
              </motion.h1>
              <p className="mt-3 text-muted-foreground text-lg" style= {{textAlign: 'center'}}>
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
    </div>
  </AppShell>
  );
};

export default Landing;
