import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ACHS: Dashboard",
  description: "ACHS@2025",
};

export default async function RootLayout({ children }) {
   const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }
 return (
  <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <div className="flex h-screen bg-gray-100">
          {/* Sidebar */}
          <Sidebar userRole={session.user.role} />
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <Header user={session.user} />
            
            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
   
  );
}
