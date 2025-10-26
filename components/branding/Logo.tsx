"use client";

import React from "react";

type LogoProps = {
  variant?: "full" | "mark";
  className?: string;
  alt?: string;
};

export function Logo({ variant = "full", className, alt }: LogoProps) {
  const src = variant === "mark" ? "/logo-mark.svg" : "/logo.svg";
  const title = alt || (variant === "mark" ? "Vrachka" : "Vrachka — астрология и таро");
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={title} className={className} loading="eager" decoding="async" />
  );
}

export default Logo;

