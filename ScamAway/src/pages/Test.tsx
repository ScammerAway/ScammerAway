import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Trophy, RotateCcw } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/hooks/useProgress";
import { getScenariosFor } from "@/content/curriculum";
import { cn } from "@/lib/utils";

type Q = {
  scenarioId: string;
  speaker: string;
  message: string;
  options: { label: string; result: "safe" | "partial" | "scammed"; feedback: string }[];
};

const Test = () => {
  const { progress, recordRun } = useProgress();
  const scenarios = getScenariosFor(progress.audience);

  // Build a quiz: one starting node per scenario (5 questions max)
  const questions: Q[] = useMemo(() => {
    return scenarios.slice(0, 5).map((s) => {
      const node = s.nodes[s.start];
      return {
        scenarioId: s.id,
        speaker: node.speaker,
        message: node.message,
        options: node.choices.map((c) => ({ label: c.label, result: c.result, feedback: c.feedback })),
      };
    });
  }, [scenarios]);

  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [results, setResults] = useState<("safe" | "partial" | "scammed")[]>([]);
  const [done, setDone] = useState(false);

  const onPick = async (idx: number) => {
    if (picked !== null) return;
    setPicked(idx);
  };

  const next = async () => {
    if (picked === null) return;
    const r = questions[i].options[picked].result;
    const newResults = [...results, r];
    setResults(newResults);
    setPicked(null);
    if (i + 1 >= questions.length) {
      setDone(true);
      const safe = newResults.filter((x) => x === "safe").length;
      const partial = newResults.filter((x) => x === "partial").length;
      const score = Math.round(((safe * 100 + partial * 50) / newResults.length));
      const outcome: "safe" | "partial" | "scammed" =
        newResults.includes("scammed") ? "scammed" : newResults.every((x) => x === "safe") ? "safe" : "partial";
      await recordRun({
        scenarioId: "test:" + Date.now(),
        mode: "test",
        score,
        outcome,
        redFlagsCaught: safe,
        redFlagsTotal: newResults.length,
      });
    } else {
      setI(i + 1);
    }
  };

  const restart = () => { setI(0); setPicked(null); setResults([]); setDone(false); };

  if (done) {
    const safe = results.filter((r) => r === "safe").length;
    const partial = results.filter((r) => r === "partial").length;
    const scammed = results.filter((r) => r === "scammed").length;
    const score = Math.round(((safe * 100 + partial * 50) / results.length));
    return (
      <AppShell>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto text-center">
          <Trophy className="mx-auto h-16 w-16 text-gold" />
          <h1 className="mt-4 font-display text-5xl font-black">{score}</h1>
          <p className="text-muted-foreground">out of 100</p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-[hsl(var(--safe))]/10 border border-[hsl(var(--safe))]/20 p-4">
              <div className="text-2xl font-bold text-[hsl(var(--safe))]">{safe}</div>
              <div className="text-xs text-muted-foreground">Safe</div>
            </div>
            <div className="rounded-2xl bg-gold/10 border border-gold/30 p-4">
              <div className="text-2xl font-bold text-gold-foreground">{partial}</div>
              <div className="text-xs text-muted-foreground">Partial</div>
            </div>
            <div className="rounded-2xl bg-[hsl(var(--danger))]/10 border border-[hsl(var(--danger))]/20 p-4">
              <div className="text-2xl font-bold text-[hsl(var(--danger))]">{scammed}</div>
              <div className="text-xs text-muted-foreground">Scammed</div>
            </div>
          </div>
          <div className="mt-8 flex justify-center gap-3 flex-wrap">
            <Button onClick={restart} variant="outline"><RotateCcw /> Retake</Button>
            <Button asChild variant="ghost"><Link to="/practice">More practice</Link></Button>
          </div>
        </motion.div>
      </AppShell>
    );
  }

  if (questions.length === 0) {
    return <AppShell><p>No questions available for your track yet.</p></AppShell>;
  }

  const q = questions[i];
  return (
    <AppShell>
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-muted-foreground" />
          <h1 className="font-display text-2xl font-bold">Test — Question {i + 1} / {questions.length}</h1>
        </div>
        <div className="flex gap-1">
          {questions.map((_, idx) => (
            <span key={idx} className={cn("h-1.5 w-8 rounded-full", idx <= i ? "bg-primary" : "bg-border")} />
          ))}
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <div className="text-xs font-semibold text-muted-foreground mb-1">{q.speaker}</div>
            <p className="text-lg leading-relaxed whitespace-pre-wrap">{q.message}</p>
          </div>
          <div className="mt-4 grid gap-2">
            {q.options.map((o, idx) => {
              const showResult = picked !== null;
              const isPicked = picked === idx;
              return (
                <button
                  key={idx}
                  onClick={() => onPick(idx)}
                  disabled={showResult}
                  className={cn(
                    "text-left rounded-2xl border-2 p-4 shadow-soft transition-all",
                    !showResult && "border-border bg-card hover:border-primary hover:bg-secondary/40",
                    showResult && isPicked && o.result === "safe" && "border-[hsl(var(--safe))] bg-[hsl(var(--safe))]/10",
                    showResult && isPicked && o.result === "partial" && "border-gold bg-gold/10",
                    showResult && isPicked && o.result === "scammed" && "border-[hsl(var(--danger))] bg-[hsl(var(--danger))]/10",
                    showResult && !isPicked && "opacity-50 border-border bg-card",
                  )}
                >
                  <div className="font-medium">{o.label}</div>
                  {showResult && isPicked && (
                    <div className="mt-2 text-sm text-muted-foreground">{o.feedback}</div>
                  )}
                </button>
              );
            })}
          </div>
          {picked !== null && (
            <div className="mt-4 flex justify-end">
              <Button size="lg" onClick={next}>{i + 1 >= questions.length ? "See results" : "Next question"}</Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </AppShell>
  );
};

export default Test;
