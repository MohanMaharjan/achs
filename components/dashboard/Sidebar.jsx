"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Home,
  Video,
  Users,
  Bookmark,
  Clock,
  ThumbsUp,
  Flame,
  Music,
  Trophy,
  Film,
  ShoppingBag,
  Newspaper,
  Lightbulb,
  Settings,
  Menu,
  X,
  Search,
  Mic,
  Bell,
  UserCircle
} from "lucide-react";
import Image from "next/image";

export default function Sidebar({ userRole }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const mainLinks = [
    { name: "Dashboard", icon: Home, path: "/dashboard" },
    { name: "Posts", icon: Newspaper, path: "/dashboard/posts" },
    { name: "Settings", icon: Users, path: "/dashboard/settings" },
  ];

 

  const mobileLinks = [
   { name: "Dashboard", icon: Home, path: "/dashboard" },
    { name: "Posts", icon: Newspaper, path: "/dashboard/posts" },
    { name: "Settings", icon: Users, path: "/dashboard/settings" },
  ];

  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-full hover:bg-gray-100 absolute top-2 left-2"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
         
        </div>
        
      </header>

      {/* Mobile Sidebar */}
      {isOpen && isMobile && (
        <div className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden">
          <div className="fixed inset-y-0 left-0 w-64 bg-white z-30">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
              <Link href="/" className="flex items-center">
                <Image
                  src="/achs.png" // Replace with your logo
                  alt="Logo"
                  width={90}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
            </div>
            <div className="h-full overflow-y-auto py-2">
              {mobileLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  className="flex items-center px-4 py-3 text-sm font-medium hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  <link.icon className="mr-4 h-6 w-6" />
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className={`${isMobile ? "hidden" : "flex"} md:flex md:flex-shrink-0`}>
        <div
          className={`${
            isOpen ? "w-64" : "w-20"
          } flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300`}
        >
          <div className="h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            {/* Logo and Toggle */}
            <div className="px-4 flex items-center justify-between mb-6">
              {isOpen ? (
                <Link href="/" className="flex items-center">
                  <Image
                    src="/achs.png" // Replace with your logo
                    alt="Logo"
                    width={120}
                    height={50}
                    className="h-10 w-auto"
                  />
                </Link>
              ) : (
                ''
              )}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1 rounded-full hover:bg-gray-100 hidden md:block"
              >
                {isOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Main Links */}
            <div className="px-2 space-y-1">
              {mainLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`group flex items-center ${
                    isOpen ? "px-3 py-2" : "px-2 py-3 justify-center"
                  } text-sm font-medium rounded-lg hover:bg-gray-100`}
                >
                  <link.icon
                    className={`${isOpen ? "mr-3" : ""} h-6 w-6 flex-shrink-0`}
                  />
                  {isOpen && link.name}
                </Link>
              ))}
            </div>

           

            

           

        


            {/* Settings (Admin Only) */}
            {userRole === "admin" && (
              <div className="px-2 space-y-1 mt-2">
                <Link
                  href="/dashboard/settings"
                  className={`group flex items-center ${
                    isOpen ? "px-3 py-2" : "px-2 py-3 justify-center"
                  } text-sm font-medium rounded-lg hover:bg-gray-100`}
                >
                  <Settings
                    className={`${isOpen ? "mr-3" : ""} h-6 w-6 flex-shrink-0`}
                  />
                  {isOpen && "Settings"}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}