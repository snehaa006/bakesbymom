"use client";

import { createContext, useContext, MutableRefObject } from "react";

type ProgressRef = MutableRefObject<{ value: number }>;

export const ScrollProgressContext = createContext<ProgressRef | null>(null);

export function useScrollProgress() {
  const ctx = useContext(ScrollProgressContext);
  if (!ctx) {
    throw new Error(
      "useScrollProgress must be used within SmoothScrollProvider"
    );
  }
  return ctx;
}
