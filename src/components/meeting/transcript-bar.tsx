"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const transcriptLines = [
  { speaker: "Sarah Chen", text: "Let's review the progress on the API integration." },
  { speaker: "Marcus Johnson", text: "I've completed the payment endpoints and added the webhook handlers." },
  { speaker: "Alex Rivera", text: "That's great. Do we have the test coverage for those?" },
];

export function TranscriptBar() {
  const [currentLine, setCurrentLine] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine((prev) => (prev + 1) % transcriptLines.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const current = transcriptLines[currentLine];

  if (!isVisible) return null;

  return (
    <div className="relative border-t border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
      <div className="flex items-center gap-3 px-5 py-2.5">
        {/* Live indicator */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#CAFF4B] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#CAFF4B]" />
          </span>
          <span className="text-[10px] font-semibold text-[#CAFF4B] uppercase tracking-wider">LIVE</span>
        </div>

        <div className="w-px h-4 bg-white/[0.08]" />

        {/* Transcript text */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentLine}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-sm"
            >
              <span className="font-medium text-[#CAFF4B]">{current.speaker}: </span>
              <span className="text-white/70">{current.text}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Close button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsVisible(false)}
          className="w-6 h-6 rounded-md flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.06] transition-colors flex-shrink-0"
        >
          <X className="h-3 w-3" />
        </motion.button>
      </div>
    </div>
  );
}
