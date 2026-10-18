/**
 * Action policy: decides whether an agent action may run.
 * Deny by default. Anything not explicitly allowed is blocked.
 */

const USER_TASK_ACTIONS = new Set(['read_document', 'summarize', 'write_summary']);
const DOCUMENT_BLOCKED_ACTIONS = new Set(['send_email', 'http_request', 'delete_file', 'share_external']);
const APPROVAL_ACTIONS = new Set(['share_external']);

export function evaluateAction({ source, action }) {
  if (source === 'document' && DOCUMENT_BLOCKED_ACTIONS.has(action)) {
    return {
      decision: 'block',
      reason: 'The instruction came from document content, not from the user',
    };
  }

  if (APPROVAL_ACTIONS.has(action)) {
    return {
      decision: 'ask',
      reason: 'Sending data outside the company needs a person to approve it',
    };
  }

  if ((source === 'user' || source === 'agent') && USER_TASK_ACTIONS.has(action)) {
    return {
      decision: 'allow',
      reason: source === 'user' ? 'Requested directly by the user' : 'Routine step inside the approved task',
    };
  }

  return {
    decision: 'block',
    reason: 'This action is not on the allow list',
  };
}
