import { useCallback, useEffect, useRef, useState } from 'react';
import { DEMO_SCENARIO } from '../lib/scenario';
import { evaluateAction } from '../lib/policy';
import { scanAndRedact } from '../lib/privacy';

/** Turns one scenario step into a decided event for the feed. */
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

/** Runs the demo scenario on a timer and collects decided events. */
export function useScenario() {
  const [events, setEvents] = useState([]);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const timers = useRef([]);

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

  const start = useCallback(() => {
    reset();
    setRunning(true);

    DEMO_SCENARIO.forEach((step, index) => {
      const timer = setTimeout(() => {
        const event = runStep(step, index);
        setEvents((prev) => [...prev, event]);

        if (index === DEMO_SCENARIO.length - 1) {
          setRunning(false);
          setFinished(true);
        }
      }, step.at);
      timers.current.push(timer);
    });
  }, [reset]);

  // Stop pending timers when the page unmounts
  useEffect(() => clearTimers, [clearTimers]);

  return { events, running, finished, start, reset };
}
