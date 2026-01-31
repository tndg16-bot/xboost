import { Metadata } from "next";

export const SITE_NAME = "Xboost";
export const SITE_URL = "https://www.xboost.now";
export const SITE_DESCRIPTION = "X（旧Twitter）運用に必要な全作業を一元管理できるSaaSツール。AI投稿作成、予約投稿、分析、自動化機能を搭載。";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
}

export function generateMetadata({
  title,
  description = SITE_DESCRIPTION,
  image = "/og-image.png",
  noIndex = false,
}: SEOProps): Metadata {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

  return {
    title: pageTitle,
    description,
    openGraph: {
      title: pageTitle,
      description,
      url: SITE_URL,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
      locale: "ja_JP",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [image],
      creator: "@xboost_now",
    },
    ...(noIndex && { robots: { index: false, follow: false } }),
    alternates: {
      canonical: SITE_URL,
    },
  };
}
