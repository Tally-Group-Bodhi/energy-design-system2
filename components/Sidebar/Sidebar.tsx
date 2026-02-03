import Link from "next/link";
import Header from "@/components/Header/Header";

interface SidebarItem {
  label: string;
  href: string;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

interface SidebarProps {
  sections: SidebarSection[];
}

export default function Sidebar({ sections }: SidebarProps) {
  return (
    <aside className="sticky top-0 h-screen w-64 overflow-y-auto border-r border-border bg-white">
      <div className="flex h-[92px] min-h-[92px] items-center border-b border-border px-6">
        <Header />
      </div>
      <nav className="p-6">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className={sectionIndex > 0 ? "mt-8" : ""}>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-900">
              {section.title}
            </h2>
            <ul className="space-y-1">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <Link
                    href={item.href}
                    className="block rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}

