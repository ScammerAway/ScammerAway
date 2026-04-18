import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";

type ResourceItem = {
  title: string;
  description: string;
  url: string;
};

const resources: ResourceItem[] = [
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
    title: "IRS (Internal Revenue Service) Scam",
    description: "What to do if you receive call, email, mail or message that claims that they are the IRS and you are unsure.",
    url: "https://www.irs.gov/help/how-to-know-its-the-irs",
  },
];

const Resource: React.FC = () => {
  return (
    <AppShell>
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-4xl md:text-5xl font-black">
            Resources
          </h1>
          <p className="mt-2 text-muted-foreground max-w-xl">
            Explore trusted sites to learn more about scams and how to stay safe.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-3xl border border-border bg-card p-6 shadow-soft hover:-translate-y-1 hover:shadow-pop transition-all"
          >
            <h3 className="font-display text-xl font-bold">
              {item.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {item.description}
            </p>

            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block"
            >
              <Button>Visit</Button>
            </a>
          </motion.div>
        ))}
      </div>
    </AppShell>
  );
};

export default Resource;