import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui";
import { AppLogo } from "@/components/ui/Icons";

export const dynamic = 'force-dynamic';

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
    <html lang="es" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full bg-[var(--page-background)] text-[var(--text-primary)]">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
