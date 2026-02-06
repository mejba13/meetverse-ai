"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronUp, ChevronDown } from "lucide-react";
import { mockTranscriptBarLines } from "./mock-data";

function WaveformVisualizer() {
  return (
    <div className="flex items-center gap-[3px] h-4">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-[#CAFF4B]"
          animate={{
            height: ["4px", "14px", "6px", "12px", "4px"],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}

export function TranscriptBar() {
  const [currentLine, setCurrentLine] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine((prev) => (prev + 1) % mockTranscriptBarLines.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  const current = mockTranscriptBarLines[currentLine];
  const recentLines = isExpanded
    ? [
        mockTranscriptBarLines[(currentLine - 2 + mockTranscriptBarLines.length) % mockTranscriptBarLines.length],
        mockTranscriptBarLines[(currentLine - 1 + mockTranscriptBarLines.length) % mockTranscriptBarLines.length],
        current,
      ]
    : [current];

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="mx-4 mb-1 rounded-xl bg-[#111111]/80 backdrop-blur-xl border border-white/[0.06] overflow-hidden"
    >
      <div className="flex items-start gap-3 px-4 py-2.5">
        {/* Left accent bar */}
        <div className="w-[2px] self-stretch min-h-[20px] rounded-full bg-gradient-to-b from-[#CAFF4B] to-[#9B5DE5] flex-shrink-0 mt-0.5" />

        {/* Waveform */}
        <div className="flex-shrink-0 mt-0.5">
          <WaveformVisualizer />
        </div>

        {/* Transcript text */}
        <div className="flex-1 overflow-hidden min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={isExpanded ? "expanded" : currentLine}
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {recentLines.map((line, i) => (
                <div
                  key={`${i}-${line.speaker}`}
                  className={`text-sm ${i < recentLines.length - 1 ? "mb-1.5 opacity-40" : ""}`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-[#CAFF4B]/10 border border-[#CAFF4B]/20 text-[#CAFF4B] text-[11px] font-medium">
                      {line.speaker}
                    </span>
                  </span>
                  <span className="text-white/70 ml-2">{line.text}</span>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-6 h-6 rounded-md flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsVisible(false)}
            className="w-6 h-6 rounded-md flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="h-3 w-3" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
