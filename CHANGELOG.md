# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.5.6] - 2026-02-24

### Added

- **Glass Vision (Template)** – New call centre page at `/pages/glass-vision` with customer account panels, Adora AI summary, service address cards with expandable billing/usage/load disaggregation details, Insights tab with charts (usage trend, cost breakdown, daily pattern, customer health radar, payment history, channel mix, bill forecast), and glassmorphism dark/light UI.
- **Full-screen toggle** – Expand/contract button on the Glass Vision left nav hides the design system sidebar for distraction-free viewing; contract restores it.

### Changed

- **Sidebar navigation (Templates)** – Removed "Tally Glass" and "Glass Energy Dashboard" entries; replaced with "Glass Vision".
- **Pages index** – Removed Tally Glass and Glass Energy Dashboard cards; added Glass Vision card.

## [1.5.5] - 2026-02-23

### Changed

- **Colours (Foundation)** – Semantic colour tokens updated: System (yellow) set to `#EAB308`; Warning set to `#E8560A` with Warning Light `#FFF4E6` (matching light tint). See Colours page and `lib/tokens/colors.ts`.

## [1.5.4] - 2026-02-23

### Added

- **Surface Colour (Foundation)** – New foundation page at `/foundation/surface-colour` documenting background gradients for the main content area (Pane) per Tally brand. Includes Tally CRM example (layered sky/blue), a table of all brands with their layer pairs, live swatches, and usage notes.
- **Surface colour tokens** – New `lib/tokens/surface-colours.ts` with `surfaceColours` and `getSurfaceClass(brand)`; each brand uses a layered gradient class defined in `globals.css`.
- **Layered brand gradients** – All brand surfaces now use the same opacity rule (light: layer1 50%→70%, layer2 30%→50%; dark: layer1 15%→25%, layer2 10%→20%). CRM: sky/blue; Tally Group, Tally+, Tally Glass: slate/blue; Tally+ Small Market: teal/emerald; Tally Sales & Acquisition: violet/purple; Tally Digital: orange/amber.
- **Surface Colour in nav** – “Surface Colour” added to the Foundation section in the sidebar.
- **Tally Glass brand page** – New foundation page at `/foundation/brands/tally-glass` with logo variants and assets (TallyGlassLogo, Mono, Reversed, MonoReversed) in `public/foundation/brands/tally-glass/`.

### Changed

- **CRM layout** – Main content area uses `surfaceColours["tally-crm"]` (layered sky/blue gradient).
- **Page templates** – Surface gradients applied to Glass Energy Dashboard (tally-crm), Small Market (tally-plus-small-market), S&A Dashboard and Tally Acquire (tally-sales-acquisition), Tally Glass (tally-glass), Beta Test Dashboard, Tally Orion, Tally Large Market (tally-group).
- **Layout and .cursorrules** – Pane and Surface Colour documented; token keys and usage added.

## [1.5.3] - 2026-02-18

### Added

- **Powered by Tally brand page** – New foundation page at `/foundation/brands/powered-by-tally` documenting the Powered by Tally badge:
  - Two badge variants (light and dark/REV) with previews and download links
  - “Use in the nav bar” section with NavigationBar demos (expanded and collapsed)
- **Powered by Tally in Brands** – “Powered by Tally” added to the Brands section in the sidebar navigation and to the brands index with a dedicated card.
- **Powered by Tally dark variant (REV)** – New asset `PoweredByTallyBadgeREV.svg` in `public/` for use on dark backgrounds; all dark-variant usage now references this file.

### Changed

- **Dark badge references** – NavigationBar, Sidebar, and all pages that showed the dark Powered by Tally badge (small-market, tally-orion, tally-acquire, sales-acquisition-dashboard, tally-large-market) now use `PoweredByTallyBadgeREV.svg` instead of `PoweredByTallyBadgeDark.svg`.
- **Brands index – logos** – Brand cards on the Brands home page now show the respective brand logos (Tally Group, Tally+, Tally+ Small Market, Tally Sales & Acquisition, Tally Digital, Tally CRM, Powered by Tally) where assets exist; icons are used only when no logo is available.
- **Brands index – logo layout** – Removed the grey box around logos; logos are larger (72px row height), consistent in size, and left-aligned for a cleaner, more visible presentation.
