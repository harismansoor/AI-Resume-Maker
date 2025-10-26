import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://airesumemaker.example.com"),
  title: "AI Resume Maker — Build an ATS-ready resume with live AI",
  description:
    "Generate, import, and tailor a professional, ATS-friendly resume with real-time template previews and AI assistance.",
  openGraph: {
    title: "AI Resume Maker",
    description:
      "Generate, import, and tailor a professional, ATS-friendly resume with real-time template previews.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Resume Maker",
    description:
      "Generate, import, and tailor a professional, ATS-friendly resume with real-time template previews.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-white text-slate-900 antialiased">{children}</body>
    </html>
  );
}
