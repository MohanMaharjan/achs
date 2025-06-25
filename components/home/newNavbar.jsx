'use client'
import { BellDotIcon, ChevronDown, MenuIcon, XIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [openSubmenu, setOpenSubmenu] = useState(null)
    const [openDesktopSubmenu, setOpenDesktopSubmenu] = useState(null)

    const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
    const [displayText, setDisplayText] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)
    const sliderInterval = useRef(null)
    const textInterval = useRef(null)
    const controls = useAnimation()


     // Sample content for the hero slider
    const heroSlides = [
        {
            title: "Transform Your Future",
            description: "Join our innovative programs designed to prepare you for the challenges of tomorrow.",
            image: "/csit.jpg",
            cta: "Explore Programs",
            href: "/programs"
        },
        {
            title: "Vibrant Campus Life",
            description: "Experience a dynamic community with state-of-the-art facilities and endless opportunities.",
            image: "/images/holi.jpg",
            cta: "Discover Campus",
            href: "/campus-life"
        },
        {
            title: "World-Class Education",
            description: "Learn from distinguished faculty and industry leaders in your field of study.",
            image: "/images/graduation.jpg",
            cta: "Meet Our Faculty",
            href: "/about/faculty"
        }
    ]

    // Animated text effect
useEffect(() => {
    const currentSlide = heroSlides[currentSlideIndex];
    const fullText = currentSlide.title;
    
    // Reset display text when slide changes
    setDisplayText('');
    setIsDeleting(false);
    
    let currentIndex = 0;
    let timeoutId;

    const typeText = () => {
        if (currentIndex <= fullText.length) {
            setDisplayText(fullText.substring(0, currentIndex));
            currentIndex++;
            
            if (currentIndex > fullText.length) {
                // Pause at full text before deleting
                timeoutId = setTimeout(() => {
                    setIsDeleting(true);
                    deleteText();
                }, 2000);
            } else {
                textInterval.current = setTimeout(typeText, 100);
            }
        }
    };

    const deleteText = () => {
        if (currentIndex >= 0) {
            setDisplayText(fullText.substring(0, currentIndex));
            currentIndex--;
            
            if (currentIndex === 0) {
                setIsDeleting(false);
                // Move to next slide when deletion completes
                setCurrentSlideIndex(prev => 
                    prev === heroSlides.length - 1 ? 0 : prev + 1
                );
            } else {
                textInterval.current = setTimeout(deleteText, 50); // Faster deletion
            }
        }
    };

    typeText();

    return () => {
        clearTimeout(textInterval.current);
        clearTimeout(timeoutId);
    };
}, [currentSlideIndex]);


    // Auto-rotate slides
    useEffect(() => {
        sliderInterval.current = setInterval(() => {
            setCurrentSlideIndex((prev) => 
                prev === heroSlides.length - 1 ? 0 : prev + 1
            )
        }, 8000)
        
        return () => {
            clearInterval(sliderInterval.current)
        }
    }, [])

    // Animation controls for slide changes
    useEffect(() => {
        controls.start("visible")
    }, [currentSlideIndex, controls])

    const goToSlide = (index) => {
        setCurrentSlideIndex(index)
        clearInterval(sliderInterval.current)
        sliderInterval.current = setInterval(() => {
            setCurrentSlideIndex((prev) => 
                prev === heroSlides.length - 1 ? 0 : prev + 1
            )
        }, 8000)
    }

    

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 50);
        }

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const toggleSubmenu = (index) => {
        setOpenSubmenu(openSubmenu === index ? null : index);
    };

    const toggleDesktopSubmenu = (index) => {
        setOpenDesktopSubmenu(openDesktopSubmenu === index ? null : index);
    };

    const closeAllSubmenus = () => {
        setOpenSubmenu(null);
        setOpenDesktopSubmenu(null);
    };

    const nav = [
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
            icon: <BellDotIcon size={16}/> 
        },
    ]

    return (
        <>
            <div className={`w-full h-24 bg-transparent  fixed top-0 left-0 z-50 transition-all duration-300 ${isScrolled ? 'h-20 bg-white shadow-md text-gray-800/70' : 'h-24 !text-white'}`}>
                <div className='container mx-auto flex items-center h-full justify-between px-4'>
                    <Image 
                        src="/achs.png" 
                        alt="Logo" 
                        width={190} 
                        height={90} 
                        className={`object-contain transition-all duration-300 ${isScrolled ? 'h-20 ' : 'h-24'}`} 
                    />

                    <div className='flex items-center gap-4'>
                        <div className='hidden lg:flex items-center gap-8'>
                            <ul className="flex items-center gap-8 text-lg font-semibold  uppercase">
                                {nav.map((item, index) => (
                                    <li key={index} className='relative'>
                                        <div className='flex flex-col'>
                                            <Link 
                                                href={item.href || '#'}
                                                onClick={(e) => {
                                                    if (item.submenu) {
                                                        e.preventDefault();
                                                        toggleDesktopSubmenu(index);
                                                    } else {
                                                        closeAllSubmenus();
                                                    }
                                                }}
                                                className='flex items-center gap-2 relative hover:text-rose-600 transition-colors group-hover:rotate-180 duration-200'
                                            >
                                                {item.icon && item.icon}
                                                {item.name}
                                                {item.submenu && (
                                                    <ChevronDown 
                                                        size={16} 
                                                        className={`ml-1 transition-transform duration-200  ${openDesktopSubmenu === index ? 'rotate-180' : ''}`}
                                                    />
                                                )}
                                            </Link>
                                            
                                            {item.submenu && openDesktopSubmenu === index && (
                                                <>
                                                    {/* Backdrop */}
                                                    <div 
                                                        className="fixed inset-0 bg-black bg-opacity-30 z-40 backdrop-blur-sm"
                                                        onClick={closeAllSubmenus}
                                                    />
                                                    
                                                    {/* Mega Menu */}
                                                    <div className="fixed top-0 left-0 right-0 z-50 h-screen bg-white/90 backdrop-blur-3xl shadow-2xl  transition-all duration-300 ease-in-out">
                                                        <div className="container mx-auto p-8 top-[60px] relative">
                                                            <XIcon size={24} className="absolute top-0 right-4 cursor-pointer mb-10" onClick={closeAllSubmenus} />    
                                                            <div className="grid grid-cols-12 gap-8">
                                                                <div className="col-span-4">
                                                                    <div className="relative h-64 rounded-lg overflow-hidden">
                                                                        <Image 
                                                                            src={item.submenu.image} 
                                                                            alt={item.submenu.title}
                                                                            fill
                                                                            className="object-cover"
                                                                        />
                                                                    </div>
                                                                    <h3 className="text-2xl font-bold mt-4 text-gray-900">{item.submenu.title}</h3>
                                                                    <p className="text-gray-600 mt-2">{item.submenu.description}</p>
                                                                </div>
                                                                
                                                                <div className="col-span-8">
                                                                    <div className="grid grid-cols-3 gap-6">
                                                                        {item.submenu.columns.map((column, colIndex) => (
                                                                            <div key={colIndex} className="space-y-4">
                                                                                <h4 className="font-bold text-lg text-rose-600 border-b pb-2">{column.title}</h4>
                                                                                <ul className="space-y-3">
                                                                                    {column.items.map((subItem, subIndex) => (
                                                                                        <li key={subIndex}>
                                                                                            <Link 
                                                                                                href={subItem.href} 
                                                                                                className="block py-1.5 text-gray-700 hover:text-rose-600 transition-colors"
                                                                                                onClick={closeAllSubmenus}
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
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <button 
                                className='px-4 py-2 bg-rose-600 hover:bg-rose-500 rounded-lg text-white cursor-pointer transition-colors duration-200'
                                onClick={closeAllSubmenus}
                            >
                                Apply Now
                            </button>
                        </div>

                        <button 
                            className='lg:hidden p-2 rounded-lg focus:outline-none text-black'
                            onClick={() => {
                                setIsMobileMenuOpen(!isMobileMenuOpen);
                                closeAllSubmenus();
                            }}
                        >
                            {isMobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`lg:hidden fixed top-24 left-0 w-full h-[calc(100vh-6rem)] bg-white z-40 overflow-y-auto transition-all duration-300 ease-in-out transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <ul className="flex flex-col px-4 py-2 space-y-2">
                    {nav.map((item, index) => (
                        <li key={index} className='border-b border-gray-100'>
                            <div className='flex flex-col'>
                                <Link 
                                    href={item.href || '#'}
                                    onClick={(e) => {
                                        if (item.submenu) {
                                            e.preventDefault();
                                            toggleSubmenu(index);
                                        } else {
                                            setIsMobileMenuOpen(false);
                                        }
                                    }}
                                    className='flex items-center justify-between py-4 px-2 text-gray-800 font-medium hover:text-rose-600'
                                >
                                    <div className='flex items-center gap-2'>
                                        {item.icon && item.icon}
                                        {item.name}
                                    </div>
                                    {item.submenu && (
                                        <ChevronDown 
                                            size={16} 
                                            className={`transition-transform duration-200 ${openSubmenu === index ? 'rotate-180' : ''}`}
                                        />
                                    )}
                                </Link>
                                
                                {item.submenu && (
                                    <div 
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${openSubmenu === index ? 'max-h-[2000px]' : 'max-h-0'}`}
                                    >
                                        <div className="pl-6 pb-4 space-y-4">
                                            <div className="relative h-48 w-full rounded-lg overflow-hidden">
                                                <Image 
                                                    src={item.submenu.image}
                                                    alt={item.submenu.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900">{item.submenu.title}</h3>
                                            <p className="text-gray-600 text-sm">{item.submenu.description}</p>
                                            
                                            <div className="space-y-6">
                                                {item.submenu.columns.map((column, colIndex) => (
                                                    <div key={colIndex} className="space-y-2">
                                                        <h4 className="font-semibold text-gray-800">{column.title}</h4>
                                                        <ul className="space-y-2 pl-2">
                                                            {column.items.map((subItem, subIndex) => (
                                                                <li key={subIndex}>
                                                                    <Link 
                                                                        href={subItem.href} 
                                                                        className='block py-1.5 text-gray-600 hover:text-rose-600 transition-colors'
                                                                        onClick={() => setIsMobileMenuOpen(false)}
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
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                    <li className='mt-4'>
                        <button 
                            className='w-full py-3 bg-rose-600 hover:bg-rose-500 rounded-lg text-white cursor-pointer transition-colors duration-200'
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Apply Now
                        </button>
                    </li>
                </ul>
            </div>

            {/* Backdrop for mobile menu */}
            {isMobileMenuOpen && (
                <div 
                    className='lg:hidden fixed inset-0 bg-white bg-opacity-50 z-30'
                    onClick={() => {
                        setIsMobileMenuOpen(false);
                        closeAllSubmenus();
                    }}
                />
            )}


             {/* Hero Slider Section */}
           
            <div className="relative w-full h-screen  overflow-hidden">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentSlideIndex}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1 },
                            exit: { opacity: 0 }
                        }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0"
                    >
                        <div className="grid grid-cols-1  h-full ">
                            {/* Content Column - Enhanced with better spacing */}
                            <div className="flex flex-col justify-center p-8 lg:p-16 bg-gradient-to-r from-white to-white/90 z-10 absolute top-30 left-2 lg:left-24 ">
                                <motion.h1 
                                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 "
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5 }}
                                    key={`title-${currentSlideIndex}`}
                                >
                                    {displayText}
                                    <motion.span 
                                        animate={{ opacity: [0, 1, 0] }}
                                        transition={{ repeat: Infinity, duration: 1 }}
                                        className="ml-1"
                                    >
                                        |
                                    </motion.span>
                                </motion.h1>
                                
                                <motion.p 
                                    className="text-lg md:text-xl text-gray-600 mb-8 w-full"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                >
                                    {heroSlides[currentSlideIndex].description}
                                </motion.p>
                                
                                <motion.div
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.6, duration: 0.5 }}
                                >
                                    <Link 
                                        href={heroSlides[currentSlideIndex].href}
                                        className="inline-flex items-center px-8 py-3.5 bg-rose-600 hover:bg-rose-500 rounded-lg text-white font-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
                                    >
                                        {heroSlides[currentSlideIndex].cta}
                                        <ChevronDown size={20} className="ml-2 -rotate-90" />
                                    </Link>
                                </motion.div>
                            </div>
                            
                            {/* Image Column - Redesigned with zoom animation */}
                            <div className="relative block overflow-hidden">
                                <motion.div
                                    initial={{ scale: 1.1 }}
                                    animate={{ scale: 1 }}
                                    transition={{ 
                                        duration: 8, 
                                        ease: "linear",
                                        repeat: Infinity,
                                        repeatType: "reverse"
                                    }}
                                    className="absolute inset-0"
                                >
                                    <Image
                                        src={heroSlides[currentSlideIndex].image}
                                        alt={heroSlides[currentSlideIndex].title}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </motion.div>
                                
                                {/* Enhanced gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-l from-black/10 via-black/5 to-transparent" />
                                
                                {/* Floating elements animation */}
                                <motion.div 
                                    className="absolute bottom-8 right-8 flex space-x-2"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                >
                                    {Array(3).fill(0).map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="w-2 h-2 bg-white rounded-full"
                                            animate={{ 
                                                y: [0, -10, 0],
                                                opacity: [0.6, 1, 0.6]
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                delay: i * 0.3
                                            }}
                                        />
                                    ))}
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
                
                {/* Enhanced Slider Controls */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                    {heroSlides.map((_, index) => (
                        <motion.button
                            key={index}
                            onClick={() => goToSlide(index)}
                            whileHover={{ scale: 1.2 }}
                            className={`w-3 h-3 rounded-full transition-all ${currentSlideIndex === index ? 'bg-rose-600 w-8' : 'bg-rose-600'}`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
                
                {/* Enhanced Navigation Arrows */}
                <motion.button 
                    onClick={() => goToSlide(
                        currentSlideIndex === 0 ? 
                        heroSlides.length - 1 : 
                        currentSlideIndex - 1
                    )}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg z-10 transition-all"
                    aria-label="Previous slide"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <ChevronDown size={28} className="rotate-90 text-gray-800" />
                </motion.button>
                
                <motion.button 
                    onClick={() => goToSlide(
                        currentSlideIndex === heroSlides.length - 1 ? 
                        0 : 
                        currentSlideIndex + 1
                    )}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg z-10 transition-all"
                    aria-label="Next slide"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <ChevronDown size={28} className="-rotate-90 text-gray-800" />
                </motion.button>
            </div>


        </>
    )
}

export default Navbar