// components/ClientLayout.js (Client Component)
'use client';

import { SessionProvider } from "next-auth/react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

export default function ClientLayout({ session, children }) {
  return (
    <SessionProvider session={session}>
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
    </SessionProvider>
  );
}