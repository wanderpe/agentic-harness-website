
import type { ReactNode } from 'react';
import SiteHeader from './SiteHeader';
export const metadata={icons:{icon:'/assets/icon.png'}};
export default function RootLayout({children}: {children: ReactNode}){return <html lang="en"><body><SiteHeader />{children}</body></html>;}
