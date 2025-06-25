'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const ACHEXPERIENCE = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(null);

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        
        if (data.posts && data.posts.length > 0) {
          // Filter posts to only include those with type 'gallery'
          const galleryPosts = data.posts.filter(post => post.type === 'gallery');
          
          // Transform posts into event format
          const transformedEvents = galleryPosts.map((post, index) => ({
            id: post.id,
            title: post.title,
            description: post.content,
            year: post.publishedAt ? new Date(post.publishedAt).getFullYear().toString() : '2023',
            image: post.imageUrl ? `/uploads/${post.imageUrl}` : getDefaultImage(index),
            link: `/experience/${post.id}`,
            position: getGridPosition(index, galleryPosts.length),
            imageDescription: post.content.substring(0, 100) + '...'
          }));
          
          setEvents(transformedEvents);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Default images
  const getDefaultImage = (index) => {
    const defaultImages = [
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    ];
    return defaultImages[index % defaultImages.length];
  };

// Determine grid position based on index
const getGridPosition = (index, total) => {
  if (total === 1) return 'col-span-4 row-span-2';
  if (index === 0) return 'col-span-2 row-span-2';
  
  // For totals of 3, 5, or 6+ items, make the last two items span 2 columns each
  if ((total >= 3 && index >= total - 2) || 
      (total === 5 && index >= 3)) {
    return 'col-span-2 row-span-1';
  }
  
  return 'col-span-1 row-span-1';
};
  // Auto-rotate carousel on mobile
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768 && events.length > 0) {
      const interval = setInterval(() => {
        setActiveIndex((prevIndex) => 
          prevIndex === events.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [events.length]);

  const handleIndicatorClick = (index) => {
    setActiveIndex(index);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.03,
      transition: { duration: 0.3 }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    hover: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    hover: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 }
    }
  };

  if (isLoading) {
    return (
      <section className="relative w-full min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl">Loading gallery posts...</div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="relative w-full min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl">No gallery posts available</div>
      </section>
    );
  }

  return (
    <section className="relative w-full min-h-screen bg-white overflow-hidden">
      <div className="relative z-10 w-full h-full">
        <div className="container mx-auto px-6 py-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-20"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-5xl md:text-6xl font-bold mb-6 text-gray-800"
            >
              THE ACHS <span className="text-amber-400">Experience</span>
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-gray-500 max-w-4xl mx-auto leading-relaxed"
            >
              Immerse yourself in the vibrant campus life at ACHS. Beyond academics, discover a world of cultural celebrations,
              innovative showcases, and unforgettable memories that shape your journey.
            </motion.p>
          </motion.div>

          {/* Desktop Gallery */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="hidden md:grid grid-cols-4 grid-rows-2 gap-6 mb-20 w-full"
          >
            {events.map((event) => (
              <motion.div
                key={event.id}
                variants={itemVariants}
                whileHover="hover"
                onHoverStart={() => setIsHovering(event.id)}
                onHoverEnd={() => setIsHovering(null)}
                className={`relative rounded-2xl overflow-hidden shadow-2xl ${event.position} h-full min-h-[300px] transition-all duration-300`}
              >
                <Link href={event.link} className="block h-full group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
                    <h3 className="text-2xl font-bold text-white">
                      {event.title} <span className="text-blue-300">{event.year}</span>
                    </h3>
                  </div>
                  
                  <motion.div
                    initial="hidden"
                    animate={isHovering === event.id ? "hover" : "hidden"}
                    variants={contentVariants}
                    className="absolute inset-0 flex flex-col justify-end p-8 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent"
                  >
                    <motion.h3 variants={textVariants} className="text-3xl font-bold text-white mb-2">
                      {event.title} <span className="text-blue-300">{event.year}</span>
                    </motion.h3>
                    <motion.div variants={textVariants} className="w-16 h-1 bg-blue-400 my-4" />
                    <motion.p variants={textVariants} className="text-gray-200 mb-4">
                      {event.description}
                    </motion.p>
                    <motion.div variants={textVariants} className="text-sm text-gray-300 italic">
                      {event.imageDescription}
                    </motion.div>
                    <motion.div 
                      variants={textVariants}
                      className="mt-4 text-blue-300 font-medium flex items-center"
                    >
                      Learn more
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Mobile Carousel */}
          <div className="md:hidden mb-16 w-full">
            <div className="relative w-full h-96 overflow-hidden rounded-xl shadow-lg">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: index === activeIndex ? 1 : 0,
                    zIndex: index === activeIndex ? 10 : 0,
                    scale: index === activeIndex ? 1 : 0.95
                  }}
                  transition={{ 
                    opacity: { duration: 0.5 },
                    scale: { duration: 0.3 }
                  }}
                  className={`absolute inset-0 ${index === activeIndex ? 'block' : 'hidden'}`}
                >
                  <Link href={event.link} className="block h-full">
                    <div className="relative h-full">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover"
                        priority={index === activeIndex}
                      />
                      <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
                        <h3 className="text-2xl font-bold text-white">
                          {event.title} <span className="text-blue-300">{event.year}</span>
                        </h3>
                        <div className="w-12 h-1 bg-blue-400 my-3" />
                        <p className="text-gray-200 mb-2">
                          {event.description}
                        </p>
                        <div className="text-gray-300 text-sm italic">
                          {event.imageDescription}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
              
              <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center space-x-2">
                {events.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleIndicatorClick(index)}
                    className="relative w-10 h-1 rounded-full overflow-hidden bg-white/30"
                    aria-label={`Go to slide ${index + 1}`}
                  >
                    {index === activeIndex && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 3, ease: 'linear' }}
                        className="absolute top-0 left-0 h-full bg-white rounded-full"
                        onAnimationComplete={() => {
                          if (index === activeIndex) {
                            setActiveIndex((prev) => 
                              prev === events.length - 1 ? 0 : prev + 1
                            );
                          }
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* See More Button */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <button className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0">
              Experience ACHS Life
              <motion.span 
                className="ml-2 inline-block"
                animate={{ x: [0, 4, 0] }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity 
                }}
              >
                →
              </motion.span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ACHEXPERIENCE;