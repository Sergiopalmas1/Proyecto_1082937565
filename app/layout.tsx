import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SIG Bovino — Gestión de Ganado",
  description: "Sistema de inventario y gestión bovina para fincas empresariales",
  authors: [{ name: "Sergio Palma", url: "https://vercel.com" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full bg-[#F5EFE0] text-slate-900">{children}</body>
    </html>
  );
}
