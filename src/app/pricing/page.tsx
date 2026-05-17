import { Metadata } from 'next';
import Link from 'next/link';
import { Check, Zap, Crown, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tarifs — HikmaClips',
  description: 'Accès gratuit et premium à HikmaClips, votre app de sagesse islamique quotidienne.',
};

const freePlan = {
  name: 'Gratuit',
  price: '0€',
  period: 'pour toujours',
  description: 'Pour découvrir HikmaClips',
  features: [
    '10 générations IA par session',
    '3 favoris sauvegardés',
    'Toutes les catégories (Hadith, Coran, Citadelle...)',
    'Partage de sagesse',
    'Rappels quotidiens',
  ],
  cta: 'Commencer gratuitement',
  href: '/',
  highlighted: false,
};

const premiumPlan = {
  name: 'Premium',
  price: '2,99€',
  period: 'par mois',
  description: 'Pour une expérience spirituelle complète',
  features: [
    'Générations IA illimitées',
    'Favoris illimités',
    'Sync cloud de vos favoris',
    'Collections personnalisées',
    'Arrière-plans exclusifs',
    'Signature personnalisée',
    'Export haute qualité',
    'Support prioritaire',
  ],
  cta: 'Bientôt disponible',
  href: '#',
  highlighted: true,
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <header className="border-b border-emerald-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-black bg-gradient-to-r from-emerald-600 to-purple-600 bg-clip-text text-transparent">
            HikmaClips
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Retour
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Heart className="w-4 h-4" />
            Simple et transparent
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Choisissez votre{' '}
            <span className="bg-gradient-to-r from-emerald-500 to-purple-500 bg-clip-text text-transparent">
              chemin spirituel
            </span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Commencez gratuitement. Évoluez vers Premium quand vous êtes prêt.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {[freePlan, premiumPlan].map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-8 flex flex-col ${
                plan.highlighted
                  ? 'bg-gradient-to-br from-emerald-600 to-purple-600 text-white shadow-2xl shadow-emerald-500/30 scale-105'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-yellow-400 text-yellow-900 text-xs font-black px-4 py-1.5 rounded-full flex items-center gap-1">
                    <Crown className="w-3 h-3" /> RECOMMANDÉ
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h2 className={`text-xl font-bold mb-1 ${plan.highlighted ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                  {plan.name}
                </h2>
                <p className={`text-sm mb-4 ${plan.highlighted ? 'text-white/70' : 'text-slate-500'}`}>
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className={`text-5xl font-black ${plan.highlighted ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ${plan.highlighted ? 'text-white/70' : 'text-slate-500'}`}>
                    /{plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${plan.highlighted ? 'text-white' : 'text-emerald-500'}`} />
                    <span className={`text-sm ${plan.highlighted ? 'text-white/90' : 'text-slate-600 dark:text-slate-300'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block text-center py-3.5 px-6 rounded-2xl font-bold text-sm transition-all ${
                  plan.highlighted
                    ? 'bg-white text-emerald-600 hover:bg-white/90 shadow-lg'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                }`}
              >
                <Zap className="w-4 h-4 inline mr-2" />
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-12">
          Paiement sécurisé — Annulation à tout moment — Aucun engagement
        </p>
      </main>
    </div>
  );
}
