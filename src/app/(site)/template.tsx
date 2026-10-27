"use client";

import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { takeNavDirection } from "@/lib/nav-direction";

export default function Template({ children }: { children: ReactNode }) {
  // Tabs to the right slide in from the right, tabs to the left from the left;
  // every other navigation rises into place.
  const [dir] = useState(takeNavDirection);

  return (
    <motion.div
      initial={{ opacity: 0, x: dir * 36, y: dir === 0 ? 10 : 0 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ type: "spring", stiffness: 380, damping: 38, mass: 0.8 }}
    >
      {children}
    </motion.div>
  );
}
