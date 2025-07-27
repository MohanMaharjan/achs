'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { BellDotIcon, ChevronDown, Menu, UserIcon, XIcon, Video } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Slider from './Slider';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import the VirtualTour component to avoid SSR issues with Three.js
const VirtualTour = dynamic(() => import('./VirtualTour'), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">Loading 3D Tour...</div>
});

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ left: 0, width: 0 });
  const [scrolled, setScrolled] = useState(false);
  const [showVirtualTour, setShowVirtualTour] = useState(false);
  const navRef = useRef(null);
  const itemRefs = useRef([]);
  const pathname = usePathname();

  const isHomePage = pathname === '/';

  const navItems = [
    { 
      name: 'About Us', 
      href: '/about', 
      submenu: null 
    },
    { 
      name: 'Programs', 
      submenu: {
        title: "Our Academic Programs",
        description: "Explore our wide range of undergraduate and graduate programs designed to shape future leaders.",
        image: "/csit.jpg",
        columns: [
          {
            title: "B. Sc. CSIT (Bachelor of Science in Computer Science and Information Technology)",
            href:' /program?departmentId=1',
            image:'/csit.jpg'
            
          },
          {
            title: "BCA (Bachelor of Computer Application)",
            href: '/program?departmentId=2',
            image:'/bca.jpg'
           
          },
          {
            title: "BBM (Bachelor of Business Management)",
             href: '/program?departmentId=3',
             image:'/bbm.jpg'
           
          }
        ]
      } 
    },
   
    { 
      name: 'Life at ACHS', 
      href: '/life', 
      submenu: null 
    },
    { 
      name: 'News',
      href: '/news', 
      icon: <BellDotIcon size={24}/> 
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 100;
      const isScrolled = window.scrollY > scrollThreshold;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const toggleDropdown = (index, event = null) => {
    if (navItems[index]?.submenu) {
      if (event) {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const navRect = navRef.current?.getBoundingClientRect();
        
        if (navRect) {
          setDropdownPosition({
            left: navRect.left,
            width: navRect.width
          });
        }
      }
      
      setActiveDropdown(activeDropdown === index ? null : index);
    } else {
      setActiveDropdown(null);
    }
  };

  const toggleVirtualTour = () => {
    setShowVirtualTour(!showVirtualTour);
    // Close other open menus when opening virtual tour
    if (!showVirtualTour) {
      setMobileMenuOpen(false);
      setActiveDropdown(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Virtual Tour Modal */}
      <AnimatePresence>
        {showVirtualTour && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          >
            <div className="relative w-full h-full max-w-7xl mx-auto">
              <button
                onClick={toggleVirtualTour}
                className="absolute top-4 right-4 z-50 text-white hover:text-rose-500 transition-colors"
              >
                <XIcon size={32} />
              </button>
              <VirtualTour />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`w-full ${isHomePage ? 'h-screen' : 'h-[80vh]'} relative`}>
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`fixed top-0 z-40 transition-colors duration-300 w-full ${
            scrolled 
              ? 'bg-white text-gray-900 shadow-md h-24' 
              : 'bg-transparent text-white h-24'
          }`}
          ref={navRef}
        >
          <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/">
                <Image 
                  src="/achs.png" 
                  width={180} 
                  height={80} 
                  alt="ACHS Logo" 
                  className={`text-2xl font-bold ${scrolled ? 'text-gray-900' : 'text-white'} ${scrolled ? 'h-20 w-[180px]' : 'h-20'}`} 
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {navItems.map((item, index) => (
                <div key={item.name} className="relative">
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={`flex items-center py-2 transition-colors uppercase font-semibold ${
                        scrolled 
                          ? 'text-gray-700 hover:text-rose-500' 
                          : 'text-white hover:text-rose-500'
                      } ${item.submenu ? 'pr-1' : ''}`}
                    >
                      {item.icon && <span className="mr-2">{item.icon}</span>}
                      {item.name}
                    </Link>
                  ) : (
                    <button
                      ref={el => itemRefs.current[index] = el}
                      onClick={(e) => toggleDropdown(index, e)}
                      className={`flex items-center py-2 transition-colors uppercase font-semibold ${
                        scrolled 
                          ? 'text-gray-700 hover:text-rose-500' 
                          : 'text-white hover:text-rose-500'
                      } ${item.submenu ? 'pr-1' : ''}`}
                    >
                      {item.icon && <span className="mr-2">{item.icon}</span>}
                      {item.name}
                      {item.submenu && (
                        <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${
                          activeDropdown === index ? 'rotate-180' : ''
                        }`} />
                      )}
                    </button>
                  )}
                </div>
              ))}
              
              {/* Virtual Tour Button */}
              <button
                onClick={toggleVirtualTour}
                className={`flex items-center py-2 transition-colors uppercase font-semibold ${
                  scrolled 
                    ? 'text-gray-700 hover:text-rose-500' 
                    : 'text-white hover:text-rose-500'
                }`}
              >
                <Video className="mr-2 h-5 w-5" />
                Virtual Tour
              </button>
            </div>
            
            <div className="hidden lg:flex items-center space-x-4 justify-center">
              <button className={`px-2 py-2 rounded-md transition-colors font-semibold cursor-pointer items-center flex hover:text-rose-500 `}>
                <div className="flex items-center justify-center">
                  <Link href="/login">
                    <UserIcon className="h-5 w-5" />
                  </Link>
                </div>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center space-x-4">
              <button
                onClick={toggleVirtualTour}
                className={scrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-gray-200'}
                aria-label="Virtual Tour"
              >
                <Video className="h-6 w-6" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={scrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-gray-200'}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <XIcon className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </nav>

          
          {/* Desktop Dropdown (Large Screens Only) */}
<AnimatePresence>
  {activeDropdown !== null && navItems[activeDropdown]?.submenu && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="hidden lg:block fixed left-0 right-0 bg-white shadow-lg z-40 border-t border-gray-100"
      style={{
        top: navRef.current?.getBoundingClientRect()?.bottom || '64px',
        width: '100%'
      }}
    >
      <div className="container mx-auto px-6 py-8 max-h-[80vh] overflow-y-auto">
        <XIcon 
          size={24} 
          className="absolute top-4 right-4 cursor-pointer text-rose-500" 
          onClick={() => setActiveDropdown(null)} 
        />
        <h2 className="text-2xl font-bold mb-2 text-black">{navItems[activeDropdown].submenu.title}</h2>
        <p className="text-gray-600 mb-6">{navItems[activeDropdown].submenu.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {navItems[activeDropdown].submenu.columns.map((column, colIndex) => (
            <motion.div 
              key={colIndex}
              className="group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.1 * colIndex,
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
            >
              <Link 
                href={column.href} 
                className="block h-full"
                onClick={() => setActiveDropdown(null)}
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={column.image}
                    alt={column.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <div className="mr-3 p-2 bg-amber-500 rounded-lg text-white">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{column.title}</h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>

{/* Mobile Navigation (Small Screens Only) */}
<AnimatePresence>
  {mobileMenuOpen && (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="lg:hidden fixed inset-0 z-50 bg-white pt-24 pb-8 overflow-y-auto"
    >
      {/* Close Button */}
      <button
        onClick={() => setMobileMenuOpen(false)}
        className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Close menu"
      >
        <XIcon className="h-6 w-6 text-gray-700" />
      </button>

      <div className="container mx-auto px-6">
        {/* Virtual Tour Button */}
        <button
          onClick={() => {
            setMobileMenuOpen(false);
            toggleVirtualTour();
          }}
          className="flex items-center w-full py-4 px-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors mb-2"
        >
          <Video className="h-5 w-5 mr-3 text-rose-500" />
          <span className="font-medium text-gray-900">Virtual 3D Tour</span>
        </button>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item, index) => (
            <div key={item.name}>
              {item.href ? (
                <Link
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between w-full py-4 px-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">{item.name}</span>
                  {item.icon && <span className="text-gray-500">{item.icon}</span>}
                </Link>
              ) : (
                <div className="space-y-1">
                  <button
                    onClick={() => toggleDropdown(index)}
                    className="flex items-center justify-between w-full py-4 px-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900">{item.name}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-500 transition-transform ${
                        activeDropdown === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Submenu Dropdown */}
                  {item.submenu && activeDropdown === index && (
                    <div className="pl-6 space-y-2">
                      <div className="pt-2 pb-3">
                        <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">
                          {item.submenu.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {item.submenu.description}
                        </p>
                      </div>

                      {item.submenu.columns.map((column, colIndex) => (
                        <Link
                          key={colIndex}
                          href={column.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center py-3 px-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex-shrink-0 h-10 w-10 mr-3">
                            <Image
                              src={column.image}
                              alt={column.title}
                              width={40}
                              height={40}
                              className="rounded-md object-cover"
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {column.title}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Login Button */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <Link
            href="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center py-2 px-3 -mx-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-rose-500 transition-colors"
          >
            <UserIcon className="h-5 w-5 mr-2" />
            <span className="font-medium">Login</span>
          </Link>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>

        </motion.header>

        {/* Hero Section */}
        {isHomePage ? (
          <div className="h-screen w-full">
            <Slider />
          </div>
        ) : (
         <div className="h-full w-full">
            <div className="absolute inset-0 w-full h-full">
              <Image
                src="/images/unlock.jpg"
                alt="ACHS Campus"
                fill
                className="object-cover"
                priority
              />
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute inset-0 flex bg-black opacity-20" />
              <p className="text-white text-4xl font-bold uppercase z-10">
                {pathname.split('/').pop()}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;