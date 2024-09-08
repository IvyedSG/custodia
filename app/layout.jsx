// app/layout.jsx
"use client"; // Agregar esto

import { Inter } from "next/font/google";
import "./globals.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Cambiado a next/navigation
import { metadata } from "./metadata"; // Importar metadata

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    if (router.pathname === "/") {
      router.replace("/dashboard"); 
    }
  }, [router]);

  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
