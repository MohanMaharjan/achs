"use client";

import { Search, Bell, Video } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";

export default function Header({ user }) {
  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-end px-4 py-2">
        {/* Left Section - Search */}
        

        {/* Right Section - Icons and User */}
        <div className="flex items-center space-x-4">
          
          <div className="relative group">
            <button className="flex items-center space-x-1 cursor-pointer">
              <Image
                src={user?.image || "/achs.png"}
                alt="User avatar"
                width={80}
                height={50}
                className="rounded-full"
              />
            </button>
            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-0 w-48 bg-gray-200 rounded-md shadow-lg py-1 z-10 hidden group-hover:block cursor-pointer">
              <button
                onClick={() => signOut()}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 w-full text-left cursor-pointer"
              >
                
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}