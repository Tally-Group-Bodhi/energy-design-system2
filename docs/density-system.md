# Density System

## Overview

The Tally Design System includes a viewport-adaptive density system that automatically scales spacing, typography, icons, and border radii based on the user's screen size. The goal is to make the UI feel natural on everything from a 4K desktop to a 13″ laptop — without any manual per-component overrides.

## Density Modes

| Mode | Viewport | Typical screen |
|------|----------|----------------|
| **Comfortable** | 2560px and above | 4K / Ultra-wide displays |
| **Normal** | 1536px to 2559px | Full HD desktop monitors |
| **Compact** | below 1536px (default) | Laptops (13″–15″) |

## Three Ways to Use It

### 1. CSS Custom Properties (zero JS, recommended for new CSS)

The density tokens are exposed as CSS variables that respond to media queries automatically:

```css
.my-card {
  padding: var(--tally-spacing-lg);
  font-size: var(--tally-font-size-base);
  border-radius: var(--tally-radius-md);
}
```

### 2. Tailwind Utility Classes

Density-aware utilities are registered with Tailwind v4 via `@theme`:

```html
<div class="p-density-lg text-density-base rounded-density-md">
  Adapts automatically.
</div>
```

Available prefixes:
- **Spacing**: `p-density-*`, `m-density-*`, `gap-density-*`, etc. — values: `xs`, `sm`, `md`, `lg`, `xl`, `xxl`
- **Font size**: `text-density-*` — values: `xs`, `sm`, `base`, `lg`, `xl`, `xxl`
- **Border radius**: `rounded-density-*` — values: `sm`, `md`, `lg`

### 3. React Hooks (for JS-driven logic)

```tsx
import { useDensity, densityTokens } from "@/lib/density";

function MyComponent() {
  const density = useDensity();
  const tokens = densityTokens[density];

  return (
    <div style={{ padding: tokens.spacing.md }}>
      Current mode: {density}
    </div>
  );
}
```

## API Reference

### `useDensity(): DensityMode`

Auto-detects the current density mode from viewport width. SSR-safe (defaults to `"normal"`). Re-renders when the mode changes on resize.

### `useDensityPreference()`

Like `useDensity` but allows a manual override stored in `localStorage`.

```tsx
const { density, setDensity, resetToAuto, isAutoDetect, autoDetected } = useDensityPreference();
```

| Property | Type | Description |
|----------|------|-------------|
| `density` | `DensityMode` | Effective mode (override or auto) |
| `autoDetected` | `DensityMode` | Auto-detected mode (ignoring override) |
| `setDensity` | `(mode) => void` | Pin a specific mode |
| `resetToAuto` | `() => void` | Clear override |
| `isAutoDetect` | `boolean` | `true` when no override is active |

### `useViewportWidth(): number`

Returns the current viewport width in pixels, updating on resize.

### `getDensityClasses(density, classes)`

Pick a class string from a per-density map:

```tsx
getDensityClasses(density, {
  comfortable: "p-6 text-base",
  normal:      "p-4 text-sm",
  compact:     "p-3 text-xs",
});
```

### `getDensityCSS(density): Record<string, string>`

Returns a flat object of CSS custom properties for a given mode. Useful for scoped overrides or testing:

```tsx
<div style={getDensityCSS("compact")}>
  Everything inside uses compact tokens.
</div>
```

### `densityFromWidth(width): DensityMode`

Pure function — no React dependency. Converts a pixel width to a density mode.

### `densityTokens`

The full token object. Keyed by mode, then category, then size:

```tsx
densityTokens.compact.spacing.md    // "8px"
densityTokens.normal.fontSize.base  // "14px"
densityTokens.comfortable.iconSize.lg // "24px"
```

## File Structure

```
lib/density.ts          — TypeScript tokens, hooks, helpers
app/density.css         — CSS custom properties + Tailwind @theme extensions
app/foundation/density/ — Interactive demo page
docs/density-system.md  — This file
```

## Testing

Visit `/foundation/density` to see:

1. **Current density** — auto-detected mode and viewport width
2. **Manual override** — buttons to pin a mode (persisted in localStorage)
3. **Side-by-side comparison** — same UI in all three densities
4. **Token reference** — every value for every mode in sortable tables
