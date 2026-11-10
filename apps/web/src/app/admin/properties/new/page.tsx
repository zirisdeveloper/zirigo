"use client";

import React from "react";
import { PropertyForm } from "@/components/admin/PropertyForm";

export default function NewPropertyPage() {
  return (
    <div>
      <PropertyForm isEdit={false} />
    </div>
  );
}

