'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { BellDotIcon, ChevronDown, Menu, ShoppingBag, UserIcon, X, XIcon } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Slider from './Slider';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ left: 0, width: 0 });
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);
  const itemRefs = useRef([]);

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
            title: "Undergraduate Programs",
            items: [
              { name: 'Bachelor of Science', href: '/programs/bsc' },
              { name: 'Bachelor of Arts', href: '/programs/ba' },
              { name: 'Bachelor of Commerce', href: '/programs/bcom' }
            ]
          },
          {
            title: "Graduate Programs",
            items: [
              { name: 'Master of Science', href: '/programs/msc' },
              { name: 'Master of Business', href: '/programs/mba' },
              { name: 'PhD Programs', href: '/programs/phd' }
            ]
          },
          {
            title: "Professional Development",
            items: [
              { name: 'Certification Courses', href: '/programs/certifications' },
              { name: 'Workshops', href: '/programs/workshops' },
              { name: 'Executive Education', href: '/programs/executive' }
            ]
          }
        ]
      } 
    },
    { 
      name: 'Life @ ACHS', 
      submenu: {
        title: "Campus Life Experience",
        description: "Discover the vibrant community and facilities that make ACHS unique.",
        image: "/bca.jpg",
        columns: [
          {
            title: "Student Life",
            items: [
              { name: 'Housing & Dining', href: '/life/housing' },
              { name: 'Health & Wellness', href: '/life/health' },
              { name: 'Campus Events', href: '/life/events' }
            ]
          },
          {
            title: "Activities",
            items: [
              { name: 'Sports & Recreation', href: '/life/sports' },
              { name: 'Student Clubs', href: '/life/clubs' },
              { name: 'Arts & Culture', href: '/life/arts' }
            ]
          },
          {
            title: "Support Services",
            items: [
              { name: 'Career Services', href: '/life/careers' },
              { name: 'Academic Support', href: '/life/academics' },
              { name: 'Counseling', href: '/life/counseling' }
            ]
          }
        ]
      } 
    },
    { 
      name: 'Notice', 
      href: '#contact', 
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
      <div className='h-screen w-full '>
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`fixed top-0 z-50 transition-colors duration-300 w-full ${
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
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item, index) => (
                <div key={item.name} className="relative ">
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={`flex items-center py-2 transition-colors uppercase font-semibold  ${
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
                      onMouseEnter={(e) => toggleDropdown(index, e)}
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
            </div>
            <div className="hidden md:flex items-center space-x-4 justify-center">
              <button className={`px-2 py-2 rounded-md transition-colors font-semibold cursor-pointer items-center flex hover:text-rose-500 `}>
                <div className="flex items-center justify-center">
                  <Link href="/login">
                    <UserIcon className="h-5 w-5" />
                  </Link>
                </div>
              </button>
              </div>

           

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={scrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-gray-200'}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </nav>

          {/* Full-width Desktop Dropdown */}
          <AnimatePresence>
            {activeDropdown !== null && navItems[activeDropdown]?.submenu && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="hidden md:block fixed left-0 right-0 bg-white shadow-lg z-40 border-t border-gray-100 "
                style={{
                  top: navRef.current?.getBoundingClientRect()?.bottom || '64px',
                  left: dropdownPosition.left,
                  width: dropdownPosition.width
                }}
              >
                <div className="container mx-auto px-6 py-8 h-[90vh] overflow-y-auto">
                  <XIcon size={24} className="absolute top-4 right-4 cursor-pointer text-rose-500" onClick={() => setActiveDropdown(null)} />
                  <h2 className="text-2xl font-bold mb-2 text-black">{navItems[activeDropdown].submenu.title}</h2>
                  <p className="text-gray-600 mb-6">{navItems[activeDropdown].submenu.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {navItems[activeDropdown].submenu.columns.map((column, colIndex) => (
                      <div key={colIndex} className="space-y-4">
                        <h3 className="text-lg font-semibold text-black">{column.title}</h3>
                        <ul className="space-y-2">
                          {column.items.map((subItem, itemIndex) => (
                            <li key={itemIndex}>
                              <Link
                                href={subItem.href}
                                className="text-gray-700 hover:text-gray-900 transition-colors"
                                onClick={() => setActiveDropdown(null)}
                              >
                                {subItem.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-white border-t border-gray-100 fixed inset-x-0 top-24 bottom-0 overflow-y-auto z-40"
              >
                <div className="container mx-auto px-6 py-4">
                  {navItems.map((item, index) => (
                    <div key={item.name} className="mb-2">
                      {item.href ? (
                        <Link
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between w-full text-gray-700 hover:text-gray-900 py-3 hover:text-rose-500 transition-all duration-300"
                        >
                          <span>{item.name}</span>
                          {item.icon && <span className="ml-2">{item.icon}</span>}
                        </Link>
                      ) : (
                        <>
                          <button
                            onClick={() => item.submenu ? toggleDropdown(index) : setMobileMenuOpen(false)}
                            className="flex items-center justify-between w-full text-gray-700 hover:text-rose-500 transition-all duration-300 py-3"
                          >
                            <span>{item.name}</span>
                            {item.submenu && (
                              <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === index ? 'rotate-180' : ''}`} />
                            )}
                          </button>
                          
                          {item.submenu && activeDropdown === index && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              transition={{ duration: 0.2 }}
                              className="pl-4"
                            >
                              {item.submenu.columns.map((column, colIndex) => (
                                <div key={colIndex} className="mb-4">
                                  <h4 className="font-medium text-gray-800 mt-2 mb-1">{column.title}</h4>
                                  <ul>
                                    {column.items.map((subItem, itemIndex) => (
                                      <li key={itemIndex}>
                                        <Link
                                          href={subItem.href}
                                          onClick={() => setMobileMenuOpen(false)}
                                          className="block py-2 text-gray-600 hover:text-gray-900"
                                        >
                                          {subItem.name}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                  
                   <div className=" md:hidden items-center space-x-4 justify-center">
              <button className={`px-2 py-2 rounded-md transition-colors font-semibold cursor-pointer items-center flex  `}>
                <div className="flex items-center justify-center text-black hover:text-rose-500 transition-all duration-300">
                  <Link href="/login">
                    <UserIcon className="h-5 w-5" />
                  </Link>
                  
                </div>
              </button>
              </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
        <Slider />
      </div>
    </>
  );
};

export default Navbar;