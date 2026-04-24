import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type StatusCode     = "available" | "bio-break" | "break" | "meeting";
export type StatusCategory = "available" | "working" | "unavailable";

export interface StatusOption {
  id: StatusCode;
  label: string;
  isAvailable: boolean;
}

export const STATUS_OPTIONS: StatusOption[] = [
  { id: "available", label: "Available", isAvailable: true  },
  { id: "bio-break", label: "Bio Break", isAvailable: false },
  { id: "break",     label: "Break",     isAvailable: false },
  { id: "meeting",   label: "Meeting",   isAvailable: false },
];

/** Which reporting category a given status code rolls up into. */
export function getCategory(code: StatusCode): StatusCategory {
  if (code === "available") return "available";
  return "unavailable";
}

export function formatHMS(seconds: number): string {
  const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

/* ─── Context value ──────────────────────────────────────────────────────── */

interface AgentStatusContextValue {
  status:    StatusCode;
  setStatus: (code: StatusCode) => void;
  elapsed:   number; // seconds in the current status slot
  /**
   * Banked seconds per individual status code (does NOT include the
   * current live elapsed — add elapsed to status key for the live total).
   */
  accumulated: Record<StatusCode, number>;
}

const AgentStatusContext = createContext<AgentStatusContextValue | null>(null);

/* ─── Provider ───────────────────────────────────────────────────────────── */

const ZERO_ACCUMULATED: Record<StatusCode, number> = {
  "available": 0,
  "bio-break": 0,
  "break":     0,
  "meeting":   0,
};

export function AgentStatusProvider({ children }: { children: React.ReactNode }) {
  const [status,      setStatusRaw]   = useState<StatusCode>("bio-break");
  const [startedAt,   setStartedAt]   = useState(() => Date.now());
  const [accumulated, setAccumulated] = useState<Record<StatusCode, number>>(ZERO_ACCUMULATED);

  // Tick — re-renders consumers every second so elapsed is always fresh.
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 1_000);
    return () => clearInterval(id);
  }, []);

  const elapsed = Math.floor((Date.now() - startedAt) / 1_000);

  // Refs so setStatus can read latest values without stale closures.
  const startedAtRef = useRef(startedAt);
  const statusRef    = useRef(status);
  useEffect(() => { startedAtRef.current = startedAt; }, [startedAt]);
  useEffect(() => { statusRef.current    = status;    }, [status]);

  const setStatus = useCallback((newCode: StatusCode) => {
    const now     = Date.now();
    const seconds = Math.floor((now - startedAtRef.current) / 1_000);

    // Bank elapsed seconds into the specific status code slot.
    setAccumulated((prev) => ({
      ...prev,
      [statusRef.current]: prev[statusRef.current] + seconds,
    }));
    setStatusRaw(newCode);
    setStartedAt(now);
  }, []);

  return (
    <AgentStatusContext.Provider value={{ status, setStatus, elapsed, accumulated }}>
      {children}
    </AgentStatusContext.Provider>
  );
}

/* ─── Hook ───────────────────────────────────────────────────────────────── */

export function useAgentStatus(): AgentStatusContextValue {
  const ctx = useContext(AgentStatusContext);
  if (!ctx) throw new Error("useAgentStatus must be used within <AgentStatusProvider>");
  return ctx;
}
