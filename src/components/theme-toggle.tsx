"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

function subscribeToTheme(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  window.addEventListener("storage", onChange);
  return () => {
    observer.disconnect();
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot(): boolean {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot(): boolean {
  return false;
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribeToTheme, getSnapshot, getServerSnapshot);

  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("bv-theme", next ? "dark" : "light");
    } catch {
      /* storage may be unavailable — theme still applies for this session */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className="bv-btn bv-btn-ghost !p-2"
    >
      {dark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}