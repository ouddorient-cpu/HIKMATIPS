'use client';

import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Home, Heart, Sparkles, Sliders, User, BookMarked } from 'lucide-react';

const navItems = [
  { label: 'Accueil', icon: <Home size={24} />, href: '/' },
  { label: 'Outils', icon: <Sliders size={24} />, href: '/#tools' },
  { label: 'Générer', icon: <Sparkles size={24} />, href: '/#generate' },
  { label: 'Favoris', icon: <Heart size={24} />, href: '/favoris' },
  { label: 'Collections', icon: <BookMarked size={24} />, href: '/collections' },
  { label: 'Paramètres', icon: <User size={24} />, href: '/settings' },
];

const HIDDEN_PATHS = ['/privacy-policy', '/terms-of-service', '/login'];

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activeNav = navItems.find(item => item.href === pathname)?.label || 'Accueil';

  const showNav = !HIDDEN_PATHS.includes(pathname);

  return (
    <>
      <motion.div
        className={showNav ? 'pb-24' : ''}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
      {showNav && (
        <BottomNavigation
          items={navItems}
          active={activeNav}
        />
      )}
    </>
  );
}
