'use client';

import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    </div>
  );
}

const LandingPage = dynamic(() => import('@/components/LandingPage'), {
  loading: () => <LoadingScreen />,
  ssr: false,
});

export default function Home() {
  return <LandingPage />;
}
