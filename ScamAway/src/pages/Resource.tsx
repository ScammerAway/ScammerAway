import React from "react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Youtube, ExternalLink } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";

type ResourceItem = {
  title: string;
  description?: string;
  url: string;
};

const officialResources: ResourceItem[] = [
  {
    title: "FTC Scam Alerts",
    description: "Latest scams and how to avoid them.",
    url: "https://consumer.ftc.gov/scams",
  },
  {
    title: "Phishing Guide (CISA)",
    description: "Learn how phishing attacks work.",
    url: "https://www.cisa.gov/news-events/news/avoiding-social-engineering-and-phishing-attacks",
  },
  {
    title: "Identity Theft (USA.gov)",
    description: "What to do if your identity is stolen.",
    url: "https://www.usa.gov/identity-theft",
  },
  {
    title: "IRS Scam Protection",
    description: "Verify if a message truly came from the IRS.",
    url: "https://www.irs.gov/help/how-to-know-its-the-irs",
  },
  {
    title: "Job Scam Info (FTC)",
    description: "Identify and avoid recruitment fraud.",
    url: "https://consumer.ftc.gov/articles/job-scams",
  },
  {
    title: "Investment Scam(FTC)",
    description: "Information about investment scams such as crypto, new money-making opportunity ",
    url: "https://consumer.ftc.gov/articles/investment-scams",
  },
];

const youtubeChannels: ResourceItem[] = [
  { title: "Pleasant Green", url: "https://www.youtube.com/@PleasantGreen" },
  { title: "Jim Browning", url: "https://www.youtube.com/@JimBrowning" },
  { title: "Scammer Payback", url: "https://www.youtube.com/@ScammerPayback" },
  { title: "Kitboga", url: "https://www.youtube.com/@KitbogaShow" },
  { title: "Trilogy Media", url: "https://www.youtube.com/trilogymedia"},
  { title: "NanoBaiter", url: "https://www.youtube.com/@NanoBaiter"},
  { title: "Scambaiter", url: "https://www.youtube.com/@Scambaiter"},
  { title: "ScammerRevolts", url: "https://www.youtube.com/scammerrevolts"}
];

const Resources: React.FC = () => {
  const { progress } = useProgress();
  const isSenior = progress.audience === "senior";

  return (
    <AppShell>
      {/* Header Section */}
      <div className="mb-12">
        <h1 className={cn(
          "font-display font-black",
          isSenior ? "text-5xl md:text-7xl" : "text-4xl md:text-5xl"
        )}>
          Resources
        </h1>
        <p className={cn(
          "mt-2 text-muted-foreground max-w-xl",
          isSenior ? "text-xl md:text-2xl leading-relaxed" : "text-base"
        )}>
          Deepen your knowledge with trusted guides and real-world exposure.
        </p>
      </div>

      {/* Official Resources Section */}
      <section>
        <div className="flex items-center gap-3 mb-6 text-primary">
          <ExternalLink className={isSenior ? "h-8 w-8" : "h-5 w-5"} />
          <h2 className={cn("font-display font-bold", isSenior ? "text-3xl" : "text-2xl")}>
            Official Sites
          </h2>
        </div>
        
        <div className={cn(
          "grid gap-6",
          isSenior ? "grid-cols-1 lg:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"
        )}>
          {officialResources.map((item, i) => (
            <motion.div
              key={`official-${i}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "rounded-3xl border border-border bg-card shadow-soft hover:-translate-y-1 hover:shadow-pop transition-all",
                isSenior ? "p-10 border-2" : "p-6"
              )}
            >
              <h3 className={cn("font-display font-bold", isSenior ? "text-3xl" : "text-xl")}>
                {item.title}
              </h3>
              <p className={cn(
                "mt-3 text-muted-foreground",
                isSenior ? "text-xl leading-relaxed" : "text-sm"
              )}>
                {item.description}
              </p>
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block w-full">
                <Button className={cn("w-full", isSenior ? "h-16 text-xl rounded-2xl" : "")}>
                  Visit Site
                </Button>
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* YouTube Section */}
      <section className="mt-16 mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Youtube className={cn("text-red-600", isSenior ? "h-10 w-10" : "h-6 w-6")} />
          <h2 className={cn("font-display font-bold", isSenior ? "text-3xl" : "text-2xl")}>
            Scambaiter
          </h2>
        </div>

        <div className={cn(
          "grid gap-4",
          isSenior ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        )}>
          {youtubeChannels.map((item, i) => (
            <motion.div
              key={`yt-${i}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (i + officialResources.length) * 0.05 }}
              className={cn(
                "group flex flex-col items-center justify-center rounded-2xl border border-border bg-card text-center shadow-sm hover:shadow-md transition-all",
                isSenior ? "p-8 border-2" : "p-5"
              )}
            >
              <h3 className={cn(
                "font-display font-bold group-hover:text-red-600 transition-colors",
                isSenior ? "text-2xl" : "text-lg"
              )}>
                {item.title}
              </h3>
              
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-4 w-full"
              >
                <Button 
                  variant="outline" 
                  className={cn(
                    "w-full rounded-xl group-hover:bg-red-50 group-hover:text-red-600 group-hover:border-red-200",
                    isSenior ? "h-14 text-lg" : "h-10 text-sm"
                  )}
                >
                  Watch
                </Button>
              </a>
            </motion.div>
          ))}
        </div>
      </section>
    </AppShell>
  );
};

export default Resources;