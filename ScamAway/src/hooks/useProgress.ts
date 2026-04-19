import { useCallback, useEffect, useState } from "react";

export type Audience = "teen" | "adult" | "senior" | "all";

type ProgressState = {
  audience: Audience | null;
  completedLessons: string[];
};

type LocalUser = {
  name: string;
} | null;

const STORAGE_KEY = "scammeraway:progress";
const USER_KEY = "scammeraway:user";

const readProgress = (): ProgressState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { audience: null, completedLessons: [] };
    const parsed = JSON.parse(raw);
    return {
      audience: parsed.audience ?? null,
      completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
    };
  } catch {
    return { audience: null, completedLessons: [] };
  }
};

const readUser = (): LocalUser => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as LocalUser) : null;
  } catch {
    return null;
  }
};

export const useProgress = () => {
  const [progress, setProgress] = useState<ProgressState>({ audience: null, completedLessons: [] });
  const [user, setUser] = useState<LocalUser>(null);

  useEffect(() => {
    setProgress(readProgress());
    setUser(readUser());
  }, []);

  const persist = (next: ProgressState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setProgress(next);
  };

  const setAudience = useCallback(async (audience: Audience) => {
    persist({ ...readProgress(), audience });
  }, []);

  const completeLesson = useCallback(async (lessonId: string) => {
    const cur = readProgress();
    if (cur.completedLessons.includes(lessonId)) return;
    persist({ ...cur, completedLessons: [...cur.completedLessons, lessonId] });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  return { progress, user, setAudience, completeLesson, signOut };
};
