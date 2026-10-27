import { useCallback, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { DEMO_SCENARIO } from '../lib/scenario';
import { evaluateAction } from '../lib/policy';
import { scanAndRedact } from '../lib/privacy';

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || 'https://aegisai-backend-production-11af.up.railway.app';

/** Browser fallback: turns one scenario step into a decided event. */
function runStep(step, id) {
  if (step.kind === 'output') {
    const { findings, redacted } = scanAndRedact(step.text);
    const labels = [...new Set(findings.map((f) => f.label))];
    return {
      id,
      ...step,
      decision: findings.length > 0 ? 'redact' : 'allow',
      reason:
        findings.length > 0
          ? `Hidden ${labels.join(', ')} before the output leaves the system`
          : 'No sensitive data found',
      before: step.text,
      after: redacted,
    };
  }

  const { decision, reason } = evaluateAction(step);
  return { id, ...step, decision, reason };
}

/**
 * Runs the demo. Uses the Python backend when it is reachable,
 * and falls back to the browser demo when it isn't.
 */
export function useScenario() {
  const [events, setEvents] = useState([]);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [mode, setMode] = useState('offline'); // 'live' when the backend answers
  const timers = useRef([]);
  const socketRef = useRef(null);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    setEvents([]);
    setRunning(false);
    setFinished(false);
  }, [clearTimers]);

  // Connect to the backend once
  useEffect(() => {
    const socket = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      timeout: 4000,
    });
    socketRef.current = socket;

    socket.on('connect', () => setMode('live'));
    socket.on('disconnect', () => setMode('offline'));
    socket.on('connect_error', () => setMode('offline'));
    socket.on('decision', (event) => setEvents((prev) => [...prev, event]));
    socket.on('scenario_complete', () => {
      setRunning(false);
      setFinished(true);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const start = useCallback(() => {
    reset();
    setRunning(true);

    const socket = socketRef.current;
    if (socket && socket.connected) {
      socket.emit('run_scenario');
      return;
    }

    // Fallback: play the browser demo (step.at is in milliseconds)
    DEMO_SCENARIO.forEach((step, index) => {
      const timer = setTimeout(() => {
        setEvents((prev) => [...prev, runStep(step, index)]);
        if (index === DEMO_SCENARIO.length - 1) {
          setRunning(false);
          setFinished(true);
        }
      }, step.at);
      timers.current.push(timer);
    });
  }, [reset]);

  // Stop pending browser timers when the page unmounts
  useEffect(() => clearTimers, [clearTimers]);

  return { events, running, finished, start, reset, mode };
}
