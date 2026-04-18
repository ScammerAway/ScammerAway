import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export type Audience = "teen" | "adult" | "senior";

export interface LocalProgress {
  audience: Audience;
  displayName: string;
  xp: number;
  completedLessons: string[];
  runs: { scenarioId: string; mode: "practice" | "test"; score: number; outcome: string; ts: number }[];
}

const KEY = "scamschool:progress:v1";

const empty = (): LocalProgress => ({
  audience: "adult",
  displayName: "Guest",
  xp: 0,
  completedLessons: [],
  runs: [],
});

const loadLocal = (): LocalProgress => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    return { ...empty(), ...JSON.parse(raw) };
  } catch {
    return empty();
  }
};

const saveLocal = (p: LocalProgress) => localStorage.setItem(KEY, JSON.stringify(p));

export function useProgress() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<LocalProgress>(loadLocal);

  // Auth listener — synchronous in callback; defer Supabase calls
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        // defer to avoid deadlocks
        setTimeout(() => hydrateFromCloud(session.user.id), 0);
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) hydrateFromCloud(session.user.id);
      else setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const hydrateFromCloud = async (userId: string) => {
    setLoading(true);
    const [{ data: profile }, { data: lessons }, { data: runs }] = await Promise.all([
      supabase.from("profiles").select("display_name, audience, xp").eq("user_id", userId).maybeSingle(),
      supabase.from("lesson_progress").select("lesson_id").eq("user_id", userId),
      supabase.from("scenario_runs").select("scenario_id, mode, score, outcome, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(50),
    ]);
    if (profile) {
      setProgress({
        displayName: profile.display_name,
        audience: profile.audience as Audience,
        xp: profile.xp ?? 0,
        completedLessons: (lessons ?? []).map((l: any) => l.lesson_id),
        runs: (runs ?? []).map((r: any) => ({
          scenarioId: r.scenario_id,
          mode: r.mode,
          score: r.score,
          outcome: r.outcome,
          ts: new Date(r.created_at).getTime(),
        })),
      });
    }
    setLoading(false);
  };

  const setAudience = useCallback(async (a: Audience) => {
    setProgress((p) => {
      const next = { ...p, audience: a };
      saveLocal(next);
      return next;
    });
    if (user) await supabase.from("profiles").update({ audience: a }).eq("user_id", user.id);
  }, [user]);

  const setDisplayName = useCallback(async (name: string) => {
    setProgress((p) => {
      const next = { ...p, displayName: name };
      saveLocal(next);
      return next;
    });
    if (user) await supabase.from("profiles").update({ display_name: name }).eq("user_id", user.id);
  }, [user]);

  const completeLesson = useCallback(async (lessonId: string) => {
    setProgress((p) => {
      if (p.completedLessons.includes(lessonId)) return p;
      const next = { ...p, completedLessons: [...p.completedLessons, lessonId], xp: p.xp + 10 };
      saveLocal(next);
      return next;
    });
    if (user) {
      await supabase.from("lesson_progress").insert({ user_id: user.id, lesson_id: lessonId }).then(() => {});
      await supabase.rpc as any; // no-op; we'll bump xp via direct update below
      const { data: prof } = await supabase.from("profiles").select("xp").eq("user_id", user.id).maybeSingle();
      await supabase.from("profiles").update({ xp: (prof?.xp ?? 0) + 10 }).eq("user_id", user.id);
    }
  }, [user]);

  const recordRun = useCallback(
    async (run: { scenarioId: string; mode: "practice" | "test"; score: number; outcome: "safe" | "partial" | "scammed"; redFlagsCaught: number; redFlagsTotal: number }) => {
      const xpAwarded = run.outcome === "safe" ? 25 : run.outcome === "partial" ? 12 : 4;
      setProgress((p) => {
        const next = {
          ...p,
          xp: p.xp + xpAwarded,
          runs: [{ scenarioId: run.scenarioId, mode: run.mode, score: run.score, outcome: run.outcome, ts: Date.now() }, ...p.runs].slice(0, 50),
        };
        saveLocal(next);
        return next;
      });
      if (user) {
        await supabase.from("scenario_runs").insert({
          user_id: user.id,
          scenario_id: run.scenarioId,
          mode: run.mode,
          score: run.score,
          outcome: run.outcome,
          red_flags_caught: run.redFlagsCaught,
          red_flags_total: run.redFlagsTotal,
          xp_awarded: xpAwarded,
        });
        const { data: prof } = await supabase.from("profiles").select("xp").eq("user_id", user.id).maybeSingle();
        await supabase.from("profiles").update({ xp: (prof?.xp ?? 0) + xpAwarded }).eq("user_id", user.id);
      }
      return xpAwarded;
    },
    [user],
  );

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProgress(empty());
    localStorage.removeItem(KEY);
  };

  return {
    user,
    loading,
    progress,
    setAudience,
    setDisplayName,
    completeLesson,
    recordRun,
    signOut,
    isGuest: !user,
  };
}
