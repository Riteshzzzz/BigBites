import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ 
  weight: ['400', '500', '600', '700', '800'],
  subsets: ["latin"], 
  variable: "--font-outfit" 
});

export const metadata = {
  title: "Big Bites | Order Food Online",
  description: "The best food delivery platform for your cravings.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} antialiased bg-[var(--color-background)] min-h-screen selection:bg-[var(--color-primary-light)] selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
