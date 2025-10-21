"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedChatMessageProps {
  children: ReactNode;
  type: "user" | "oracle";
  delay?: number;
}

export function AnimatedChatMessage({ children, type, delay = 0 }: AnimatedChatMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.3,
        delay,
        ease: [0.23, 1, 0.32, 1], // Smooth easing
      }}
      className={`flex ${type === "user" ? "justify-end" : "justify-start"}`}
    >
      {children}
    </motion.div>
  );
}

interface TypingIndicatorProps {
  show: boolean;
}

export function TypingIndicator({ show }: TypingIndicatorProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex justify-start"
    >
      <div className="flex items-center gap-2 px-4 py-3 bg-accent-950/30 border border-accent-600/30 rounded-2xl rounded-bl-sm max-w-[80px]">
        <div className="flex gap-1">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
            className="w-2 h-2 bg-accent-400 rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            className="w-2 h-2 bg-accent-400 rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
            className="w-2 h-2 bg-accent-400 rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
}
