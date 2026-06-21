import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { JsonLd } from "@/components/seo/JsonLd";
import { OG_ONE, OG_TWO, rootJsonLd, seoKeywords, SITE_LOGO, SITE_NAME, SITE_URL, siteDescription } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Neetell | NEET Counselling, College Predictor & Cutoff Intelligence",
    template: "%s | Neetell",
  },
  description: siteDescription,
  keywords: seoKeywords,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: "/authors/neetell" }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/logo-outline.png",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "Neetell | NEET Counselling & College Predictor",
    description:
      "Explore realistic medical college options for your NEET rank, compare fees and bonds, track cutoff trends, and plan AIQ plus state counselling with data-backed tools.",
    url: "/",
    siteName: SITE_NAME,
    images: [
      {
        url: OG_ONE,
        width: 1200,
        height: 630,
        alt: "Neetell NEET counselling platform",
      },
      {
        url: OG_TWO,
        width: 1200,
        height: 630,
        alt: "Neetell AI NEET Counselling and Pan-India Medical College Predictor Map",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Neetell | NEET Counselling & College Predictor",
    description:
      "Rank-aware college prediction, cutoff trends, fees, bonds, seat matrix, and choice filling tools for NEET aspirants.",
    images: [OG_ONE, OG_TWO],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  ...(googleSiteVerification
    ? {
        verification: {
          google: googleSiteVerification,
        },
      }
    : {}),
};

/**
 * Inline script that runs before hydration to apply the persisted theme.
 * Prevents flash of the wrong theme on first load.
 */
const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var resolved = stored === 'dark' || stored === 'light'
      ? stored
      : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.classList.add(resolved);
    document.documentElement.setAttribute('data-theme', resolved);
  } catch (_) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Runs synchronously before paint — eliminates theme flash */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        {rootJsonLd.map((schema, index) => (
          <JsonLd key={index} data={schema} />
        ))}
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
