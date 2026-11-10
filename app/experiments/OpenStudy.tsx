'use client';
import { useEffect } from 'react';
export default function OpenStudy() {
  useEffect(() => {
    const openTarget = () => {
      const id = window.location.hash.slice(1);
      if (!/^case-\d+$/.test(id)) return;
      const target = document.getElementById(id);
      if (target instanceof HTMLDetailsElement) target.open = true;
    };
    openTarget();
    window.addEventListener('hashchange', openTarget);
    return () => window.removeEventListener('hashchange', openTarget);
  }, []);
  return null;
}
