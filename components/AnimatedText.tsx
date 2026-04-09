"use client";

import { motion, type Variants } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  delay?: number;
}

const containerVariants: Variants = {
  hidden: {},
  visible: (delay = 0) => ({
    transition: {
      staggerChildren: 0.04,
      delayChildren: delay,
    },
  }),
};

const letterVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

export default function AnimatedText({ text, delay = 0 }: AnimatedTextProps) {
  const letters = Array.from(text);

  return (
    <motion.span
      className="inline-flex flex-wrap justify-center gap-1 overflow-hidden text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      custom={delay}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={`${letter}-${index}`}
          className="inline-block text-transparent bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-200 bg-clip-text"
          variants={letterVariants}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.span>
  );
}
