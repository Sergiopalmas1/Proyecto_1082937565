import type { Metadata } from "next";
import HolaMundo from "@/components/HolaMundo";
import { readHomeData } from "@/lib/dataService";

const homeData = readHomeData();

export const metadata: Metadata = {
  title: homeData.meta.pageTitle,
  description: homeData.meta.description,
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <HolaMundo
        title={homeData.hero.title}
        subtitle={homeData.hero.subtitle}
        description={homeData.hero.description}
      />
    </main>
  );
}
