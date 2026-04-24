import { useCallback, useEffect, useRef, useState } from "react";
import SpeedTest from "@cloudflare/speedtest";

export type TestStatus = "idle" | "running" | "finished" | "error";

export interface SpeedTestResults {
  downloadMbps: number;
  uploadMbps: number;
  pingMs: number;
  jitterMs: number;
}

export interface LiveMetrics {
  downloadMbps: number | null;
  uploadMbps: number | null;
  pingMs: number | null;
  jitterMs: number | null;
  progress: number;
  phase: "idle" | "ping" | "download" | "upload" | "finished";
}

export function useSpeedTest() {
  const [status, setStatus] = useState<TestStatus>("idle");
  const [live, setLive] = useState<LiveMetrics>({
    downloadMbps: null,
    uploadMbps: null,
    pingMs: null,
    jitterMs: null,
    progress: 0,
    phase: "idle",
  });
  const [results, setResults] = useState<SpeedTestResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const runningRef = useRef<SpeedTest | null>(null);

  const start = useCallback(() => {
    if (runningRef.current) return;
    setStatus("running");
    setResults(null);
    setError(null);
    setLive({
      downloadMbps: null,
      uploadMbps: null,
      pingMs: null,
      jitterMs: null,
      progress: 0,
      phase: "ping",
    });

    const engine = new SpeedTest({
      autoStart: true,
      measurements: [
        { type: "latency", numPackets: 8 },
        { type: "download", bytes: 10_000_000, count: 8 },
        { type: "upload", bytes: 10_000_000, count: 6 },
        { type: "packetLoss", numPackets: 400, responsesWaitTime: 3000 },
      ],
    });
    runningRef.current = engine;

    engine.onResultsChange = ({ type }) => {
      const dl = engine.results.getDownloadBandwidth();
      const ul = engine.results.getUploadBandwidth();
      const ping = engine.results.getUnloadedLatency();
      const jitter = engine.results.getUnloadedJitter();

      const toMbps = (bps?: number | null) =>
        bps != null && isFinite(bps) ? bps / 1_000_000 : null;

      setLive((prev) => ({
        ...prev,
        downloadMbps: toMbps(dl),
        uploadMbps: toMbps(ul),
        pingMs: ping ?? prev.pingMs,
        jitterMs: jitter ?? prev.jitterMs,
        phase:
          type === "download" ? "download" :
          type === "upload" ? "upload" :
          type === "latency" ? "ping" :
          prev.phase,
      }));
    };

    engine.onFinish = (r) => {
      const summary = r.getSummary();
      const finalDown = (summary.download ?? 0) / 1_000_000;
      const finalUp = (summary.upload ?? 0) / 1_000_000;
      const finalPing = summary.latency ?? 0;
      const finalJitter = summary.jitter ?? 0;

      setResults({
        downloadMbps: finalDown,
        uploadMbps: finalUp,
        pingMs: finalPing,
        jitterMs: finalJitter,
      });
      setLive({
        downloadMbps: finalDown,
        uploadMbps: finalUp,
        pingMs: finalPing,
        jitterMs: finalJitter,
        progress: 1,
        phase: "finished",
      });
      setStatus("finished");
      runningRef.current = null;
    };

    engine.onError = (message) => {
      setError(message ?? "Speed test failed");
      setStatus("error");
      runningRef.current = null;
    };
  }, []);

  const reset = useCallback(() => {
    runningRef.current = null;
    setStatus("idle");
    setResults(null);
    setError(null);
    setLive({
      downloadMbps: null,
      uploadMbps: null,
      pingMs: null,
      jitterMs: null,
      progress: 0,
      phase: "idle",
    });
  }, []);

  useEffect(() => {
    return () => {
      runningRef.current = null;
    };
  }, []);

  return { status, live, results, error, start, reset };
}