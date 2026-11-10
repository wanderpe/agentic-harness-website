'use client';

import { useEffect, useRef, useState } from 'react';
import '../public/assets/delegation-diagram.css';

type Route = 'sequential' | 'delegated';
const stages = [
  { label: 'Request', title: 'Understand the task', short: 'Objective + project context', detail: 'Codex uses the harness guidance to establish the objective, scope and acceptance criteria, then discovers relevant project instructions, code and checks.', packet: 'Objective · scope · relevant files · checks', boundary: 'The project’s applicable workflow takes precedence.' },
  { label: 'Route', title: 'Choose the roles', short: 'A route that fits the work', detail: 'The harness selects a proportional route and supplies role-specific guidance. Roles can be performed sequentially by one assistant or delegated when authorized and supported.', packet: 'Route · responsibilities · project context', boundary: 'A role packet describes work; it does not launch an agent.' },
  { label: 'Handoff', title: 'Pass the work forward', short: 'Inputs + receiver acknowledgement', detail: 'The receiving role gets its scope, relevant artifacts, constraints and completion checks, then inspects the inputs before acknowledging the handoff.', packet: 'Sender · receiver · artifacts · content identity', boundary: 'Missing or stale inputs must be resolved before dependent work continues.' },
  { label: 'Checkpoint', title: 'Carry state forward', short: 'Current step + evidence', detail: 'When storage is available, task state can record the current node, artifacts, evidence, handoffs and next action. A later session reconciles the record with the current project.', packet: 'Current state · evidence · next action', boundary: 'Without durable storage, state is reported in the conversation.' },
  { label: 'Gates', title: 'Inspect the evidence', short: 'Review → QA → release decision', detail: 'The optional read-only guard checks supplied records and current content identity. Review, QA and release checks have different requirements; missing or failed checks are not treated as passing.', packet: 'Review · QA · acceptance · actual authorization', boundary: 'Fallback checks are advisory; they cannot prove tests ran or authenticate approvals.' },
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
    }, { threshold: 0.2 });
    const onMotionChange = (event: MediaQueryListEvent) => { if (event.matches) setPlaying(false); };
    observer.observe(element);
    motion.addEventListener('change', onMotionChange);
    return () => { observer.disconnect(); motion.removeEventListener('change', onMotionChange); };
  }, []);
  useEffect(() => {
    if (!playing || !inView) return;
    const timer = window.setTimeout(() => { if (active === stages.length - 1) setPlaying(false); else setActive(active + 1); }, 7000);
    return () => window.clearTimeout(timer);
  }, [active, playing, inView]);
  function togglePlayback() { if (playing) { setPlaying(false); return; } if (active === stages.length - 1) setActive(0); started.current = true; setPlaying(true); }
  function selectStage(index: number) { started.current = true; setPlaying(false); setActive(index); }
  const stage = stages[active];
  return <section ref={sectionRef} className="delegation home-frame" aria-labelledby="delegation-title">
    <div className="delegation-intro"><div><p className="section-label">How the work moves</p><h2 id="delegation-title">From request<br />to evidence.</h2></div><p><strong>Follow the context through the harness.</strong> This illustration shows how an agent can route work, hand it off, carry state, and inspect evidence.</p></div>
    <div className="flow-visual">
      <div className="flow-toolbar"><div className="flow-route" role="group" aria-label="Choose a workflow example"><button type="button" aria-pressed={route === 'sequential'} onClick={() => setRoute('sequential')}>Sequential</button><button type="button" aria-pressed={route === 'delegated'} onClick={() => setRoute('delegated')}>Delegated</button></div><button className="flow-play" type="button" onClick={togglePlayback}>{playing ? 'Pause' : active === stages.length - 1 ? 'Replay' : 'Play'} <span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span></button></div>
      <div className="flow-route-note">{route === 'sequential' ? 'One assistant can perform relevant roles in sequence.' : 'Separate agents may receive work only when authorized and supported.'}</div>
      <div className="flow-map" role="group" aria-label="Illustrative workflow stages">
        {stages.map((item, index) => <div className="flow-step" key={item.label}>
          {index > 0 && <div className={`flow-connector${active >= index ? ' is-reached' : ''}`} aria-hidden="true"><span key={`beam-${active}-${playing}-${inView}`} data-running={playing && inView && active === index - 1}/></div>}
          <button type="button" className={`flow-node${active === index ? ' is-current' : ''}${active > index ? ' is-past' : ''}`} aria-pressed={active === index} onClick={() => selectStage(index)}><span className="flow-node-top"><span>{String(index + 1).padStart(2, '0')}</span><i aria-hidden="true"/></span><strong>{item.label}</strong><small>{item.short}</small>{index === 1 && <span className="flow-role">{route === 'delegated' ? 'Separate agents*' : 'One assistant'}</span>}</button>
        </div>)}
      </div>
      <div className="flow-current-detail" aria-live={playing ? 'off' : 'polite'}><div className="flow-current-detail-heading"><span>Illustrative step {String(active + 1).padStart(2, '0')} / 05</span><h3>{stage.title}</h3><p>{stage.detail}</p></div><div className="flow-packet"><span>What moves forward</span><p>{stage.packet}</p><span>Boundary</span><p>{stage.boundary}</p></div></div>
      {active === 4 && <div className="flow-gates"><span>Review <small>context + receipts</small></span><span>QA <small>current review</small></span><span>Release <small>QA + authorization</small></span></div>}
      <div className="flow-timeline" aria-hidden="true"><span key={`progress-${active}-${playing}-${inView}`} data-running={playing && inView}/></div>
    </div>
    <p className="delegation-footnote">Illustration, not a live task. *Delegation requires authorization and host support. State and fallback checks are advisory unless a project or host enforces them; changed content can invalidate prior evidence. Release is a separate decision.</p>
  </section>;
}
