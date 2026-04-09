"use client";

import { motion } from "framer-motion";
import AnimatedText from "@/components/AnimatedText";

interface HolaMundoProps {
  title: string;
  subtitle: string;
  description: string;
}

export default function HolaMundo({ title, subtitle, description }: HolaMundoProps) {
  return (
    <section className="relative flex min-h-screen items-center justify-center px-6 py-16 text-center sm:px-8">
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-cyan-400/20 to-transparent blur-3xl" />
      <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-[36px] border border-white/10 bg-slate-950/85 p-10 shadow-[0_30px_120px_rgba(14,165,233,0.16)] backdrop-blur-xl">
        <div className="mx-auto mb-8 flex h-1.5 w-32 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 shadow-[0_0_30px_rgba(56,189,248,0.4)]" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto max-w-3xl"
        >
          <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">
            <AnimatedText text={title} delay={0.12} />
          </h1>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.7, ease: "easeOut" }}
            className="mt-8 rounded-full bg-white/5 px-5 py-3 text-sm uppercase tracking-[0.3em] text-cyan-200/90 shadow-[0_0_30px_rgba(56,189,248,0.18)] sm:inline-block"
          >
            {subtitle}
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.95, ease: "easeOut" }}
            className="mx-auto mt-8 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg"
          >
            {description}
          </motion.p>
          <div className="mt-12 flex items-center justify-center gap-4 sm:justify-start">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-200 shadow-[0_0_30px_rgba(56,189,248,0.2)]">
              ✨
            </span>
            <span className="text-sm text-slate-400">Experiencia visual moderna, responsive y con animaciones suaves.</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
