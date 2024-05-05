import { HotToaster } from "@/components/ui/toaster";
import "./globals.css";
import { Inter } from "next/font/google";

export const metadata = {
  metadataBase: new URL("https://postgres-pgvector.vercel.app"),
  title: "MadaVector - Semantic Search with one click",
  description:
    "A one-click install semantic search with Vercel, OpenAI, Llamaindex",
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        {children}
        <HotToaster />
      </body>
    </html>
  );
}
