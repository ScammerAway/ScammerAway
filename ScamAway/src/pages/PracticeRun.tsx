import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Sparkles,
  Loader2,
  AlertTriangle,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { SCENARIOS } from "@/content/curriculum";
import { useProgress } from "@/hooks/useProgress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type AIChoice = {
  label: string;
  result: "safe" | "partial" | "scammed";
  feedback: string;
};
type AITurn = {
  speaker: string;
  message: string;
  choices: AIChoice[];
  isFinal: boolean;
};

type LogItem =
  | { kind: "scammer"; speaker: string; message: string }
  | {
      kind: "user";
      label: string;
      result: "safe" | "partial" | "scammed";
      feedback: string;
    };

const PracticeRun = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { progress, recordRun } = useProgress();
  const scenario = useMemo(() => SCENARIOS.find((s) => s.id === id), [id]);

  const [log, setLog] = useState<LogItem[]>([]);
  const [current, setCurrent] = useState<AITurn | null>(null);
  const [loading, setLoading] = useState(true);
  const [turn, setTurn] = useState(1);
  const [done, setDone] = useState(false);
  const [results, setResults] = useState<("safe" | "partial" | "scammed")[]>(
    [],
  );
  const [usingFallback, setUsingFallback] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!scenario || startedRef.current) return;
    startedRef.current = true;
    fetchTurn(1, []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [log, current]);

  if (!scenario) {
    return (
      <AppShell>
        <p>
          Scenario not found.{" "}
          <Link className="underline" to="/practice">
            Back
          </Link>
        </p>
      </AppShell>
    );
  }

  const fallbackTurn = (
    turnNum: number,
    lastResult?: "safe" | "partial" | "scammed",
  ): AITurn => {
    // Walk the hand-authored tree based on remaining script
    const startNode = scenario.nodes[scenario.start];
    let node = startNode;
    if (turnNum > 1 && lastResult) {
      // pick a node based on prior choice's "next"
      const prevChoiceWithNext = Object.values(scenario.nodes)
        .flatMap((n) => n.choices)
        .find((c) => c.result === lastResult && c.next);
      if (prevChoiceWithNext?.next)
        node = scenario.nodes[prevChoiceWithNext.next] ?? startNode;
    }
    return {
      speaker: node.speaker,
      message: node.message,
      isFinal: turnNum >= 2 || node.choices.every((c) => !c.next),
      choices: node.choices.map((c) => ({
        label: c.label,
        result: c.result,
        feedback: c.feedback,
      })),
    };
  };

  const fetchTurn = async (
    turnNum: number,
    history: { role: "scammer" | "user"; content: string }[],
    lastResult?: "safe" | "partial" | "scammed",
  ) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("scenario-turn", {
        body: {
          scenarioId: scenario.id,
          scammerType: scenario.scammerType,
          persona: scenario.persona,
          channel: scenario.channel,
          audience: progress.audience,
          redFlags: scenario.redFlags,
          legitimate: scenario.legitimate,
          history,
          turn: turnNum,
        },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      const t = data as AITurn;
      setCurrent(t);
      setLog((l) => [
        ...l,
        { kind: "scammer", speaker: t.speaker, message: t.message },
      ]);
    } catch (e: any) {
      console.warn("AI fallback:", e?.message);
      if (!usingFallback) {
        toast.message("Using offline scenario script", {
          description:
            "AI is unavailable — falling back to the authored dialog.",
        });
        setUsingFallback(true);
      }
      const t = fallbackTurn(turnNum, lastResult);
      setCurrent(t);
      setLog((l) => [
        ...l,
        { kind: "scammer", speaker: t.speaker, message: t.message },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onChoose = async (c: AIChoice) => {
    if (!current) return;
    setLog((l) => [
      ...l,
      { kind: "user", label: c.label, result: c.result, feedback: c.feedback },
    ]);
    const newResults = [...results, c.result];
    setResults(newResults);

    if (current.isFinal || c.result === "scammed") {
      // End the run
      setDone(true);
      setCurrent(null);
      const score =
        newResults.reduce(
          (acc, r) => acc + (r === "safe" ? 100 : r === "partial" ? 50 : 0),
          0,
        ) / newResults.length;
      const outcome: "safe" | "partial" | "scammed" = newResults.includes(
        "scammed",
      )
        ? "scammed"
        : newResults.every((r) => r === "safe")
          ? "safe"
          : "partial";
      const xp = await recordRun({
        scenarioId: scenario.id,
        mode: "practice",
        score: Math.round(score),
        outcome,
        redFlagsCaught: newResults.filter((r) => r === "safe").length,
        redFlagsTotal: newResults.length,
      });
      return;
    }

    // Continue to next turn
    setCurrent(null);
    const nextTurn = turn + 1;
    setTurn(nextTurn);
    const history: { role: "scammer" | "user"; content: string }[] = [];
    log.forEach((item) => {
      if (item.kind === "scammer")
        history.push({ role: "scammer", content: item.message });
      else history.push({ role: "user", content: item.label });
    });
    history.push({ role: "scammer", content: current.message });
    history.push({ role: "user", content: c.label });
    await fetchTurn(nextTurn, history, c.result);
  };

  const restart = () => {
    setLog([]);
    setCurrent(null);
    setLoading(true);
    setTurn(1);
    setDone(false);
    setResults([]);
    startedRef.current = false;
    setTimeout(() => {
      startedRef.current = true;
      fetchTurn(1, []);
    }, 50);
  };

  const outcome: "safe" | "partial" | "scammed" | null = done
    ? results.includes("scammed")
      ? "scammed"
      : results.every((r) => r === "safe")
        ? "safe"
        : "partial"
    : null;

  return (
    <AppShell>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => nav("/practice")}
        className="mb-4"
      >
        <ArrowLeft /> All scenarios
      </Button>

      <header className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div className="max-w-2xl">
          <div className="text-4xl">{scenario.emoji}</div>
          <h1 className="mt-2 font-display text-3xl md:text-4xl font-black leading-tight">
            {scenario.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {scenario.scammerType}
          </p>
        </div>
        <span className="chip">
          <Sparkles className="h-3 w-3" />{" "}
          {usingFallback ? "Scripted" : "AI live"}
        </span>
      </header>

      <div
        ref={scrollRef}
        className="rounded-3xl border border-border bg-card shadow-soft p-4 md:p-6 max-h-[55vh] overflow-y-auto space-y-4"
      >
        <AnimatePresence initial={false}>
          {log.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex",
                item.kind === "user" ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-soft",
                  item.kind === "scammer"
                    ? "bg-secondary text-foreground rounded-tl-sm"
                    : "bg-primary text-primary-foreground rounded-tr-sm",
                )}
              >
                {item.kind === "scammer" ? (
                  <>
                    <div className="text-xs font-semibold opacity-70 mb-1">
                      {item.speaker}
                    </div>
                    <div className="whitespace-pre-wrap text-[25px]">{item.message}</div>
                  </>
                ) : (
                  <>
                    <div className="text-xs font-semibold opacity-80 mb-1">
                      You replied
                    </div>
                    <div>"{item.label}"</div>
                    <div
                      className={cn(
                        "mt-2 text-xs rounded-lg px-2 py-1.5 inline-block",
                        item.result === "safe"
                          ? "bg-[hsl(var(--safe))] text-[hsl(var(--safe-foreground))]"
                          : item.result === "partial"
                            ? "bg-gold text-gold-foreground"
                            : "bg-[hsl(var(--danger))] text-[hsl(var(--danger-foreground))]",
                      )}
                    >
                      {item.result === "safe"
                        ? "✓ Safe"
                        : item.result === "partial"
                          ? "△ Partial"
                          : "✗ Got you"}
                      : {item.feedback}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="h-4 w-4 animate-spin" /> Scammer is typing…
          </div>
        )}
      </div>

      {current && !loading && (
        <div className="mt-4 grid gap-2">
          {current.choices.map((c, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onChoose(c)}
              className="text-left rounded-2xl border-2 border-border bg-card p-4 shadow-soft hover:border-primary hover:bg-secondary/40 transition-all"
            >
              <span className="font-medium text-[25px]">{c.label}</span>
            </motion.button>
          ))}
        </div>
      )}

      {done && outcome && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "mt-6 rounded-3xl p-6 border-2",
            outcome === "safe"
              ? "border-[hsl(var(--safe))]/30 bg-[hsl(var(--safe))]/10"
              : outcome === "partial"
                ? "border-gold/40 bg-gold/10"
                : "border-[hsl(var(--danger))]/30 bg-[hsl(var(--danger))]/10",
          )}
        >
          <div className="flex items-center gap-2">
            {outcome === "safe" ? (
              <ShieldCheck className="h-6 w-6 text-[hsl(var(--safe))]" />
            ) : (
              <AlertTriangle
                className={cn(
                  "h-6 w-6",
                  outcome === "partial"
                    ? "text-gold"
                    : "text-[hsl(var(--danger))]",
                )}
              />
            )}
            <h2 className="font-display text-2xl font-bold">
              {outcome === "safe"
                ? "You stayed safe!"
                : outcome === "partial"
                  ? "Close — could be tighter."
                  : "You got scammed."}
            </h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Red flags in this scenario:
          </p>
          <ul className="mt-2 grid gap-1 sm:grid-cols-2 text-sm">
            {scenario.redFlags.map((rf) => (
              <li key={rf} className="flex gap-2">
                <span>🚩</span>
                {rf}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={restart} variant="outline">
              <RotateCcw /> Try again
            </Button>
            <Button asChild>
              <Link to="/practice">More scenarios</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/test">Take the test</Link>
            </Button>
          </div>
        </motion.div>
      )}
    </AppShell>
  );
};

export default PracticeRun;
