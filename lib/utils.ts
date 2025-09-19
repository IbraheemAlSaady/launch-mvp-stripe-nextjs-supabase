import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Metadata } from "next";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ConstructMetadataProps {
  title?: string;
  description?: string;
  image?: string;
  icon?: string;
  noIndex?: boolean;
}

export function constructMetadata({
  title = "SaaS Starter",
  description = "A modern SaaS starter template built with Next.js, Supabase, and Stripe.",
  image = "/api/og",
  icon = "/favicon.ico",
  noIndex = false,
}: ConstructMetadataProps = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@your_handle",
    },
    icons: {
      icon,
    },
    metadataBase: new URL("http://localhost:3000"),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}