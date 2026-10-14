import type { Metadata } from "next";
import "./globals.css";
import {CustomerAuthProvider} from "../components/CustomerAuth";

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
      <body className="antialiased"><CustomerAuthProvider>{children}</CustomerAuthProvider></body>
    </html>
  );
}
