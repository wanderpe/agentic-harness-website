'use client';

import { useState } from 'react';
import '../public/assets/workflow-inspector.css';

const stages = [
  { label: 'Request', title: 'Start with the objective', description: 'Codex uses the harness guidance to establish the outcome, authorized scope and acceptance criteria, then discovers the relevant project instructions and existing code.', moves: 'Objective, constraints, relevant files and available checks.', note: 'If a project defines its own workflow, its applicable instructions take precedence.' },
  { label: 'Route', title: 'Choose the right roles', description: 'The harness suggests a route proportional to the task. The same assistant may perform roles sequentially; separate agents may be used only when authorized and supported by the host.', moves: 'The selected route, role responsibilities and task context.', note: 'A role packet describes work; it does not launch an agent by itself.' },
  { label: 'Handoff', title: 'Pass work with its context', description: 'A role receives its scope, relevant artifacts, constraints and completion checks. The receiver inspects the inputs before acknowledging the handoff.', moves: 'Sender, receiver, artifact locations, content identity and acknowledgement.', note: 'Missing or stale inputs must be resolved before dependent work continues.' },
  { label: 'Checkpoint', title: 'Record state for the next step', description: 'When storage is available, a checkpoint can record the current node, status, artifacts, evidence, handoffs and next action. A later session reconciles that record with the current project.', moves: 'Current task state and the evidence needed to resume.', note: 'Without durable storage, state is reported in the conversation. A checkpoint alone does not prove crash recovery.' },
  { label: 'Gates', title: 'Check evidence at the boundary', description: 'The optional read-only guard can inspect supplied records and current content identity before review, QA or release. Failed or missing checks are reported rather than treated as passed.', moves: 'Current artifacts, identity, review and QA records, and any actual release authorization.', note: 'The fallback gate is advisory; it cannot authenticate approvals, prove tests ran, launch agents or enforce host permissions.' },
] as const;

export default function WorkflowInspector() {
  const [active, setActive] = useState(0);
  const stage = stages[active];
  return <section className="workflow-inspector" aria-labelledby="inspector-title">
    <div className="inspector-heading"><div><p className="inspector-kicker">Inside the handoff</p><h3 id="inspector-title">Follow the context, not just the roles.</h3></div><p>Choose a stage to see what the agent carries forward and where the checks apply.</p></div>
    <div className="inspector-rail" role="group" aria-label="Choose a workflow stage">{stages.map((item, index) => <button key={item.label} type="button" aria-pressed={active === index} onClick={() => setActive(index)}><span className="inspector-index">{String(index + 1).padStart(2, '0')}</span><span>{item.label}</span><span className="inspector-dot" aria-hidden="true"/></button>)}</div>
    <div className="inspector-panel" aria-live="polite"><div className="inspector-panel-title"><span>Illustrative stage {String(active + 1).padStart(2, '0')} / 05</span><h4>{stage.title}</h4><p>{stage.description}</p></div><div className="inspector-facts"><div><span>What moves forward</span><p>{stage.moves}</p></div><div><span>Important boundary</span><p>{stage.note}</p></div></div></div>
    {active === 4 && <div className="inspector-gates" aria-label="Evidence gate examples"><article><span>01</span><strong>Review</strong><p>Checks required context, plan and handoff receipts.</p></article><article><span>02</span><strong>QA</strong><p>Requires a current passing review and its receipt.</p></article><article><span>03</span><strong>Release</strong><p>Adds passing QA, checks, acceptance results and matching authorization.</p></article></div>}
    <p className="inspector-note">Example guidance, not a live task or an enforced state machine. An adopted repository state manager remains authoritative; changed content can invalidate earlier evidence.</p>
  </section>;
}
