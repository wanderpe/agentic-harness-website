
import type { ReactNode } from 'react';
import SiteHeader from './SiteHeader';
export const metadata={icons:{icon:'/assets/icon.png'}};
export default function RootLayout({children}: {children: ReactNode}){return <html lang="en" data-scroll-behavior="smooth"><body><a className="ah-skip" href="#main">Skip to content</a><SiteHeader />{children}</body></html>;}
