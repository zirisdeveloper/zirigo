"use client";

import React from "react";
import { PropertyForm } from "@/components/admin/PropertyForm";

export default function EspacePersoNewPropertyPage() {
  return (
    <div>
      <PropertyForm isEdit={false} mode="user" />
    </div>
  );
}

