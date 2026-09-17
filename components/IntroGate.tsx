"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function IntroGate() {
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("gateSeen");
    if (!seen) {
      setShow(true);
      const openTimer = setTimeout(() => setOpen(true), 900);
      const hideTimer = setTimeout(() => {
        setShow(false);
        localStorage.setItem("gateSeen", "1");
      }, 2200);
      return () => {
        clearTimeout(openTimer);
        clearTimeout(hideTimer);
      };
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none">
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: open ? "-100%" : 0 }}
            transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
            className="absolute inset-y-0 left-0 w-1/2 bg-[#0b0b0d] border-r border-[#c9a24a]/20"
          />
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: open ? "100%" : 0 }}
            transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
            className="absolute inset-y-0 right-0 w-1/2 bg-[#0b0b0d] border-l border-[#c9a24a]/20"
          />
          <motion.p
            initial={{ opacity: 1 }}
            animate={{ opacity: open ? 0 : 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center font-display text-2xl tracking-[0.3em] text-[#c9a24a]"
          >
            ARDA MOL
          </motion.p>
        </div>
      )}
    </AnimatePresence>
  );
}
