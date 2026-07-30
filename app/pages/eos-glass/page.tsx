"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ResidentialEnvironment from "./residential-environment";
import CommercialEnvironment from "./commercial-environment";
import type { EosGlassEnvironment } from "./eos-glass-theme";

export default function EosGlassPage() {
  return (
    <Suspense>
      <EosGlassContent />
    </Suspense>
  );
}

function readSegment(param: string | null): EosGlassEnvironment {
  return param === "commercial" ? "commercial" : "residential";
}

function EosGlassContent() {
  const searchParams = useSearchParams();
  const segmentParam = searchParams.get("segment");
  const [environment, setEnvironment] = useState<EosGlassEnvironment>(() =>
    readSegment(segmentParam)
  );

  // Deep links from the residential account list navigate client-side, so the
  // segment has to follow the URL as well as the in-header switch.
  useEffect(() => {
    setEnvironment(readSegment(segmentParam));
  }, [segmentParam]);

  return environment === "residential" ? (
    <ResidentialEnvironment
      environment={environment}
      onEnvironmentChange={setEnvironment}
    />
  ) : (
    <CommercialEnvironment
      environment={environment}
      onEnvironmentChange={setEnvironment}
    />
  );
}
