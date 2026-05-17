# HikmaClips — Feuille de Route Produit

**Version actuelle:** 1.2.56 | **Statut:** Alpha avancée | **Plateforme:** Android + Web PWA

---

## Légende
- 🔴 CRITIQUE — bloque la mise en production
- 🟠 HAUTE — à traiter avant v2.0
- 🟡 MOYENNE — amélioration significative
- 🟢 BASSE — nice-to-have

---

## PHASE 1 — Sécurité & Stabilité (Semaine 1-2)

### 🔴 Critique
- [ ] #1 Déplacer la clé Gemini API dans `.env.local` (jamais commitée)
- [ ] #2 Sécuriser Firebase config avec variables d'environnement NEXT_PUBLIC_*
- [ ] #3 Écrire les règles Firestore (allow read/write: if auth != null minimum)
- [ ] #4 Ajouter rate limiting côté client pour les appels IA (max 30/min)
- [ ] #5 Valider les inputs utilisateur avec Zod (injections XSS)

### 🟠 Haute
- [ ] #6 Corriger TOAST_REMOVE_DELAY (1000000ms → 5000ms)
- [ ] #7 Fixer la fuite mémoire : autoScrollIntervalRef cleanup au unmount
- [ ] #8 Augmenter le timeout Gemini de 15s → 30s
- [ ] #9 Persister le Set recentlyShown dans localStorage (éviter répétitions)
- [ ] #10 Ajouter allowBackup="false" dans AndroidManifest.xml

---

## PHASE 2 — Android & Mobile (Semaine 3-4)

### 🟠 Haute
- [ ] #11 Ajouter permissions manquantes AndroidManifest : POST_NOTIFICATIONS, VIBRATE, RECEIVE_BOOT_COMPLETED
- [ ] #12 Spécifier minSdkVersion=24 / targetSdkVersion=34 dans manifest
- [ ] #13 Créer les canaux de notification Android 8+ (hikma_daily, hikma_alerts)
- [ ] #14 Ajouter deep links (scheme: hikmaclips://) dans AndroidManifest
- [ ] #15 Icône de notification personnalisée (pas l'icône par défaut)

### 🟡 Moyenne
- [ ] #16 Adaptive icon (foreground/background) pour Android 8+
- [ ] #17 App shortcuts Android (accès rapide Hadith, Coran depuis launcher)
- [ ] #18 Share intent filter pour partager vers HikmaClips depuis d'autres apps
- [ ] #19 Splash screen animé (au lieu du blanc par défaut)
- [ ] #20 Gérer les safe areas correctement (bottom nav + iPhone notch)

---

## PHASE 3 — UX/UI & Accessibilité (Semaine 5-6)

### 🟠 Haute
- [ ] #21 Ajouter attributs ARIA sur tous les éléments interactifs HomeScreen
- [ ] #22 Connecter boutons Fajr/Midi/Isha dans Settings à de vrais horaires
- [ ] #23 Lier boutons légaux dans Settings vers /privacy-policy et /terms-of-service
- [ ] #24 Dark mode pour LandingPage (reste en light même si dark activé)

### 🟡 Moyenne
- [ ] #25 Animations de transition entre pages (Framer Motion page transitions)
- [ ] #26 PWA manifest.json avec shortcuts, theme_color, display:standalone
- [ ] #27 SEO : enrichir metadata OpenGraph/Twitter dans layout.tsx
- [ ] #28 Indicateur offline (banner "Pas de connexion" quand réseau absent)
- [ ] #29 Loading skeleton au chargement initial HomeScreen
- [ ] #30 Améliorer l'AuthDialog : ajouter "Mot de passe oublié" link

---

## PHASE 4 — Contenu Islamique & IA (Semaine 7-9)

### 🟠 Haute
- [ ] #31 Validation anti-hallucination : vérifier que les hadiths générés existent dans la BD locale
- [ ] #32 Recherche avancée : par livre (Bukhari, Muslim...), par narrator, par authenticité
- [ ] #33 Collections personnalisées (listes thématiques créées par l'utilisateur)
- [ ] #34 Recherche fulltext dans la BD locale (Fuse.js ou similaire)

### 🟡 Moyenne
- [ ] #35 Audio : Text-to-Speech des hadiths/versets (Web Speech API en fallback)
- [ ] #36 Contexte historique et tafsir des versets (via IA, onglet expandable)
- [ ] #37 Statistiques utilisateur : streak quotidien, compteur hadiths lus, favorites total
- [ ] #38 Mode "étudiant" : explication détaillée du hadith visible directement dans HomeScreen

---

## PHASE 5 — Firebase & Backend (Semaine 10-12)

### 🟠 Haute
- [ ] #39 Collection Firestore `users/{uid}` : profil, préférences, streak
- [ ] #40 Collection Firestore `favorites/{uid}/items` : sync cloud des favoris
- [ ] #41 Email verification après inscription
- [ ] #42 Password reset par email (sendPasswordResetEmail)
- [ ] #43 Historique des générations sauvegardé en Firestore

### 🟡 Moyenne
- [ ] #44 Google Sign-In (plus simple que email/password)
- [ ] #45 Firebase Analytics : track catégorie la plus consultée, conversion gratuit→premium
- [ ] #46 Admin dashboard Firebase pour voir les métriques

---

## PHASE 6 — Offline & Performance (Semaine 13-14)

### 🟡 Moyenne
- [ ] #47 Service worker + cache offline (next-pwa ou workbox)
- [ ] #48 Persister la BD hadiths en IndexedDB (pas de rechargement à chaque session)
- [ ] #49 Bundle analysis et tree-shaking (webpack-bundle-analyzer)
- [ ] #50 Lazy loading des Radix UI components (imports individuels)
- [ ] #51 Image optimization : WebP, srcset, blur placeholder

---

## PHASE 7 — Monétisation (Semaine 15+)

### 🟠 Haute
- [ ] #52 Page /pricing avec plans clair (Gratuit vs Premium)
- [ ] #53 Intégration Stripe (paiements web) ou RevenueCat (in-app Android)
- [ ] #54 Définir clairement les features premium : favoris illimités, collections, IA illimitée

### 🟡 Moyenne
- [ ] #55 Programme de parrainage (referral code)
- [ ] #56 Thèmes visuels premium (fonds d'écran exclusifs, polices calligraphiques)
- [ ] #57 Mode collaboratif : partager ses collections avec d'autres utilisateurs

---

## PHASE 8 — Social & Engagement (v3.0+)

### 🟡 Moyenne
- [ ] #58 Système de likes synchronisé en cloud (plus localStorage)
- [ ] #59 Profils publics (partager ses collections favoris)
- [ ] #60 Commentaires sur les hadiths (modérés)
- [ ] #61 Classement des hadiths les plus likés cette semaine
- [ ] #62 Intégration Sentry pour le monitoring d'erreurs en production

---

## Checklist avant publication Play Store

- [ ] Clés API → `.env.local` uniquement
- [ ] Firestore rules → testées avec Firebase Emulator
- [ ] APK signé avec keystore (`android/hikmatips-upload.keystore`)
- [ ] Privacy Policy accessible depuis `/privacy-policy`
- [ ] Terms of Service accessibles depuis `/terms-of-service`
- [ ] Target SDK 34 spécifié dans AndroidManifest
- [ ] Captures d'écran pour le Play Store (au moins 4)
- [ ] Description courte et longue en Français et Anglais
- [ ] Tests sur Android 7+ (API 24+)
- [ ] Test offline mode

---

## Architecture technique actuelle

| Couche | Techno | Version |
|--------|--------|---------|
| Frontend | Next.js App Router | 15.5.9 |
| Mobile | Capacitor | 8.0.1 |
| IA | Gemini 2.0 Flash via API REST | latest |
| Auth/DB | Firebase | 11.9.1 |
| Style | Tailwind CSS + Radix UI | 3.4 / latest |
| Animations | Framer Motion | 12.29.0 |
| State | React Hooks + localStorage | — |

*Généré le 17 mai 2026*
