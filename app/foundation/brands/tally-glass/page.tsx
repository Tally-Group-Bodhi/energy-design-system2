"use client";

import Image from "next/image";
import Link from "next/link";
import PageBanner from "@/components/PageBanner/PageBanner";
import { Alert } from "@/components/Alert/Alert";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/Card/Card";
import { Icon } from "@/components/ui/icon";

const LOGO_BASE = "/foundation/brands/tally-glass";

const logos = [
  { name: "Primary (full colour)", file: "TallyGlassLogo.svg", bg: "bg-white", label: "Light background" },
  { name: "Reversed (full colour)", file: "TallyGlassLogoReversed.svg", bg: "bg-[#2C365D]", label: "Dark background" },
  { name: "Mono (single colour)", file: "TallyGlassLogoMono.svg", bg: "bg-white", label: "Light background" },
  { name: "Mono reversed", file: "TallyGlassLogoMonoReversed.svg", bg: "bg-[#2C365D]", label: "Dark background" },
] as const;

export default function TallyGlassPage() {
  return (
    <>
      <PageBanner title="Tally Glass" />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Alert variant="info" className="mb-8">
            Work in progress — this brand page will be expanded with colours and guidelines.
          </Alert>
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600 dark:text-gray-400">
              Tally Glass is the call centre and agent-facing product brand. This page documents logo usage. Colours and further guidelines will be added when available.
            </p>
          </div>

          <section className="mb-16 border-t border-border pt-16">
            <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              Logo
            </h2>
            <p className="mb-6 max-w-3xl text-base text-gray-600 dark:text-gray-400">
              Use the official Tally Glass logo in the correct variant for your background. Download the asset you need below.
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {logos.map((logo) => (
                <Card key={logo.file} className="overflow-hidden shadow-none">
                  <div className={`flex min-h-[72px] items-center justify-center p-4 ${logo.bg}`}>
                    <Image
                      src={`${LOGO_BASE}/${logo.file}`}
                      alt={logo.name}
                      width={140}
                      height={44}
                      className="max-h-10 w-auto object-contain"
                      unoptimized
                    />
                  </div>
                  <CardHeader className="pb-1 pt-3">
                    <CardTitle className="text-sm">{logo.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">{logo.label}</p>
                  </CardHeader>
                  <CardContent className="pt-0 pb-3">
                    <a
                      href={`${LOGO_BASE}/${logo.file}`}
                      download={logo.file}
                      className="inline-flex items-center rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium ring-offset-background hover:bg-accent hover:text-accent-foreground"
                    >
                      <Icon name="download" size={14} className="mr-1.5" />
                      Download SVG
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <div className="border-t border-border pt-8">
            <Link
              href="/foundation/brands"
              className="text-sm font-medium text-[#2C365D] hover:underline dark:text-[#7c8cb8]"
            >
              ← Back to Brands
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
