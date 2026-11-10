"use client";

import React, { useEffect, useState } from "react";
import { AvailabilityManager } from "@/components/AvailabilityManager";

export default function AdminDisponibilitesPage() {
  const [propertyId, setPropertyId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const idParam = new URLSearchParams(window.location.search).get("propertyId");
      if (idParam) setPropertyId(idParam);
    }
  }, []);

  return <AvailabilityManager key={propertyId || "admin"} mode="admin" initialPropertyId={propertyId} />;
}

