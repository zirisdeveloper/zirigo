"use client";

import React, { useEffect, useState } from "react";
import { AvailabilityManager } from "@/components/AvailabilityManager";

export default function EspacePersoDisponibilitesPage() {
  const [propertyId, setPropertyId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const idParam = new URLSearchParams(window.location.search).get("propertyId");
      if (idParam) setPropertyId(idParam);
    }
  }, []);

  return <AvailabilityManager key={propertyId || "owner"} mode="owner" initialPropertyId={propertyId} />;
}

