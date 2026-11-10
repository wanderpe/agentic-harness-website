'use client';
import { useState } from 'react';
import '../../public/assets/prompt-commands.css';

const commands = [
  { title: 'Explore the codebase', skill: 'orchestrate-task', description: 'Understand the relevant instructions and patterns before making changes.', prompt: 'Use Agentic Harness to inspect the relevant project instructions, existing code, conventions and checks for [describe the task]. Summarize what you find before making changes.' },
  { title: 'Build a feature', skill: 'orchestrate-task', description: 'Plan, implement and verify a feature in the existing codebase.', prompt: 'Use Agentic Harness to implement [describe the feature]. Follow this project’s existing patterns, review the change, run appropriate checks and report any gaps. Stop before committing or deploying.' },
  { title: 'Investigate a bug', skill: 'systematic-debugging', description: 'Trace the cause and check a focused fix.', prompt: 'Use Agentic Harness to investigate [describe the bug and how to reproduce it]. Identify the root cause, implement a focused fix and verify the affected behavior.' },
  { title: 'Review changes', skill: 'review-changes', description: 'Ask for a read-only review of a specified diff.', prompt: 'Use Agentic Harness to review [the current diff or branch]. Identify concrete defects and risks, and do not modify the source.' },
  { title: 'Create a plan', skill: 'writing-plans', description: 'Map the work, affected files and checks before implementation.', prompt: 'Use Agentic Harness to plan [describe the work]. Identify project conventions, affected files, reuse opportunities and verification steps. Do not implement yet.' },
  { title: 'Assess a design', skill: 'codebase-design', description: 'Review an interface or module boundary against existing code.', prompt: 'Use Agentic Harness to evaluate the design of [module or feature]. Examine existing interfaces, ownership and reuse opportunities, and explain your recommendation.' },
  { title: 'Work test-first', skill: 'test-driven-development', description: 'Request a meaningful regression test before the implementation.', prompt: 'Use Agentic Harness to fix [describe the issue] test-first. Follow the project’s test conventions, show the relevant failing test when possible, implement the fix and rerun the check.' },
  { title: 'Verify before finishing', skill: 'verification-before-completion', description: 'Check the current change against explicit acceptance criteria.', prompt: 'Use Agentic Harness to verify [describe the change] against [acceptance criteria]. Run appropriate available checks and report what passed, failed or could not run.' },
  { title: 'Resume a task', skill: 'resume-harness', description: 'Continue an identifiable task using available saved state.', prompt: 'Use Agentic Harness to resume [task name or checkpoint location]. Inspect the current state and evidence, identify the next action, and continue within the existing scope.' },
  { title: 'Check release readiness', skill: 'prepare-release', description: 'Inspect scope and evidence before an authorized release.', prompt: 'Use Agentic Harness to assess release readiness for [the changes]. Check the current diff, review and QA evidence, and unresolved issues. Stop before committing, pushing or deploying.' },
];

export default function PromptCommands() {
  const [status, setStatus] = useState('');
  async function copy(prompt: string, title: string) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(prompt);
      setStatus(`${title} request copied. Paste it into your Codex chat and replace the placeholders.`);
    } catch {
      setStatus('Copy is unavailable in this browser. Select the example text and copy it manually.');
    }
  }
  return <div className="prompt-reference"><div className="prompt-intro"><p className="eyebrow">COPY & ADAPT</p><h3>Requests you can use in Codex.</h3><p>Copy an example into a Codex chat after installing the plugin. Replace the bracketed text with your task. These are natural-language requests, not built-in slash commands; the named skill is relevant guidance that Codex may select.</p></div><div className="prompt-list">{commands.map(item => <article key={item.title}><div className="prompt-head"><div><span>RELEVANT SKILL · {item.skill}</span><h4>{item.title}</h4></div><button type="button" onClick={() => copy(item.prompt, item.title)} aria-label={`Copy ${item.title} request`}>Copy <span aria-hidden="true">↗</span></button></div><p>{item.description}</p><pre><code>{item.prompt}</code></pre></article>)}</div><p className="prompt-status" role="status" aria-live="polite">{status}</p><p className="prompt-footnote">Available skills and behavior depend on the installed plugin version, the host, project instructions and the tools and permissions Codex can access.</p></div>;
}
