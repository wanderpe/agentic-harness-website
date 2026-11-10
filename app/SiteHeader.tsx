'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '../public/assets/site-header.css';

const links = [
  { href: '/', label: 'Overview' },
  { href: '/guide/', label: 'How it works' },
  { href: '/experiments/', label: 'Experiments' },
  { href: '/tutorial/', label: 'Tutorial' },
  { href: '/support/', label: 'Support' },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const current = pathname === '/' ? '/' : `${pathname.replace(/\/$/, '')}/`;
  return <header className="ah-header"><Link className="ah-brand" href="/" aria-label="Agentic Harness home"><Image src="/assets/icon.png" width={32} height={32} alt="" /><span>Agentic Harness</span></Link><nav className="ah-nav" aria-label="Main navigation">{links.map(link => <Link key={link.href} href={link.href} aria-current={current === link.href ? 'page' : undefined}>{link.label}</Link>)}</nav></header>;
}
