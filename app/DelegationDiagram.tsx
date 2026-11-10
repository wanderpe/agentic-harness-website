'use client';

import { useEffect, useRef, useState } from 'react';
import '../public/assets/delegation-diagram.css';

type Route = 'sequential' | 'delegated';
const steps = [
  { title: 'Start with your request', text: 'Codex uses the harness guidance to gather the objective, project instructions, relevant code and available checks.', packet: 'Objective · scope · project context', role: -1 },
  { title: 'Select a route', text: 'The harness selects a proportional route. Relevant roles can be handled by one assistant or delegated only when authorized and supported.', packet: 'Route · responsibilities · constraints', role: -1 },
  { title: 'Architect', text: 'When needed, the architect identifies a practical design, reuse points and boundaries before substantial implementation.', packet: 'Design · scope · acceptance checks', role: 0 },
  { title: 'Implementer', text: 'The implementer receives the relevant context and plan, inspects the handoff, and makes the authorized change using existing patterns.', packet: 'Inputs · scope · current change', role: 1 },
  { title: 'Reviewer', text: 'The reviewer examines the actual change for concrete defects and risks. Review is independent only when a separate authorized reviewer performs it.', packet: 'Current diff · findings · review record', role: 2 },
  { title: 'QA validator', text: 'QA checks acceptance criteria using appropriate available checks, reporting what passed, failed or could not be run.', packet: 'Check results · evidence · limitations', role: 3 },
  { title: 'Checkpoint and evidence', text: 'When storage is available, a checkpoint can carry the current step, artifacts, evidence and next action. Changed content can invalidate earlier review and QA.', packet: 'Current state · content identity · next action', role: -1 },
  { title: 'Release manager', text: 'When release is requested, the release manager checks current evidence and the actual authorization for the scope, revision, operation and destination.', packet: 'Review · QA · actual authorization', role: 4 },
] as const;
const roles = [
  { name: 'Architect', symbol: '◇', short: 'Design and scope', step: 2 },
  { name: 'Implementer', symbol: '⌘', short: 'Build the change', step: 3 },
  { name: 'Reviewer', symbol: '◉', short: 'Inspect the diff', step: 4 },
  { name: 'QA validator', symbol: '✓', short: 'Verify behavior', step: 5 },
  { name: 'Release manager', symbol: '↗', short: 'Check readiness', step: 7 },
] as const;

export default function DelegationDiagram() {
  const [route, setRoute] = useState<Route>('sequential');
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
      if (entry.isIntersecting && !started.current) { started.current = true; if (!motion.matches) setPlaying(true); }
    }, { threshold: 0.15 });
    const onMotionChange = (event: MediaQueryListEvent) => { if (event.matches) setPlaying(false); };
    observer.observe(element);
    motion.addEventListener('change', onMotionChange);
    return () => { observer.disconnect(); motion.removeEventListener('change', onMotionChange); };
  }, []);
  useEffect(() => {
    if (!playing || !inView) return;
    const timer = window.setTimeout(() => { if (active === steps.length - 1) setPlaying(false); else setActive(active + 1); }, 6500);
    return () => window.clearTimeout(timer);
  }, [active, playing, inView]);
  function togglePlayback() { if (playing) { setPlaying(false); return; } if (active === steps.length - 1) setActive(0); started.current = true; setPlaying(true); }
  function selectStep(index: number) { started.current = true; setPlaying(false); setActive(index); }
  const step = steps[active];
  return <section ref={sectionRef} className="delegation home-frame" aria-labelledby="delegation-title">
    <div className="delegation-intro"><div><p className="section-label">How the work moves</p><h2 id="delegation-title">One request.<br />A clearer path.</h2></div><p><strong>Follow the context.</strong> The harness guides the work through relevant roles, handoffs and evidence checks. Choose a route to see the difference.</p></div>
    <div className="route-toolbar"><div className="route-switch" role="group" aria-label="Choose an example route"><button type="button" aria-pressed={route === 'sequential'} onClick={() => setRoute('sequential')}>Sequential</button><button type="button" aria-pressed={route === 'delegated'} onClick={() => setRoute('delegated')}>Delegated</button></div><button className="route-play" type="button" onClick={togglePlayback}>{playing ? 'Pause' : active === steps.length - 1 ? 'Replay' : 'Play'} <span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span></button></div>
    <div className="branch-diagram" aria-label="Illustrative request, route and evidence flow">
      <svg key={`${route}-${active}`} className="branch-lines" viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true"><path className={route === 'sequential' ? 'selected-branch' : ''} d="M190 142 H245 C320 142 300 65 370 65 H420"/><path className={route === 'delegated' ? 'selected-branch' : ''} d="M190 158 H245 C320 158 300 235 370 235 H420"/><path className={route === 'sequential' ? 'selected-branch' : ''} d="M560 65 H610 C680 65 660 142 730 142 H770"/><path className={route === 'delegated' ? 'selected-branch' : ''} d="M560 235 H610 C680 235 660 158 730 158 H770"/></svg>
      <div className={`branch-request${active === 0 ? ' is-lit' : ''}`}><span>YOUR REQUEST</span><strong>Build, fix, or review</strong><small>Project context + scope</small></div>
      <div className={`branch-mode branch-sequential${route === 'sequential' ? ' is-selected' : ''}`}><span>SEQUENTIAL</span><div className="branch-hub"><i aria-hidden="true">◉</i></div><small>One assistant</small></div>
      <div className={`branch-mode branch-delegated${route === 'delegated' ? ' is-selected' : ''}`}><span>DELEGATED</span><div className="branch-hub"><i aria-hidden="true">◉ ◉ ◉</i></div><small>Separate agents, when supported</small></div>
      <button type="button" className={`branch-output${active >= 6 ? ' is-lit' : ''}`} aria-pressed={active === 6} onClick={() => selectStep(6)}><span>WORK + EVIDENCE</span><strong>Handoff and checks</strong><small>Explore checkpoint · review · QA</small></button>
    </div>
    <div className="branch-caption">{route === 'sequential' ? 'The same assistant can carry out the relevant roles in sequence.' : 'Separate agents can receive roles only when delegation is authorized and the host supports it.'}</div>
    <div className="role-heading"><span>THE DELIVERY ROLES</span><span>Choose a card to explore</span></div>
    <div className="role-cards" role="group" aria-label="Delivery role examples">{roles.map((role, index) => <button key={role.name} type="button" className={`delivery-card${step.role === index ? ' is-active' : ''}`} aria-pressed={step.role === index} onClick={() => selectStep(role.step)}><span className="delivery-icon" aria-hidden="true">{role.symbol}</span><strong>{role.name}</strong><small>{role.short}</small>{index === 4 && <span className="delivery-optional">When release is requested</span>}</button>)}</div>
    <div className="branch-detail" aria-live={playing ? 'off' : 'polite'}><div><span>ILLUSTRATIVE STEP {String(active + 1).padStart(2, '0')} / 08</span><h3>{step.title}</h3><p>{step.text}</p></div><div className="handoff-packet"><span>WHAT MOVES FORWARD</span><p>{step.packet}</p><span>STATE AND GATES</span><p>Missing or stale evidence needs attention. Fallback checks are advisory and cannot prove tests ran or authenticate approvals.</p></div></div>
    <div className="branch-progress" aria-hidden="true"><span key={`${active}-${playing}-${inView}`} data-running={playing && inView}/></div>
    <p className="delegation-footnote">Illustration, not a live run. Roles depend on the task; a role packet does not launch an agent. Delegation requires authorization and host support. Release is a separate decision.</p>
  </section>;
}
