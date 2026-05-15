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
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full bg-[#0b1220] text-emerald-100">
        <header className="bg-gradient-to-r from-emerald-900/30 via-transparent to-transparent border-b border-emerald-800">
          <div className="max-w-7xl mx-auto px-4 py-3"><AppLogo /></div>
        </header>
        <main className="min-h-[80vh] max-w-7xl mx-auto px-4 py-6">
          <ToastProvider>{children}</ToastProvider>
        </main>
        <footer className="border-t border-[#e6e1d7] mt-8 py-6 text-center text-sm text-[#6B5635]">
          © {new Date().getFullYear()} SIG Bovino — Proyecto
        </footer>
      </body>
    </html>
  );
}
