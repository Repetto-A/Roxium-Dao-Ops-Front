# Roxium DAO Ops — Design Tokens Reference

Canonical values extracted from the DAOs list page and DAO Board page (the source of truth).
Use these when building new components or modifying existing ones.

---

## Color Tokens

| Token | Tailwind Class | Usage |
|-------|----------------|-------|
| Page background | `bg-[#050816]` | `<body>`, page wrappers |
| Card background | `bg-black/40` | All `<Card>` components |
| Card border | `border-white/10` | All `<Card>` components |
| Item background | `bg-black/60` | List items inside cards |
| Item border | `border-slate-800/80` | List items inside cards |
| Skeleton background | `bg-white/5` | `<Skeleton>` loaders |
| Header background | `bg-black/30 backdrop-blur` | `<SiteHeader>` |
| Footer background | `bg-black/40` | `<SiteFooter>` |

## Text Hierarchy

| Token | Tailwind Class | Usage |
|-------|----------------|-------|
| Heading (primary) | `text-slate-50` | h1, h2 headings |
| Body text | `text-slate-300` | Paragraphs, descriptions |
| Muted text | `text-slate-400` | Secondary descriptions |
| Dimmed text | `text-slate-500` | Tertiary metadata, timestamps |
| Disabled text | `text-slate-600` | Disabled/inactive elements |
| Accent text | `text-emerald-300` | Highlights, active states |
| Accent mono | `text-emerald-300/80 font-mono` | IDs, technical identifiers |
| Error text | `text-red-400` | Error messages |

## Typography Scale

| Token | Tailwind Class | Usage |
|-------|----------------|-------|
| Page heading | `text-2xl sm:text-3xl font-semibold` | Page-level h1 |
| Section heading | `text-xl sm:text-2xl font-semibold` | Section h2 |
| Card title | `text-base font-semibold` | CardTitle |
| Body | `text-sm` | Standard body text |
| Caption | `text-xs` | Metadata, labels, card descriptions |
| Badge text | `text-[10px] uppercase tracking-[0.16em]` | Status badges |
| Mono label | `text-xs font-mono uppercase tracking-[0.2em]` | Technical labels |

## Spacing Tokens

| Token | Tailwind Class | Usage |
|-------|----------------|-------|
| Label → Input gap | `space-y-1.5` | Form field label to input |
| Field → Field gap | `space-y-3` | Between form fields |
| Card content gap | `space-y-3` | CardContent children |
| List item gap | `space-y-2` | Between list items |
| Page section gap | `mb-6` | Between major page sections |
| Grid gap (2-col) | `gap-6 md:grid-cols-2` | DAOs page layout |
| Grid gap (3-col) | `gap-6 lg:grid-cols-[...]` | Board page layout |

## Shape Tokens

| Token | Tailwind Class | Usage |
|-------|----------------|-------|
| Card radius | `rounded-xl` | Card component |
| Item radius | `rounded-md` | List items, inputs, buttons |
| Badge radius | `rounded-full` | Badge component |

## Button Sizes

| Size | Tailwind Class | Usage |
|------|----------------|-------|
| Default | `h-9 px-4 py-2` | Primary actions |
| Small | `h-8 px-3` | Secondary/inline actions |
| Large | `h-10 px-6` | Prominent CTAs |
| Icon | `size-9` | Icon-only buttons |

## Badge Status Variants

| Variant | Border | Background | Text |
|---------|--------|------------|------|
| `status-draft` | `border-slate-500/60` | `bg-slate-500/15` | `text-slate-300` |
| `status-open` | `border-emerald-500/60` | `bg-emerald-500/15` | `text-emerald-300` |
| `status-closed` | `border-red-500/60` | `bg-red-500/15` | `text-red-200` |
| `status-archived` | `border-slate-600/60` | `bg-slate-600/15` | `text-slate-300` |
| `status-todo` | `border-amber-500/60` | `bg-amber-500/15` | `text-amber-300` |
| `status-progress` | `border-blue-500/60` | `bg-blue-500/15` | `text-blue-300` |
| `status-done` | `border-emerald-500/60` | `bg-emerald-500/15` | `text-emerald-300` |

## Toast Variants

| Variant | Style |
|---------|-------|
| `success` | `border-emerald-500/60 bg-emerald-500/10 text-emerald-100` |
| `error` | `border-red-500/60 bg-red-500/10 text-red-100` |
| `info` | `border-slate-600/60 bg-slate-800/80 text-slate-100` |

## Container

| Property | Value |
|----------|-------|
| Max width | `max-w-5xl` (64rem) |
| Padding | `px-4 sm:px-6 lg:px-8` |
| Centering | `mx-auto w-full` |

## Responsive Breakpoints

| Prefix | Min-width |
|--------|-----------|
| `sm:` | 640px |
| `md:` | 768px |
| `lg:` | 1024px |

## Font Families

| Token | CSS Variable | Usage |
|-------|-------------|-------|
| Sans | `--font-geist-sans` | Default body text |
| Mono | `--font-geist-mono` | Code, IDs, technical content |
