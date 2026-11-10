'use client';

import { useState } from 'react';

const examples = [
  { id: 'feature', label: 'Build a feature', request: 'Add a setting using the patterns already in this project.', steps: [
    ['Discover', 'Read project instructions and find the existing settings implementation.'],
    ['Implement', 'Reuse the relevant components and keep the change scoped.'],
    ['Review', 'Inspect the diff for behavior and convention mismatches.'],
    ['Verify', 'Run appropriate checks and report what remains unverified.'],
  ] },
  { id: 'bug', label: 'Investigate a bug', request: 'Find why this validation fails and verify a focused fix.', steps: [
    ['Discover', 'Trace the reported behavior and examine nearby conventions.'],
    ['Investigate', 'Identify the cause before choosing a focused change.'],
    ['Review', 'Check the fix and its effect on existing behavior.'],
    ['Verify', 'Run relevant checks and explain any gaps.'],
  ] },
  { id: 'resume', label: 'Resume a task', request: 'Continue this task from its saved checkpoint.', steps: [
    ['Recover', 'Inspect the available state, objective and previous handoff.'],
    ['Reconcile', 'Compare recorded progress with the current project.'],
    ['Continue', 'Work within the established scope and constraints.'],
    ['Report', 'Summarize the current evidence and remaining work.'],
  ] },
];

export default function WorkflowDemo() {
  const [selected, setSelected] = useState(0);
  const example = examples[selected];
  return <div className="demo-shell">
    <div className="demo-titlebar"><div className="demo-window-dots" aria-hidden="true"><i/><i/><i/></div><span>Workflow preview</span><span className="demo-illustration">Illustrative example</span></div>
    <div className="demo-body">
      <div className="demo-sidebar"><span className="demo-sidebar-label">Choose a task</span><div className="demo-options" aria-label="Choose an example workflow">{examples.map((item, index) => <button type="button" key={item.id} aria-pressed={selected === index} onClick={() => setSelected(index)}><span aria-hidden="true">{index === 0 ? '◇' : index === 1 ? '⌕' : '↻'}</span>{item.label}</button>)}</div><p>Adapt the request to your project and tools.</p></div>
      <div className="demo-workspace"><div className="demo-request"><span>Your request</span><p>“{example.request}”</p></div><div className="demo-heading"><span>Suggested workflow</span><small>Guidance, not an execution log</small></div><ol className="demo-steps" aria-live="polite">{example.steps.map(([title, description], index) => <li key={title}><span className="demo-marker">{index + 1}</span><div><strong>{title}</strong><p>{description}</p></div></li>)}</ol></div>
    </div>
  </div>;
}
