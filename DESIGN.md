# Design Brief: Smart Vehicle Finder

## Purpose & Tone
Premium automotive marketplace guiding users through intelligent vehicle recommendations. Tone: modern, energetic, trustworthy. Users in decision mode seeking clarity with visual engagement.

## Aesthetic & Differentiation
Dark automotive theme with vibrant orange accent sparingly deployed only on CTAs, active states, and vehicle highlights. Glass morphism (frosted effect) on cards for depth without visual clutter. Smooth animations (scale, glow, float) enhance interactivity without distraction.

## Palette (OKLCH)

| Token | L | C | H | Usage |
|-------|---|---|---|-------|
| background | 0.12 | 0 | 0 | Page background (near black) |
| foreground | 0.97 | 0 | 0 | Text, primary content |
| card | 0.18 | 0.02 | 260 | Glass cards, surfaces |
| primary | 0.65 | 0.22 | 25 | Orange accent (warm, automotive) |
| secondary | 0.52 | 0.15 | 260 | Slate blue (complementary) |
| muted | 0.35 | 0.02 | 260 | Disabled, secondary text |
| accent | 0.63 | 0.24 | 50 | Highlight, hover, active states |
| destructive | 0.55 | 0.25 | 30 | Warnings, critical actions |

## Typography
- **Display**: DM Sans (700, bold headlines)
- **Body**: Figtree (400/600, readable, warm personality)
- **Mono**: Geist Mono (code, specs, structured data)

## Elevation & Depth
Glassmorphism: semi-transparent cards (`bg-card/60`, backdrop blur) with soft shadow (`--shadow-subtle`). Elevated cards (`bg-card/70`) for interactive surfaces. Orange glow on hover (`--shadow-glow-hover`) signals interaction.

## Structural Zones

| Zone | Style | Purpose |
|------|-------|---------|
| Header/Nav | `glass-card-elevated`, subtle border glow | Elevated navigation, persistent visibility |
| Hero | Gradient background (`--gradient-hero`), large headline in DM Sans | Establishes automotive theme, CTA with pulse-glow animation |
| Content Cards | `glass-card`, rounded corners (12px), vehicle image + info overlay | Vehicle browsing, filter results, dealer listings |
| Forms/Filters | `bg-input`, focus ring (`ring-1 ring-ring`), smooth transitions | Capture user preferences, smooth interaction |
| Footer | `bg-muted/10`, minimal border top | Light, non-intrusive closure |

## Spacing & Rhythm
Desktop-first grid (24px base unit): section padding 2rem, card gap 1.5rem, inner card padding 1rem. Reduced on mobile (1rem sections, 1rem cards). Consistent breathing room maintains visual hierarchy.

## Component Patterns
- **Button**: `btn-primary` (gradient orange-to-red, hover glow), `btn-secondary` (border, bg-card/40)
- **Card**: `glass-card` (base), `card-hover` (scale + glow on interaction)
- **Input**: Dark background, focus ring, smooth transitions
- **Badge**: Small, subtle background (`bg-muted`), rounded-full

## Motion
- **Scale**: Cards scale 1.05 on hover (smooth, inviting)
- **Glow**: Orange shadow pulse on CTAs and hover states (`pulse-glow` 2s loop)
- **Float**: Hero elements float 3s loop, subtle depth
- **Transition**: All interactive elements use `--transition-smooth` (0.3s cubic-bezier)

## Constraints
- Orange used ONLY on accent, primary buttons, active states; never more than 20% of UI
- Dark theme always active (no light mode toggle needed for MVP)
- Glass morphism only on cards and elevated surfaces; no decorative full-page blur
- No gradient overlays; gradients reserved for buttons and hero only
- Animations never exceed 3s; focus on micro-interactions (0.2-0.3s) for UI feedback

## Signature Detail
**Orange Ambient Glow**: CTA buttons pulse with warm orange glow on hover, creating a "living" interface. Combined with glass morphism cards, this creates a premium, energetic automotive atmosphere distinct from generic tech aesthetics.
