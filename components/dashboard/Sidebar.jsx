'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Home,
  Users,
  Bookmark,
  Newspaper,
  BookAIcon,
  FileIcon,
  Menu,
  X
} from "lucide-react";
import Image from "next/image";

const PERMISSIONS = {
  VIEW_DASHBOARD: 'View_Dashboard',
  MANAGE_POSTS: 'Manage_Posts',
  MANAGE_DEPARTMENTS: 'Manage_Departments',
  MANAGE_COURSES: 'Manage_Courses',
  MANAGE_ROLES: 'Manage_Roles',
  MANAGE_PERMISSIONS: 'Manage_Permissions',
  MANAGE_USERS:'Manage_Users'
};

const NAV_LINKS = [
  { name: "Dashboard", icon: Home, path: "/dashboard", permission: PERMISSIONS.VIEW_DASHBOARD },
  {name: "Users", icon: Users, path: "/dashboard/users", permission: PERMISSIONS.MANAGE_USERS },
  { name: "Posts", icon: Newspaper, path: "/dashboard/posts", permission: PERMISSIONS.MANAGE_POSTS },
  { name: "Departments", icon: BookAIcon, path: "/dashboard/departments", permission: PERMISSIONS.MANAGE_DEPARTMENTS },
  { name: "Courses", icon: FileIcon, path: "/dashboard/courses", permission: PERMISSIONS.MANAGE_COURSES },
  { name: "Roles", icon: Users, path: "/dashboard/roles", permission: PERMISSIONS.MANAGE_ROLES },
  { name: "Permissions", icon: Bookmark, path: "/dashboard/permissions", permission: PERMISSIONS.MANAGE_PERMISSIONS }
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [authData, setAuthData] = useState({ permissions: null, loading: true });
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Fetch user permissions from the database
  useEffect(() => {
    const fetchPermissions = async () => {
      if (status !== 'authenticated' || !session?.user?.id) return;

      try {
        const res = await fetch(`/api/userpermissions?userId=${session.user.id}`);
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch permissions');
        }

        setAuthData({
          permissions: data.permissions || {},
          loading: false
        });
      } catch (error) {
        console.error('Permission fetch error:', error);
        setAuthData({
          permissions: {},
          loading: false
        });
      }
    };

    fetchPermissions();
  }, [session, status]);

  // Check if user has permission
  const hasPermission = (permission) => {
    return authData.permissions?.[permission] === true;
  };

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsOpen(!(window.innerWidth < 768)); // Open on desktop, closed on mobile
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter visible links based on permissions
  const visibleLinks = NAV_LINKS.filter(link => hasPermission(link.permission));

  // Loading and auth states
  if (authData.loading || status === 'loading') {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 sticky top-0 z-10">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:relative z-30 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      } h-full bg-white border-r border-gray-200 flex-shrink-0`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            {isOpen ? (
              <Link href="/" className="flex items-center">
                <Image
                  src="/achs.png"
                  alt="Logo"
                  width={120}
                  height={50}
                  className="h-10 w-auto"
                  priority
                />
              </Link>
            ) : (
              <div className="w-10 h-10"></div> // Spacer
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 rounded-full hover:bg-gray-100 hidden md:block"
              aria-label="Toggle sidebar"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {visibleLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className={`flex items-center ${
                      isOpen ? 'px-3 py-2' : 'px-2 py-3 justify-center'
                    } text-sm font-medium rounded-lg hover:bg-gray-100 ${
                      pathname.startsWith(link.path) ? 'bg-gray-100 font-semibold' : ''
                    }`}
                    onClick={() => isMobile && setIsOpen(false)}
                  >
                    <link.icon className={`${isOpen ? 'mr-3' : ''} h-6 w-6 flex-shrink-0`} />
                    {isOpen && <span>{link.name}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}