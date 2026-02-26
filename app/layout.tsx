import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar/Sidebar";
import ThemeModeSwitch from "@/components/ThemeModeSwitch/ThemeModeSwitch";
import DensityModeSwitch from "@/components/DensityModeSwitch/DensityModeSwitch";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tally Energy Design System",
  description: "A comprehensive design system for energy sector products: call center tools, customer dashboards, and related applications",
  icons: {
    icon: "/icon.svg",
  },
};

const navigationSections = [
  {
    title: "Elements",
    items: [
      { label: "How the TDS is Set Up", href: "/foundation/tds-setup" },
      { label: "Implementation Guide", href: "/foundation/implementation" },
      { label: "Colours", href: "/foundation/colour" },
      { label: "Cursor Rules", href: "/foundation/cursor-rules" },
      { label: "Dark Mode", href: "/foundation/dark-mode" },
      { label: "Density", href: "/foundation/density" },
      { label: "Icons", href: "/foundation/icons" },
      { label: "Layout", href: "/foundation/layout" },
      { label: "Layout Grid", href: "/foundation/layout-grid" },
      { label: "Logo", href: "/foundation/logo" },
      { label: "Surface Colour", href: "/foundation/surface-colour" },
      { label: "Panes", href: "/foundation/materials" },
      { label: "Typography", href: "/foundation/typography" },
    ],
  },
  {
    title: "Brands",
    items: [
      { label: "Tally Group", href: "/foundation/brands/tally-group" },
      { label: "Tally+", href: "/foundation/brands/tally-plus" },
      { label: "Tally+ Small Market", href: "/foundation/brands/tally-plus-small-market" },
      { label: "Tally Sales & Acquisition", href: "/foundation/brands/tally-sales-acquisition" },
      { label: "Tally Digital", href: "/foundation/brands/tally-digital" },
      { label: "Tally CRM", href: "/foundation/brands/tally-crm" },
      { label: "Tally Glass", href: "/foundation/brands/tally-glass" },
      { label: "Powered by Tally", href: "/foundation/brands/powered-by-tally" },
    ],
  },
  {
    title: "Atoms",
    items: [
      { label: "Alert", href: "/components/alert" },
      { label: "Aspect Ratio", href: "/components/aspect-ratio" },
      { label: "Avatar", href: "/components/avatar" },
      { label: "Badge", href: "/components/badge" },
      { label: "Button", href: "/components/button" },
      { label: "Checkbox", href: "/components/checkbox" },
      { label: "Input", href: "/components/input" },
      { label: "Progress", href: "/components/progress" },
      { label: "Skeleton", href: "/components/skeleton" },
      { label: "Slider", href: "/components/slider" },
      { label: "Switch", href: "/components/switch" },
      { label: "Textarea", href: "/components/textarea" },
      { label: "Toggle", href: "/components/toggle" },
      { label: "Tooltip", href: "/components/tooltip" },
    ],
  },
  {
    title: "Molecules",
    items: [
      { label: "Accordion", href: "/components/accordion" },
      { label: "Alert Dialog", href: "/components/alert-dialog" },
      { label: "Breadcrumb", href: "/components/breadcrumb" },
      { label: "Button Group", href: "/components/button-group" },
      { label: "Calendar", href: "/components/calendar" },
      { label: "Collapsible", href: "/components/collapsible" },
      { label: "Dropdown Menu", href: "/components/dropdown-menu" },
      { label: "Popover", href: "/components/popover" },
      { label: "Radio Group", href: "/components/radio-group" },
      { label: "Select", href: "/components/select" },
      { label: "Tabs", href: "/components/tabs" },
      { label: "Toast", href: "/components/toast" },
      { label: "Toggle Group", href: "/components/toggle-group" },
    ],
  },
  {
    title: "Organisms",
    items: [
      { label: "Account Context Panel", href: "/components/account-context-panel" },
      { label: "App Bar", href: "/components/app-bar" },
      { label: "Card", href: "/components/card" },
      { label: "Charts", href: "/components/charts" },
      { label: "Chart Widgets", href: "/components/electricity-usage-widget" },
      { label: "Dialog", href: "/components/dialog" },
      { label: "Navigation Bar", href: "/components/navigation-bar" },
      { label: "Sheet", href: "/components/sheet" },
      { label: "Table", href: "/components/table" },
    ],
  },
  {
    title: "Templates",
    items: [
      { label: "Login", href: "/pages/login" },
      { label: "Dashboard", href: "/pages/dashboard" },
      { label: "Forms", href: "/pages/forms" },
    ],
  },
  {
    title: "Pages",
    items: [
      { label: "Tally+ Small Market", href: "/pages/small-market" },
      { label: "Tally+ Large Market", href: "/pages/tally-large-market" },
      { label: "Glass Vision", href: "/pages/glass-vision" },
      { label: "Tally Orion", href: "/pages/tally-orion" },
      { label: "Tally Acquire", href: "/pages/tally-acquire" },
      { label: "Beta Test Dashboard", href: "/pages/beta-test-dashboard" },
      { label: "S&A Beta", href: "/pages/sales-acquisition-dashboard" },
      { label: "Tally CRM", href: "/crm/dashboard" },
    ],
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
          <DensityModeSwitch />
          <ThemeModeSwitch />
        </div>
        <div className="flex h-screen overflow-hidden">
          <Sidebar sections={navigationSections} />
          <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
