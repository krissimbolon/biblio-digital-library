import "./globals.css";
import { connection } from "next/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  metadataBase: new URL("https://biblio-digital-library.vercel.app"),
  title: "BIBLIO — Biblio Digital Library",
  description: "Jelajahi karya sastra klasik dunia dan temukan bacaan yang bermakna di Biblio Digital Library.",
};

export default async function RootLayout({ children }) {
  await connection();
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" />
      </head>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <Header />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
