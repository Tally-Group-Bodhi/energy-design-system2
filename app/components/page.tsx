"use client";

import Link from "next/link";
import PageBanner from "@/components/PageBanner/PageBanner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/Card/Card";
import { Icon } from "@/components/ui/icon";

const components = [
  {
    title: "Accordion",
    description: "Expandable and collapsible content sections",
    href: "/components/accordion",
    icon: "expand_more",
    category: "Layout",
  },
  {
    title: "Alert",
    description: "Inline alerts and notifications",
    href: "/components/alert",
    icon: "info",
    category: "Feedback",
  },
  {
    title: "Alert Dialog",
    description: "Modal confirmation dialogs",
    href: "/components/alert-dialog",
    icon: "warning",
    category: "Overlay",
  },
  {
    title: "Aspect Ratio",
    description: "Fixed aspect ratio containers",
    href: "/components/aspect-ratio",
    icon: "aspect_ratio",
    category: "Layout",
  },
  {
    title: "App Bar",
    description: "Top application bar with logo, search, and actions",
    href: "/components/app-bar",
    icon: "menu",
    category: "Navigation",
  },
  {
    title: "Avatar",
    description: "User avatars and profile images",
    href: "/components/avatar",
    icon: "account_circle",
    category: "Display",
  },
  {
    title: "Badge",
    description: "Status labels, counts, and tags",
    href: "/components/badge",
    icon: "label",
    category: "Display",
  },
  {
    title: "Breadcrumb",
    description: "Navigation breadcrumbs",
    href: "/components/breadcrumb",
    icon: "chevron_right",
    category: "Navigation",
  },
  {
    title: "Button",
    description: "Primary action buttons",
    href: "/components/button",
    icon: "smart_button",
    category: "Form",
  },
  {
    title: "Button Group",
    description: "Grouped buttons",
    href: "/components/button-group",
    icon: "view_module",
    category: "Form",
  },
  {
    title: "Calendar",
    description: "Date and date range picker calendar",
    href: "/components/calendar",
    icon: "calendar_today",
    category: "Form",
  },
  {
    title: "Card",
    description: "Content cards and panels",
    href: "/components/card",
    icon: "credit_card",
    category: "Layout",
  },
  {
    title: "Charts",
    description: "Data visualization charts",
    href: "/components/charts",
    icon: "bar_chart",
    category: "Data",
  },
  {
    title: "Chart Widgets",
    description: "Dashboard chart widgets",
    href: "/components/electricity-usage-widget",
    icon: "insights",
    category: "Data",
  },
  {
    title: "Checkbox",
    description: "Checkbox inputs",
    href: "/components/checkbox",
    icon: "check_box",
    category: "Form",
  },
  {
    title: "Collapsible",
    description: "Collapsible content sections",
    href: "/components/collapsible",
    icon: "unfold_more",
    category: "Layout",
  },
  {
    title: "Dialog",
    description: "Modal dialogs",
    href: "/components/dialog",
    icon: "open_in_new",
    category: "Overlay",
  },
  {
    title: "Dropdown Menu",
    description: "Dropdown menus",
    href: "/components/dropdown-menu",
    icon: "arrow_drop_down",
    category: "Navigation",
  },
  {
    title: "Input",
    description: "Text input fields",
    href: "/components/input",
    icon: "text_fields",
    category: "Form",
  },
  {
    title: "Navigation Bar",
    description: "Left navigation bar",
    href: "/components/navigation-bar",
    icon: "navigation",
    category: "Navigation",
  },
  {
    title: "Popover",
    description: "Popover overlays",
    href: "/components/popover",
    icon: "open_in_full",
    category: "Overlay",
  },
  {
    title: "Progress",
    description: "Progress bars and indicators",
    href: "/components/progress",
    icon: "trending_up",
    category: "Feedback",
  },
  {
    title: "Radio Group",
    description: "Radio button groups",
    href: "/components/radio-group",
    icon: "radio_button_checked",
    category: "Form",
  },
  {
    title: "Select",
    description: "Select dropdowns",
    href: "/components/select",
    icon: "arrow_drop_down_circle",
    category: "Form",
  },
  {
    title: "Sheet",
    description: "Slide-over panels",
    href: "/components/sheet",
    icon: "vertical_split",
    category: "Overlay",
  },
  {
    title: "Skeleton",
    description: "Loading placeholders",
    href: "/components/skeleton",
    icon: "view_column",
    category: "Feedback",
  },
  {
    title: "Slider",
    description: "Range sliders",
    href: "/components/slider",
    icon: "tune",
    category: "Form",
  },
  {
    title: "Switch",
    description: "Toggle switches",
    href: "/components/switch",
    icon: "toggle_on",
    category: "Form",
  },
  {
    title: "Table",
    description: "Data tables",
    href: "/components/table",
    icon: "table_rows",
    category: "Data",
  },
  {
    title: "Tabs",
    description: "Tab panels",
    href: "/components/tabs",
    icon: "tab",
    category: "Navigation",
  },
  {
    title: "Textarea",
    description: "Multi-line text inputs",
    href: "/components/textarea",
    icon: "notes",
    category: "Form",
  },
  {
    title: "Toast",
    description: "Toast notifications",
    href: "/components/toast",
    icon: "notifications",
    category: "Feedback",
  },
  {
    title: "Toggle",
    description: "Toggle buttons",
    href: "/components/toggle",
    icon: "toggle_on",
    category: "Form",
  },
  {
    title: "Toggle Group",
    description: "Segmented controls",
    href: "/components/toggle-group",
    icon: "view_module",
    category: "Form",
  },
  {
    title: "Tooltip",
    description: "Tooltips",
    href: "/components/tooltip",
    icon: "help",
    category: "Overlay",
  },
];

export default function ComponentsIndex() {
  return (
    <>
      <PageBanner title="Components" />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600 dark:text-gray-400">
              A comprehensive library of reusable UI components built for energy sector applications. All components follow consistent design patterns, are fully accessible, and work seamlessly together.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {components.map((component) => (
              <Link key={component.href} href={component.href} className="group">
                <Card className="h-full shadow-none transition-all hover:border-[#2C365D]/30">
                  <CardHeader>
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-[#2C365D]/10 transition-colors group-hover:bg-[#2C365D]/20">
                      <Icon name={component.icon as "info"} size={24} className="text-[#2C365D] dark:text-[#7c8cb8]" />
                    </div>
                    <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-[#2C365D] dark:text-gray-100 dark:group-hover:text-[#7c8cb8]">
                      {component.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {component.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                      {component.category}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
