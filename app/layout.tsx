import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar/Sidebar";
import ThemeModeSwitch from "@/components/ThemeModeSwitch/ThemeModeSwitch";
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
    title: "Foundation",
    items: [
      { label: "Colours", href: "/foundation/colour" },
      { label: "Cursor Rules", href: "/foundation/cursor-rules" },
      { label: "Icons", href: "/foundation/icons" },
      { label: "Layout", href: "/foundation/layout" },
      { label: "Layout Grid", href: "/foundation/layout-grid" },
      { label: "Logo", href: "/foundation/logo" },
      { label: "Typography", href: "/foundation/typography" },
      { label: "Panes", href: "/foundation/materials" },
      { label: "Dark Mode", href: "/foundation/dark-mode" },
    ],
  },
  {
    title: "Brands",
    items: [
      { label: "Tally Group", href: "/foundation/brands/tally-group" },
      { label: "Tally Small Market", href: "/foundation/brands/tally-small-markets" },
      { label: "Tally Large Market", href: "/foundation/brands/tally-large-market" },
      { label: "Tally Sales & Acquisition", href: "/foundation/brands/tally-sales-acquisition" },
      { label: "Tally Digital", href: "/foundation/brands/tally-digital" },
      { label: "Tally CRM", href: "/foundation/brands/tally-crm" },
    ],
  },
  {
    title: "Pages",
    items: [
      { label: "Dashboard", href: "/pages/dashboard" },
      { label: "Forms", href: "/pages/forms" },
      { label: "Tally Small Market", href: "/pages/small-market" },
      { label: "Tally Large Market", href: "/pages/tally-large-market" },
      { label: "Tally Glass", href: "/pages/tally-glass" },
      { label: "Tally Orion", href: "/pages/tally-orion" },
      { label: "Tally Acquire", href: "/pages/tally-acquire" },
      { label: "Beta Test Dashboard", href: "/pages/beta-test-dashboard" },
      { label: "S&A Beta", href: "/pages/sales-acquisition-dashboard" },
    ],
  },
  {
    title: "Components",
    items: [
      { label: "Accordion", href: "/components/accordion" },
      { label: "Alert", href: "/components/alert" },
      { label: "Alert Dialog", href: "/components/alert-dialog" },
      { label: "Aspect Ratio", href: "/components/aspect-ratio" },
      { label: "App Bar", href: "/components/app-bar" },
      { label: "Avatar", href: "/components/avatar" },
      { label: "Badge", href: "/components/badge" },
      { label: "Breadcrumb", href: "/components/breadcrumb" },
      { label: "Button", href: "/components/button" },
      { label: "Button Group", href: "/components/button-group" },
      { label: "Card", href: "/components/card" },
      { label: "Charts", href: "/components/charts" },
      { label: "Chart Widgets", href: "/components/electricity-usage-widget" },
      { label: "Checkbox", href: "/components/checkbox" },
      { label: "Collapsible", href: "/components/collapsible" },
      { label: "Dialog", href: "/components/dialog" },
      { label: "Dropdown Menu", href: "/components/dropdown-menu" },
      { label: "Input", href: "/components/input" },
      { label: "Navigation Bar", href: "/components/navigation-bar" },
      { label: "Popover", href: "/components/popover" },
      { label: "Progress", href: "/components/progress" },
      { label: "Radio Group", href: "/components/radio-group" },
      { label: "Select", href: "/components/select" },
      { label: "Sheet", href: "/components/sheet" },
      { label: "Skeleton", href: "/components/skeleton" },
      { label: "Slider", href: "/components/slider" },
      { label: "Switch", href: "/components/switch" },
      { label: "Table", href: "/components/table" },
      { label: "Tabs", href: "/components/tabs" },
      { label: "Textarea", href: "/components/textarea" },
      { label: "Toast", href: "/components/toast" },
      { label: "Toggle", href: "/components/toggle" },
      { label: "Toggle Group", href: "/components/toggle-group" },
      { label: "Tooltip", href: "/components/tooltip" },
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
        <div className="fixed bottom-6 right-6 z-50">
          <ThemeModeSwitch />
        </div>
        <div className="flex">
          <Sidebar sections={navigationSections} />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
