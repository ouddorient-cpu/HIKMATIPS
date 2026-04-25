'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

interface HeroModernProps {
  onScrollToApp: () => void;
}

export function HeroModern({ onScrollToApp }: HeroModernProps) {
  const [currentQuoteIdx, setCurrentQuoteIdx] = useState(0);

  const quotes = [
    { text: "Celui qui emprunte un chemin par lequel il recherche une science, Allah lui facilite un chemin vers le Paradis.", author: "Le Prophète (ﷺ)" },
    { text: "Le rappel profite aux croyants.", author: "Le Coran" },
    { text: "La sagesse est la parole perdue du croyant.", author: "Hadith" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIdx((prev) => (prev + 1) % quotes.length);
    }, 6500);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-background pt-20">
      {/* Gradient orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-primary/30 to-accent/20 blur-3xl"
        initial={{ x: -400, y: -400, opacity: 0 }}
        animate={{ x: -200, y: -200, opacity: 0.5 }}
        transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
        style={{ top: '-10%', left: '-10%' }}
      />
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-accent/30 to-primary/20 blur-3xl"
        initial={{ x: 400, y: 400, opacity: 0 }}
        animate={{ x: 200, y: 200, opacity: 0.5 }}
        transition={{ duration: 25, repeat: Infinity, repeatType: 'reverse' }}
        style={{ bottom: '-10%', right: '-10%' }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side */}
          <motion.div className="flex flex-col items-start" variants={itemVariants}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-xs font-semibold tracking-wider text-primary uppercase">HikmaClips</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter leading-tight mb-6 text-foreground">
              Sagesse
              <br />
              <span className="bg-gradient-to-r from-foreground via-accent to-primary bg-clip-text text-transparent italic font-light">
                Islamique
              </span>
              {' '}Partagée.
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-xl mb-10">
              HikmaClips simplifie la diffusion de la Da'wah islamique de manière simple et rapide. Accédez à l'intégralité des 6 grands Sahihs et Sunans en français.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
              <button
                onClick={onScrollToApp}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground font-bold text-lg rounded-2xl hover:-translate-y-1 hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 group"
              >
                Commencer
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Social proof */}
              <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                <div className="flex -space-x-2">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Utilisateur" className="w-8 h-8 rounded-full border-2 border-background" />
                  <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80" alt="Utilisateur" className="w-8 h-8 rounded-full border-2 border-background" />
                  <div className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] text-foreground">+2k</div>
                </div>
                <span>Utilisateurs actifs</span>
              </div>
            </div>
          </motion.div>

          {/* Right side - Dynamic card */}
          <motion.div className="relative h-[500px] hidden lg:flex items-center justify-center" variants={itemVariants}>
            <motion.div
              className="absolute top-[10%] right-[5%] w-64 h-80 bg-card/50 rounded-3xl border border-primary/10 backdrop-blur-sm transform rotate-12 opacity-40 animate-pulse"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            />

            <motion.div
              className="relative w-[90%] max-w-sm bg-card/80 rounded-3xl border border-primary/20 backdrop-blur-sm p-8 shadow-2xl"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
              whileHover={{ y: -20 }}
            >
              <div className="flex justify-between items-start mb-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xs font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border border-border">Instantané</span>
              </div>

              <motion.div
                key={currentQuoteIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="relative min-h-[120px]"
              >
                <h3 className="text-lg font-semibold leading-tight mb-4 text-foreground font-serif italic">
                  "{quotes[currentQuoteIdx].text}"
                </h3>
                <p className="text-sm font-bold text-accent uppercase tracking-wider">
                  — {quotes[currentQuoteIdx].author}
                </p>
              </motion.div>

              <div className="mt-8 pt-6 border-t border-border flex gap-2">
                <button className="flex-1 bg-muted hover:bg-muted/80 transition-colors py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 border border-border">
                  ↕ Personnaliser
                </button>
                <button className="w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center transform hover:scale-110 transition-transform shadow-lg">
                  ✈
                </button>
              </div>
            </motion.div>

            {/* Bottom card */}
            <motion.div
              className="absolute bottom-[5%] left-[0%] w-48 bg-card/50 rounded-2xl border border-accent/20 backdrop-blur-sm p-4 flex items-center gap-4 shadow-lg"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, delay: 0.3 }}
            >
              <div className="relative w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="text-lg">♥</span>
                <div className="absolute inset-0 rounded-full border border-accent/50 animate-ping opacity-20"></div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Partages</p>
                <p className="font-bold text-lg text-foreground">1.2k/jour</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Feature cards */}
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20" variants={itemVariants}>
          {[
            { icon: '📖', label: 'Versets Coraniques', desc: 'Accédez à des versets authentiques avec traduction française' },
            { icon: '✨', label: 'Hadiths Vérifiés', desc: 'Hadiths issus des recueils authentiques (Bukhari, Muslim...)' },
            { icon: '🎨', label: 'Export HD', desc: 'Images haute qualité optimisées pour les réseaux sociaux' },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              className="p-6 rounded-2xl bg-card/50 border border-primary/10 backdrop-blur-sm hover:border-accent/30 transition-all"
              whileHover={{ y: -5, scale: 1.05 }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="font-bold text-foreground mb-2">{feature.label}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
