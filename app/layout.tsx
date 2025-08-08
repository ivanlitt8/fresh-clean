import "@/app/globals.css";
import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { NavigationProvider } from "@/app/context/NavigationContext";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

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

config.autoAddCss = false;

export const metadata: Metadata = {
  title: "Helping Crew",
  icons: {
    icon: "/favicon.ico",
  },
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
