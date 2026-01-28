interface PageBannerProps {
  title: string;
}

export default function PageBanner({ title }: PageBannerProps) {
  return (
    <div className="flex h-[92px] w-full items-center bg-[#2C365D] px-6">
      <h1 className="text-3xl font-semibold uppercase tracking-wide text-white">
        {title}
      </h1>
    </div>
  );
}

