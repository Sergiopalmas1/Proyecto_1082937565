import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Home | Mi App",
  description: "Página principal del sistema",
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
