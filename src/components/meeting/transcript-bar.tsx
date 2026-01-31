"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const transcriptLines = [
  { speaker: "Sarah Chen", text: "Let's review the progress on the API integration." },
  { speaker: "Marcus Johnson", text: "I've completed the payment endpoints and added the webhook handlers." },
  { speaker: "Alex Rivera", text: "That's great. Do we have the test coverage for those?" },
];

export function TranscriptBar() {
  const [currentLine, setCurrentLine] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Simulate live transcript updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine((prev) => (prev + 1) % transcriptLines.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const current = transcriptLines[currentLine];

  if (!isVisible) return null;

  return (
    <div className="relative border-t bg-card/80 backdrop-blur-sm">
      <div className="flex items-center gap-3 px-6 py-3">
        {/* Live indicator */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span className="text-xs font-medium text-primary">LIVE</span>
        </div>

        {/* Transcript text */}
        <div className="flex-1 overflow-hidden">
          <div
            className={cn(
              "transition-all duration-300",
              "animate-fade-in"
            )}
          >
            <span className="font-medium text-primary">{current.speaker}: </span>
            <span className="text-foreground">{current.text}</span>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="text-muted-foreground hover:text-foreground"
        >
          <span className="sr-only">Close transcript bar</span>
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
