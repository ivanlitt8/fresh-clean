import "./globals.css";
import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { NavigationProvider } from "./context/NavigationContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Fresh & Clean",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-sans`}>
        <NavigationProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </NavigationProvider>
      </body>
    </html>
  );
}
