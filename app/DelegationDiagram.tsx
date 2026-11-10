'use client';

import { useState } from 'react';
import '../public/assets/delegation-diagram.css';

const paths = {
  sequential: {
    label: 'Sequential roles',
    title: 'One agent carries the work forward.',
    description: 'The same agent can take on each relevant role in sequence, using the project context and reporting its own review honestly.',
    badge: 'One agent · multiple roles',
  },
  delegated: {
    label: 'Delegated roles',
    title: 'Separate agents can take on roles.',
    description: 'When delegation is authorized and supported, Codex can assign work to separate agents. The orchestrator inspects their results before dependent work continues.',
    badge: 'Separate agents · when available',
  },
} as const;

type Path = keyof typeof paths;

export default function DelegationDiagram() {
  const [selected, setSelected] = useState<Path>('sequential');
  const [replay, setReplay] = useState(0);
  const path = paths[selected];
  return <section className="delegation home-frame" aria-labelledby="delegation-title">
    <div className="delegation-intro"><div><p className="section-label">How the work moves</p><h2 id="delegation-title">One request.<br />The right roles.</h2></div><p><strong>The harness organizes the work.</strong> It selects a proportional route, carries project context forward, and can delegate roles when the host supports it.</p></div>
    <div className="delegation-controls"><div className="delegation-choice" role="group" aria-label="Choose a workflow example">{(Object.keys(paths) as Path[]).map(key => <button key={key} type="button" aria-pressed={selected === key} onClick={() => setSelected(key)}>{paths[key].label}</button>)}</div><button className="delegation-replay" type="button" onClick={() => setReplay(value => value + 1)}>Replay illustration <span aria-hidden="true">↻</span></button></div>
    <div className="delegation-canvas" aria-label="Illustration of the request, route, roles, and result">
      <svg key={`${selected}-${replay}`} className="delegation-connectors" viewBox="0 0 1000 340" preserveAspectRatio="none" aria-hidden="true"><path className={selected === 'sequential' ? 'active-path' : undefined} d="M190 170 H245 C310 170 300 88 360 88 H400"/><path className={selected === 'delegated' ? 'active-path' : undefined} d="M190 170 H245 C310 170 300 252 360 252 H400"/><path className={selected === 'sequential' ? 'active-path' : undefined} d="M560 88 H600 C660 88 650 170 710 170 H735"/><path className={selected === 'delegated' ? 'active-path' : undefined} d="M560 252 H600 C660 252 650 170 710 170 H735"/></svg>
      <div className="diagram-node diagram-request"><span className="diagram-overline">Your request</span><strong>Build, fix, or review</strong><small>Project instructions + context</small></div>
      <div className={`diagram-route route-sequential${selected === 'sequential' ? ' is-active' : ''}`}><span className="route-name">Sequential</span><div key={`sequential-${replay}-${selected}`} className="route-symbol" aria-hidden="true"><span>◉</span></div><small>One agent</small></div>
      <div className={`diagram-route route-delegated${selected === 'delegated' ? ' is-active' : ''}`}><span className="route-name">Delegated</span><div key={`delegated-${replay}-${selected}`} className="route-symbol" aria-hidden="true"><span>◉</span><span>◉</span><span>◉</span></div><small>Separate agents, when supported</small></div>
      <div className="diagram-node diagram-roles"><span className="diagram-overline">Relevant roles</span><strong>Plan <span>→</span> Build</strong><strong>Review <span>→</span> Verify</strong><small>Then report the outcome</small></div>
    </div>
    <div className="delegation-explanation" aria-live="polite"><span>{path.badge}</span><div><h3>{path.title}</h3><p>{path.description}</p></div><a href="/guide/#explore">Explore the workflow <span aria-hidden="true">↗</span></a></div>
    <p className="delegation-footnote">Illustrative example, not a live run. Roles depend on the task; actual delegation requires authorization, available tools, and host support. Release is a separate decision.</p>
  </section>;
}
