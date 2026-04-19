import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Trophy, RotateCcw, ChevronRight } from "lucide-react";
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
  const isSenior = progress.audience === "senior";

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
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto text-center">
          <Trophy className={cn("mx-auto text-gold", isSenior ? "h-24 w-24" : "h-16 w-16")} />
          <h1 className={cn("mt-4 font-display font-black", isSenior ? "text-7xl" : "text-5xl")}>{score}</h1>
          <p className={cn("text-muted-foreground", isSenior ? "text-2xl" : "text-base")}>out of 100</p>
          
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className={cn("rounded-2xl bg-[hsl(var(--safe))]/10 border border-[hsl(var(--safe))]/20 p-6")}>
              <div className={cn("font-bold text-[hsl(var(--safe))]", isSenior ? "text-4xl" : "text-2xl")}>{safe}</div>
              <div className={cn("text-muted-foreground", isSenior ? "text-lg" : "text-xs")}>Safe</div>
            </div>
            <div className={cn("rounded-2xl bg-gold/10 border border-gold/30 p-6")}>
              <div className={cn("font-bold text-gold-foreground", isSenior ? "text-4xl" : "text-2xl")}>{partial}</div>
              <div className={cn("text-muted-foreground", isSenior ? "text-lg" : "text-xs")}>Partial</div>
            </div>
            <div className={cn("rounded-2xl bg-[hsl(var(--danger))]/10 border border-[hsl(var(--danger))]/20 p-6")}>
              <div className={cn("font-bold text-[hsl(var(--danger))]", isSenior ? "text-4xl" : "text-2xl")}>{scammed}</div>
              <div className={cn("text-muted-foreground", isSenior ? "text-lg" : "text-xs")}>Scammed</div>
            </div>
          </div>

          <div className="mt-10 flex justify-center gap-4 flex-wrap">
            <Button onClick={restart} variant="outline" className={cn(isSenior && "h-16 px-8 text-xl rounded-2xl")}>
              <RotateCcw className={cn("mr-2", isSenior && "h-6 w-6")} /> Retake
            </Button>
            <Button asChild variant="ghost" className={cn(isSenior && "h-16 px-8 text-xl rounded-2xl")}>
              <Link to="/practice">More practice</Link>
            </Button>
          </div>
        </motion.div>
      </AppShell>
    );
  }

  if (questions.length === 0) {
    return <AppShell><p className={isSenior ? "text-2xl" : ""}>No questions available for your track yet.</p></AppShell>;
  }

  const q = questions[i];
  return (
    <AppShell>
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Target className={cn("text-muted-foreground", isSenior ? "h-8 w-8" : "h-5 w-5")} />
          <h1 className={cn("font-display font-bold", isSenior ? "text-3xl" : "text-2xl")}>
            Test — Question {i + 1} / {questions.length}
          </h1>
          <p className="mt-2 text-muted-foreground">Built for the <strong className="text-foreground">{progress.audience}</strong> track.</p>
        </div>
        <div className="flex gap-2">
          {questions.map((_, idx) => (
            <span 
              key={idx} 
              className={cn(
                "rounded-full transition-all", 
                isSenior ? "h-3 w-10" : "h-1.5 w-8",
                idx <= i ? "bg-primary" : "bg-border"
              )} 
            />
          ))}
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
          <div className={cn(
            "rounded-3xl border border-border bg-card shadow-soft",
            isSenior ? "p-10 border-2" : "p-6"
          )}>
            <div className={cn("font-semibold text-muted-foreground mb-2", isSenior ? "text-xl" : "text-xs")}>
              {q.speaker}
            </div>
            <p className={cn("leading-relaxed whitespace-pre-wrap", isSenior ? "text-2xl md:text-3xl" : "text-lg")}>
              {q.message}
            </p>
          </div>

          <div className="mt-6 grid gap-3">
            {q.options.map((o, idx) => {
              const showResult = picked !== null;
              const isPicked = picked === idx;
              return (
                <button
                  key={idx}
                  onClick={() => onPick(idx)}
                  disabled={showResult}
                  className={cn(
                    "text-left rounded-2xl border-2 shadow-soft transition-all",
                    isSenior ? "p-8" : "p-4",
                    !showResult && "border-border bg-card hover:border-primary hover:bg-secondary/40",
                    showResult && isPicked && o.result === "safe" && "border-[hsl(var(--safe))] bg-[hsl(var(--safe))]/10",
                    showResult && isPicked && o.result === "partial" && "border-gold bg-gold/10",
                    showResult && isPicked && o.result === "scammed" && "border-[hsl(var(--danger))] bg-[hsl(var(--danger))]/10",
                    showResult && !isPicked && "opacity-50 border-border bg-card",
                  )}
                >
                  <div className={cn("font-bold", isSenior ? "text-2xl" : "font-medium")}>
                    {o.label}
                  </div>
                  {showResult && isPicked && (
                    <div className={cn("mt-3 text-muted-foreground", isSenior ? "text-xl" : "text-sm")}>
                      {o.feedback}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {picked !== null && (
            <div className="mt-8 flex justify-end">
              <Button 
                size="lg" 
                onClick={next} 
                className={cn(isSenior && "h-16 px-10 text-2xl rounded-2xl")}
              >
                {i + 1 >= questions.length ? "See results" : "Next question"}
                <ChevronRight className={cn("ml-2", isSenior && "h-8 w-8")} />
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </AppShell>
  );
};

export default Test;