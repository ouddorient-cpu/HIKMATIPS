# 📱 Mobile Design Best Practices & Guidelines

## 🎯 Principes Fondamentaux

### 1. **Mobile-First Approach**
- Concevoir pour mobile d'abord
- Adapter pour tablet/desktop
- Priorité au touch-friendly

### 2. **Apple Design Philosophy**
- ✨ Simplicity
- 🎯 Clarity
- ⚡ Efficiency
- 📱 Deference to content

### 3. **Android Material Design**
- Consistent
- Bold
- Intentional
- Responsive

---

## 🎨 Visual Hierarchy

### Font Sizes (Mobile)
```
Display: 32px (rare, headlines seulement)
Headline: 24px (section titles)
Title: 20px (card titles)
Body: 16px (paragraphes, content principal)
Label: 14px (labels, small text)
Caption: 13px (timestamps, metadata)
Overline: 12px (supersmart labels)
```

### Line Heights
```
Display/Headline: 1.2 (tight)
Title/Body: 1.4-1.6 (readable)
Labels: 1.2 (compact)
```

### Letter Spacing
```
Display/Headline: -0.3px to -0.5px (tighter)
Body: normal
Labels: +0.2px (slightly looser)
```

---

## 🔘 Touch Targets

### Minimum Size
```
44px × 44px (Apple guideline)
48px × 48px (Material Design guideline)
```

### Spacing Between Targets
```
Minimum: 8px
Preferred: 12-16px
```

### Button Implementation
```tsx
<Button 
  size="lg"  // 11px padding = 44px min height
  className="min-h-[44px] min-w-[44px]"
>
  Action
</Button>

// Icon button
<Button 
  size="icon"  // 40px, can be 44px with padding
  className="h-[44px] w-[44px]"
>
  <Icon size={24} />
</Button>
```

---

## 📐 Layout Guidelines

### Safe Areas (Notch/Home Indicator)
```tsx
// Meta viewport tag
<meta 
  name="viewport" 
  content="width=device-width, initial-scale=1, viewport-fit=cover" 
/>

// CSS safe-area-inset
padding-top: max(1rem, env(safe-area-inset-top));
padding-bottom: max(1rem, env(safe-area-inset-bottom));
```

### Container Width
```css
/* Mobile optimal width: full screen */
max-width: 100%;
padding: 0 1rem;

/* Tablet */
@media (min-width: 768px) {
  max-width: 90%;
  margin: 0 auto;
}

/* Desktop */
@media (min-width: 1024px) {
  max-width: 80%;
  margin: 0 auto;
}
```

### Spacing Rhythm
```
8px baseline unit
4px, 8px, 12px, 16px, 24px, 32px, 48px

Margins: 16px, 24px
Padding: 12px, 16px, 24px
Gaps: 8px, 12px, 16px
```

---

## 🎬 Animations & Transitions

### Duration Guidelines
```
Fast: 150ms (micro-interactions)
Standard: 300ms (transitions)
Slow: 500ms (complex sequences)
```

### Easing Functions
```tsx
// Spring-like (Apple style)
cubic-bezier(0.34, 1.56, 0.64, 1)

// Standard
cubic-bezier(0.4, 0, 0.2, 1)

// Ease In
cubic-bezier(0.4, 0, 1, 1)

// Ease Out
cubic-bezier(0, 0, 0.2, 1)
```

### Reduce Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🎨 Color & Contrast

### Minimum Contrast Ratios
```
Normal text: 4.5:1 (WCAG AA)
Large text (18px+): 3:1 (WCAG AA)
UI components: 3:1 (WCAG AA)

Recommended: 7:1 (WCAG AAA)
```

### Color Accessibility
```tsx
// DON'T: Rely on color alone
<div className="text-red-500">Error</div>

// DO: Add icon or other indicator
<div className="text-red-500 flex items-center gap-2">
  <AlertCircle size={20} />
  Error
</div>
```

### Dark Mode Optimization
```css
/* Use consistent dark theme */
background: hsl(0 0% 5%) /* Very dark, not pure black */
card: hsl(0 0% 10%)
text: hsl(0 0% 98%) /* Off-white, not pure white */

/* Reduces eye strain */
border: hsl(0 0% 18%) /* Subtle borders */
```

---

## ⚡ Performance

### Core Web Vitals
```
LCP: <2.5s (Largest Contentful Paint)
FID: <100ms (First Input Delay)
CLS: <0.1 (Cumulative Layout Shift)
```

### Mobile Optimization
```tsx
// 1. Lazy Load Images
<Image
  src="..."
  loading="lazy"
  quality={80}
/>

// 2. Code Splitting
const Component = dynamic(() => import('./Component'), {
  loading: () => <Skeleton />
})

// 3. Optimize Fonts
/* Preload system fonts only */
@font-face {
  font-family: 'System';
  src: -apple-system, BlinkMacSystemFont;
}

// 4. Minimize CSS
/* Use CSS variables instead of duplicating values */
color: hsl(var(--primary) / 1)
```

---

## 🔄 Interaction Patterns

### Bottom Navigation
```
Fixed position
56px height (Material 3 standard)
Max 5 items (ideally 3-5)
Icons + Labels (bottom 1-2 only)
Active indicator: color change + subtle animation
Badge support for notifications
```

### Pull-to-Refresh
```
Visual feedback at 100px
Haptic trigger
Momentum scroll support
```

### Gesture Support
```
Tap: 150ms, min 44×44px
Long-press: 500ms
Swipe: velocity > 250px/s
Drag: continuous feedback
```

---

## 📊 Mobile Metrics

### Safe Area Padding (iPhone)
```
iPhone 14 Pro:
- Safe area top: 59px
- Safe area bottom: 34px

iPhone SE:
- Safe area top: 20px
- Safe area bottom: 0px
```

### Status Bar
```
Height: 44px
Always reserve space for status bar
Use translucent backgrounds
```

### Keyboard
```
Height: 216-271px (iOS)
- Don't hide important content
- Scroll to focused field
- Adjust safe-area-inset-bottom
```

---

## 🧪 Testing Checklist

### Visual Testing
- [ ] All colors visible on screen
- [ ] Contrast meets WCAG AA
- [ ] Typography hierarchy clear
- [ ] Spacing consistent
- [ ] No horizontal scroll

### Interaction Testing
- [ ] Buttons/links at least 44×44px
- [ ] Tap feedback immediate
- [ ] No double-tap zoom needed
- [ ] Hover states work on touch
- [ ] Loading states visible

### Performance Testing
- [ ] LCP < 2.5s
- [ ] No layout shifts
- [ ] Smooth 60fps animations
- [ ] Battery efficient
- [ ] Memory usage < 50MB

### Accessibility Testing
- [ ] Screen reader compatible
- [ ] Keyboard navigation
- [ ] Color not only indicator
- [ ] Sufficient contrast
- [ ] Focus visible

### Responsive Testing
- [ ] iPhone SE (smallest)
- [ ] iPhone 14 (standard)
- [ ] iPhone 14 Pro (notch)
- [ ] iPad mini
- [ ] Android devices

---

## 🚀 Implementation Checklist

- [ ] System fonts configured
- [ ] Safe area padding applied
- [ ] Bottom navigation implemented
- [ ] Touch targets 44×44px
- [ ] Color scheme updated
- [ ] Typography hierarchy set
- [ ] Animations optimized
- [ ] Dark mode tested
- [ ] Mobile-first responsive
- [ ] Performance optimized
- [ ] Accessibility checked
- [ ] Tested on real devices

---

## 📚 Resources

### Apple HIG (Human Interface Guidelines)
- https://developer.apple.com/design/human-interface-guidelines

### Material Design 3
- https://m3.material.io/

### WCAG 2.1 Guidelines
- https://www.w3.org/WAI/WCAG21/quickref/

### Mobile Performance
- https://web.dev/

### Tailwind CSS Mobile
- https://tailwindcss.com/docs/responsive-design

---

## 💡 Pro Tips

### 1. Test on Real Device
```bash
# Use ngrok to expose localhost
ngrok http 3000
# Open ngrok URL on phone
```

### 2. Use Browser DevTools
```
Chrome: Device Toolbar (Ctrl+Shift+M)
Firefox: Responsive Design Mode (Ctrl+Shift+M)
Edge: Device Emulation (F12 → Device Toolbar)
```

### 3. Debug Remote
```
iOS: Use Safari Web Inspector
Android: Use Chrome Remote Debugging
```

### 4. Monitor Performance
```bash
# Lighthouse
lighthouse https://your-app.com

# WebPageTest
webpagetest.org
```

### 5. Haptic Feedback Ready
```tsx
/* Structure for future haptic implementation */
<Button 
  onClick={() => {
    triggerHaptic();
    // action
  }}
>
  Action with Haptic
</Button>
```

