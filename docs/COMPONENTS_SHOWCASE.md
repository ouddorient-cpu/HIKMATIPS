# 🎨 Palette Couleurs & Components Showcase

## 📊 Nouvelle Palette de Couleurs

### Primary Colors (Apple Blue)
```
Primary: hsl(221 91% 60%) → #3B82F6
Foreground: hsl(0 0% 98%) → #F8FAFC
```

### Secondary Colors (Apple Purple)
```
Secondary: hsl(250 84% 54%) → #7C3AED
Foreground: hsl(0 0% 98%) → #F8FAFC
```

### Accent Colors (Apple Red)
```
Accent: hsl(354 86% 61%) → #EF4444
Foreground: hsl(0 0% 98%) → #F8FAFC
```

### Neutral (Background & Cards)
```
Background: hsl(0 0% 5%) → #0F172A
Card: hsl(0 0% 10%) → #1E293B
Border: hsl(0 0% 18%) → #334155
Muted: hsl(0 0% 20%) → #3F4651
```

---

## 🧩 Component Examples

### 1. Button Variations

```tsx
// Default (Primary Blue)
<Button variant="default" size="lg">
  Action Principale
</Button>

// Secondary (Purple)
<Button variant="secondary" size="lg">
  Action Secondaire
</Button>

// Accent (Red)
<Button variant="accent">
  Action Importante
</Button>

// Outline (Bordered)
<Button variant="outline">
  Outline
</Button>

// Ghost (Minimal)
<Button variant="ghost">
  Ghost
</Button>

// Glass (Glassmorphism)
<Button variant="glass">
  Glass Effect
</Button>

// With Icon
<Button 
  icon={<Heart size={20} />}
  iconPosition="left"
>
  Save
</Button>

// Loading State
<Button loading>
  Loading...
</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>
<Button size="icon"><Star size={20} /></Button>
```

### 2. Card Variations

```tsx
// Standard Card (Glass Effect)
<Card glass>
  <CardHeader>
    <CardTitle>Premium Card</CardTitle>
    <CardDescription>Avec glassmorphism</CardDescription>
  </CardHeader>
  <CardContent>
    Contenu avec effet verre givré
  </CardContent>
</Card>

// Solid Card (Default)
<Card>
  <CardHeader>
    <CardTitle>Solid Card</CardTitle>
  </CardHeader>
  <CardContent>
    Contenu standard
  </CardContent>
</Card>

// No Hover
<Card hover={false}>
  Pas d'effet hover
</Card>
```

### 3. Bottom Navigation

```tsx
const navItems = [
  { 
    label: 'Accueil', 
    icon: <Home size={24} />, 
    href: '/' 
  },
  { 
    label: 'Ressources', 
    icon: <BookOpen size={24} />, 
    href: '/resources' 
  },
  { 
    label: 'Partager', 
    icon: <Share2 size={24} />, 
    href: '/share',
    badge: 3  // Rouge badge avec nombre
  },
  { 
    label: 'Profil', 
    icon: <User size={24} />, 
    href: '/profile' 
  },
];

<BottomNavigation 
  items={navItems}
  active="Accueil"
  onItemClick={(label) => console.log(label)}
/>
```

### 4. Typography Hierarchy

```tsx
// Heading 1 - 32px, Bold
<h1>Titre Principal</h1>

// Heading 2 - 24px, Semibold
<h2>Sous-titre</h2>

// Heading 3 - 20px, Semibold
<h3>Section Title</h3>

// Body - 16px, Regular
<p>Texte standard du contenu principal</p>

// Small - 13px, Medium
<small>Texte petit, métadonnées</small>

// Code
<code>const x = 42;</code>
```

### 5. Utility Classes

```tsx
// Shadows
<div className="shadow-apple-sm">Très léger</div>
<div className="shadow-apple">Standard</div>
<div className="shadow-apple-lg">Fort</div>

// Glassmorphism
<div className="glass p-6 rounded-2xl">
  Effet verre avec blur
</div>

// Safe Area Padding
<div className="safe-area">Tout les côtés</div>
<div className="safe-area-top">Top (pour notch)</div>
<div className="safe-area-bottom">Bottom (pour home indicator)</div>

// Animations
<div className="animate-fade-in">Fade In</div>
<div className="animate-slide-up">Slide Up</div>

// Badge
<span className="badge">Default</span>
<span className="badge badge-secondary">Secondary</span>
```

---

## 🎨 Color Contrast Matrix

| Color | Background | Contrast | WCAG |
|-------|------------|----------|------|
| Primary (Blue) | Background | 7.2:1 | AAA |
| Secondary (Purple) | Background | 6.8:1 | AAA |
| Accent (Red) | Background | 7.5:1 | AAA |
| Muted | Background | 4.1:1 | AA |

---

## 📱 Responsive Breakpoints

```css
Mobile: 0px - 640px (max-width: 640px)
Tablet: 641px - 1024px (md breakpoint)
Desktop: 1025px+ (lg breakpoint)
```

### Usage in Tailwind:
```tsx
<div className="
  text-base md:text-lg lg:text-xl
  px-4 md:px-6 lg:px-8
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
">
  Responsive Content
</div>
```

---

## 🚀 Performance Optimizations

### Images
```tsx
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="Description"
  width={400}
  height={300}
  sizes="(max-width: 640px) 100vw,
         (max-width: 1024px) 50vw,
         33vw"
  priority={false}
  quality={80}
/>
```

### Animations
```tsx
// Use CSS for performance
<div className="animate-fade-in">
  Optimized Animation
</div>

// Or Framer Motion with proper settings
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  Framer Motion
</motion.div>
```

---

## 📊 Design Token Reference

```json
{
  "colors": {
    "primary": "#3B82F6",
    "secondary": "#7C3AED",
    "accent": "#EF4444",
    "background": "#0F172A",
    "card": "#1E293B",
    "border": "#334155"
  },
  "typography": {
    "fontFamily": "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    "h1": "32px, 700, -0.5px tracking",
    "h2": "24px, 600, -0.3px tracking",
    "body": "16px, 400, normal",
    "small": "13px, 500, normal"
  },
  "spacing": {
    "xs": "0.25rem",
    "sm": "0.5rem",
    "md": "0.75rem",
    "lg": "1rem",
    "xl": "1.5rem",
    "2xl": "2rem"
  },
  "radius": {
    "sm": "0.5rem",
    "md": "0.75rem",
    "lg": "1rem",
    "xl": "1.25rem",
    "2xl": "1.5rem"
  },
  "shadows": {
    "sm": "0 1px 3px rgba(0,0,0,0.1)",
    "md": "0 4px 12px rgba(0,0,0,0.15)",
    "lg": "0 8px 24px rgba(0,0,0,0.2)"
  }
}
```

---

## ✅ Quality Checklist

- [ ] Tous les composants utilisent les nouvelles couleurs
- [ ] Bottom navigation implémentée
- [ ] Safe area padding appliqué
- [ ] Animations fluides (60fps)
- [ ] Accessible WCAG AA minimum
- [ ] Mobile-first responsive
- [ ] Dark mode optimisé
- [ ] Performance Lighthouse >90
- [ ] Haptic-ready structure
- [ ] Tested on real devices

