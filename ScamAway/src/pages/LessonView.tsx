import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, AlertTriangle, ShieldCheck, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { LESSONS } from "@/content/curriculum";
import { useProgress } from "@/hooks/useProgress";

const LessonView = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { progress, completeLesson } = useProgress();
  const lesson = LESSONS.find((l) => l.id === id);

  if (!lesson) {
    return (
      <AppShell>
        <p>Lesson not found. <Link to="/learn" className="underline">Back to lessons</Link></p>
      </AppShell>
    );
  }

  const done = progress.completedLessons.includes(lesson.id);

  return (
    <AppShell>
      <Button variant="ghost" size="sm" onClick={() => nav(-1)} className="mb-4">
        <ArrowLeft /> Back
      </Button>

      <motion.article initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
        <div className="text-6xl">{lesson.emoji}</div>
        <h1 className="mt-4 font-display text-4xl md:text-5xl font-black leading-tight">{lesson.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{lesson.summary}</p>

        <section className="mt-10 rounded-3xl border-2 border-[hsl(var(--danger))]/20 bg-[hsl(var(--danger))]/5 p-6">
          <div className="flex items-center gap-2 text-[hsl(var(--danger))] font-semibold">
            <AlertTriangle className="h-5 w-5" /> Red flags to watch for
          </div>
          <ul className="mt-3 space-y-2">
            {lesson.redFlags.map((rf) => (
              <li key={rf} className="flex gap-2"><span className="text-[hsl(var(--danger))]">●</span><span>{rf}</span></li>
            ))}
          </ul>
        </section>

        <section className="mt-6 rounded-3xl border-2 border-[hsl(var(--safe))]/20 bg-[hsl(var(--safe))]/5 p-6">
          <div className="flex items-center gap-2 text-[hsl(var(--safe))] font-semibold">
            <ShieldCheck className="h-5 w-5" /> What to do instead
          </div>
          <ul className="mt-3 space-y-2">
            {lesson.tips.map((t) => (
              <li key={t} className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-[hsl(var(--safe))] shrink-0 mt-0.5" /><span>{t}</span></li>
            ))}
          </ul>
        </section>

        <div className="mt-10 flex gap-3">
          {done ? (
            <Button asChild variant="outline" size="lg"><Link to="/practice">Practice this →</Link></Button>
          ) : (
            <Button size="lg" onClick={async () => { await completeLesson(lesson.id); nav("/learn"); }}>
              Mark complete
            </Button>
          )}
          <Button asChild variant="ghost" size="lg"><Link to="/learn">More lessons</Link></Button>
        </div>
      </motion.article>
    </AppShell>
  );
};

export default LessonView;
