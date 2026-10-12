import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Car Via Auto Peças",
  description: "Sua próxima peça está aqui. Catálogo de autopeças, carrinho e checkout.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
