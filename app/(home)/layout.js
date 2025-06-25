import { Inter, Lora, Source_Sans_3 } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/footer";

// Primary sans-serif font for body text (highly readable)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Serif font for headings (academic feel)
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

// Clean sans-serif alternative
const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

export const metadata = {
  title: "Asian College of Higher Studies | Quality Education Since 2025",
  description: "Premier higher education institution offering innovative programs and research opportunities",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable} ${sourceSans.variable}`}>
      <body className="font-sans bg-white text-gray-900 antialiased">
        <Navbar />
        <main className="min-h-[calc(100vh-140px)]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}