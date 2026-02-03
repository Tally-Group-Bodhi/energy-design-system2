"use client";

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/Avatar/Avatar";
import { Icon } from "@/components/ui/icon";
import PageBanner from "@/components/PageBanner/PageBanner";
import TabNavigation from "@/components/TabNavigation/TabNavigation";
import { useState } from "react";

export default function AvatarPage() {
  const [activeTab, setActiveTab] = useState("design");

  const tabs = [
    { id: "design", label: "Design" },
    { id: "code", label: "Code" },
  ];

  return (
    <>
      <PageBanner title="Avatar" />
      <TabNavigation
        tabs={tabs}
        defaultTab="design"
        onTabChange={setActiveTab}
      />
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600">
              Avatars represent users or entities. Fallback uses our primary
              colour and can show initials or an icon.
            </p>
          </div>

          {activeTab === "design" && (
            <>
              <section className="mb-16 border-t border-gray-200 pt-16">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                  With image
                </h2>
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="User"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
              </section>
              <section className="mb-16 border-t border-gray-200 pt-16">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                  Fallback (initials)
                </h2>
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarFallback>AB</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback>XY</AvatarFallback>
                  </Avatar>
                </div>
              </section>
              <section className="mb-16 border-t border-gray-200 pt-16">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                  Fallback (icon)
                </h2>
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarFallback>
                      <Icon name="person" size={24} />
                    </AvatarFallback>
                  </Avatar>
                </div>
              </section>
            </>
          )}

          {activeTab === "code" && (
            <section className="border-t border-gray-200 pt-16">
              <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
                Usage
              </h2>
              <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                <code>{`import { Avatar, AvatarImage, AvatarFallback } from "@/components/Avatar/Avatar";
import { Icon } from "@/components/ui/icon";

<Avatar>
  <AvatarImage src="..." alt="User" />
  <AvatarFallback>AB</AvatarFallback>
</Avatar>

<Avatar>
  <AvatarFallback><Icon name="person" size={24} /></AvatarFallback>
</Avatar>`}</code>
              </pre>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
