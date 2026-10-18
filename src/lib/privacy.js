/**
 * Privacy scanner: finds sensitive data in outgoing text and redacts it.
 * Rule-based on purpose, so each decision can be explained.
 */

const RULES = [
  { label: 'API key', pattern: /\bAKIA[0-9A-Z]{16}\b/g },
  { label: 'password', pattern: /(password\s*[:=]\s*)(\S+)/gi, keepPrefix: true },
  { label: 'email address', pattern: /[\w.+-]+@[\w-]+\.[\w.]+/g },
];

export function scanAndRedact(text) {
  const findings = [];
  let redacted = text;

  for (const rule of RULES) {
    redacted = redacted.replace(rule.pattern, (match, prefix) => {
      findings.push({ label: rule.label });
      return rule.keepPrefix ? `${prefix}[REDACTED]` : '[REDACTED]';
    });
  }

  return { findings, redacted };
}
