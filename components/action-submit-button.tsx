"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { LoaderIcon } from "lucide-react";

export default function ActionSubmitButton({
  children,
}: {
  children: React.ReactNode;
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="outline">
      {pending ? <LoaderIcon className="animate-spin" /> : children}
    </Button>
  );
}
