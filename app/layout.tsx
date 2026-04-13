import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Home | Mi App — Sergio Palma",
  description: "Página principal del sistema | Creado por Sergio Palma (Doc: 1082937565)",
  authors: [{ name: "Sergio Palma", url: "https://vercel.com" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}
