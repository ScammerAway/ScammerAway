import React from "react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Youtube, ExternalLink } from "lucide-react";

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
  return (
    <AppShell>
      {/* Header Section */}
      <div className="mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-black">
          Resources
        </h1>
        <p className="mt-2 text-muted-foreground max-w-xl">
          Deepen your knowledge with trusted guides and real-world exposure.
        </p>
      </div>

      {/* Official Resources Section */}
      <section>
        <div className="flex items-center gap-2 mb-6 text-primary">
          <ExternalLink className="h-5 w-5" />
          <h2 className="font-display text-2xl font-bold">Official Sites</h2>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {officialResources.map((item, i) => (
            <motion.div
              key={`official-${i}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-3xl border border-border bg-card p-6 shadow-soft hover:-translate-y-1 hover:shadow-pop transition-all"
            >
              <h3 className="font-display text-xl font-bold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block">
                <Button>Visit Site</Button>
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* YouTube Section - Clean Layout */}
      <section className="mt-16 mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Youtube className="h-6 w-6 text-red-600" />
          <h2 className="font-display text-2xl font-bold">Scambaiter</h2>
        </div>

        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {youtubeChannels.map((item, i) => (
            <motion.div
              key={`yt-${i}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (i + officialResources.length) * 0.05 }}
              className="group flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-5 text-center shadow-sm hover:shadow-md transition-all"
            >
              <h3 className="font-display text-lg font-bold group-hover:text-red-600 transition-colors">
                {item.title}
              </h3>
              
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-3 w-full"
              >
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full rounded-xl group-hover:bg-red-50 group-hover:text-red-600 group-hover:border-red-200"
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