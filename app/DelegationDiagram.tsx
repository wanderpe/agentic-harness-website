'use client';

import { useEffect, useRef, useState } from 'react';
import '../public/assets/delegation-diagram.css';

type Route = 'sequential' | 'delegated';
const steps = [
  { title: '1. You describe the problem', text: 'For this example, you ask Codex to fix a broken login button. The harness guides it to read the relevant project instructions and find the existing login code first.', packet: 'The request, relevant files and existing project rules.', note: 'This is an example, not a recording of a real task.', role: -1 },
  { title: '2. Codex chooses an approach', text: 'For a bug, it can follow a focused fix: investigate the cause, change the relevant code, then check the result. The harness provides guidance for each part.', packet: 'The problem, the proposed approach and what to check.', note: 'You can also ask for a specific workflow.', role: -1 },
  { title: '3. Plan the change', text: 'For a larger change, the architect role can decide where the work belongs and which existing code to reuse. A small login fix may not need this role.', packet: 'A plan and the files or patterns to reuse.', note: 'A role is a responsibility; it does not automatically start another agent.', role: 0 },
  { title: '4. Make the fix', text: 'The implementer role uses what was found to make a focused change to the login code. It follows the project’s existing patterns.', packet: 'The changed code and the context needed to review it.', note: 'Codex needs access to the project and its tools to make changes.', role: 1 },
  { title: '5. Review the change', text: 'The reviewer role looks at the actual code change for mistakes and unintended effects. Any findings go back for correction.', packet: 'The current change and any review findings.', note: 'Review is independent only if a separate authorized reviewer performs it.', role: 2 },
  { title: '6. Check the fix', text: 'The quality assurance (QA) role checks whether the login behavior meets the request, using the tests and tools available in the project.', packet: 'Which checks passed, failed or could not run.', note: 'An unrun check is reported as unrun, not as a pass.', role: 3 },
  { title: '7. Save progress when possible', text: 'A checkpoint is a saved record of the task: what has been done, what was checked and what comes next. A later session can use it to pick up the work.', packet: 'The current task state, checks and next action.', note: 'Saving requires available storage. Changes may make earlier checks outdated.', role: -1 },
  { title: '8. Decide whether to release', text: 'If you ask to release the change, the release manager role checks the current review, test results and your authorization for the specific release.', packet: 'Review findings, test results and the release decision.', note: 'Release is separate from implementing the fix.', role: 4 },
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
  const sectionRef = useRef<HTMLDivElement>(null);
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
    const timer = window.setTimeout(() => { if (active === steps.length - 1) setPlaying(false); else setActive(active + 1); }, 10000);
    return () => window.clearTimeout(timer);
  }, [active, playing, inView]);
  function togglePlayback() { if (playing) { setPlaying(false); return; } if (active === steps.length - 1) setActive(0); started.current = true; setPlaying(true); }
  function selectStep(index: number) { started.current = true; setPlaying(false); setActive(index); }
  const step = steps[active];
  return <section className="delegation home-frame" aria-labelledby="delegation-title">
    <div className="delegation-intro"><div><p className="section-label">How the work moves</p><h2 id="delegation-title">A login bug,<br />step by step.</h2></div><p><strong>Here is an example.</strong> You ask Codex to fix a login button. The diagram shows how the harness can guide the task from your request to a checked result.</p></div>
    <div className="route-toolbar"><div className="route-switch" role="group" aria-label="Choose an example route"><button type="button" aria-pressed={route === 'sequential'} onClick={() => setRoute('sequential')}>One assistant</button><button type="button" aria-pressed={route === 'delegated'} onClick={() => setRoute('delegated')}>Separate agents</button></div><button className="route-play" type="button" onClick={togglePlayback}>{playing ? 'Pause example' : active === steps.length - 1 ? 'Replay example' : 'Play example'} <span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span></button></div>
    <div className="branch-diagram" aria-label="Illustrative request, route and evidence flow">
      <svg key={`${route}-${active}`} className="branch-lines" viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true"><path className={route === 'sequential' ? 'selected-branch' : ''} d="M190 142 H245 C320 142 300 65 370 65 H420"/><path className={route === 'delegated' ? 'selected-branch' : ''} d="M190 158 H245 C320 158 300 235 370 235 H420"/><path className={route === 'sequential' ? 'selected-branch' : ''} d="M560 65 H610 C680 65 660 142 730 142 H770"/><path className={route === 'delegated' ? 'selected-branch' : ''} d="M560 235 H610 C680 235 660 158 730 158 H770"/></svg>
      <div className={`branch-request${active === 0 ? ' is-lit' : ''}`}><span>YOUR REQUEST</span><strong>“Fix the login button”</strong><small>Example request</small></div>
      <div className={`branch-mode branch-sequential${route === 'sequential' ? ' is-selected' : ''}`}><span>ONE ASSISTANT</span><div className="branch-hub"><i aria-hidden="true">◉</i></div><small>One assistant</small></div>
      <div className={`branch-mode branch-delegated${route === 'delegated' ? ' is-selected' : ''}`}><span>SEPARATE AGENTS</span><div className="branch-hub"><i aria-hidden="true">◉ ◉ ◉</i></div><small>Separate agents, when supported</small></div>
      <button type="button" className={`branch-output${active >= 6 ? ' is-lit' : ''}`} aria-pressed={active === 6} onClick={() => selectStep(6)}><span>SAVED PROGRESS</span><strong>What comes next?</strong><small>Select to learn about checkpoints</small></button>
    </div>
    <div className="branch-caption">{route === 'sequential' ? 'One assistant handles the relevant responsibilities, one after another.' : 'Codex may hand some responsibilities to separate agents, if you authorize it and the host supports it.'}</div>
    <div ref={sectionRef} className="branch-detail" aria-live={playing ? 'off' : 'polite'}><div><span>ILLUSTRATIVE STEP {String(active + 1).padStart(2, '0')} / 08</span><h3>{step.title}</h3><p>{step.text}</p></div><div className="handoff-packet"><span>WHAT GETS PASSED ON</span><p>{step.packet}</p><span>GOOD TO KNOW</span><p>{step.note}</p></div></div>
    <div className="branch-step-controls"><span>Explore the example at your own pace</span><div><button type="button" disabled={active === 0} onClick={() => selectStep(active - 1)}>← Previous</button><button type="button" disabled={active === steps.length - 1} onClick={() => selectStep(active + 1)}>Next →</button></div></div>
    <div className="role-heading"><span>WHO DOES WHAT?</span><span>Select a card to see its part in the example</span></div>
    <div className="role-cards" role="group" aria-label="Delivery role examples">{roles.map((role, index) => <button key={role.name} type="button" className={`delivery-card${step.role === index ? ' is-active' : ''}`} aria-pressed={step.role === index} onClick={() => selectStep(role.step)}><span className="delivery-icon" aria-hidden="true">{role.symbol}</span><strong>{role.name}</strong><small>{role.short}</small>{step.role === index && <span className="delivery-description">{step.text}</span>}{index === 4 && <span className="delivery-optional">When release is requested</span>}</button>)}</div>
    <div className="branch-progress" aria-hidden="true"><span key={`${active}-${playing}-${inView}`} data-running={playing && inView}/></div>
    <p className="delegation-footnote">This is an illustrative example, not a live run. The task may use fewer roles. Separate agents require authorization and host support; release is a separate decision.</p>
  </section>;
}
