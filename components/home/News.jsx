'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const LatestNews = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);

  // Fetch news posts from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        
        if (data.posts && data.posts.length > 0) {
          // Filter posts to only include published news/events
          const newsPosts = data.posts
            .filter(post => post.isPublished && (post.type === 'news' || post.type === 'event'))
            .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
            .slice(0, 8); // Limit to 8 most recent
          
          // Transform posts into news item format
          const transformedNews = newsPosts.map(post => ({
            id: post.id,
            date: post.publishedAt ? new Date(post.publishedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            title: post.title,
            image: post.imageUrl ? `/uploads/${post.imageUrl}` : getDefaultImage(),
            link: post.links || `/news/${post.id}`,
            alt: post.title
          }));
          
          setNewsItems(transformedNews);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Default image fallback
  const getDefaultImage = () => {
    const defaultImages = [
      'https://islington.edu.np/images/blog-images/international_exposure/thumbnail.jpg',
      'https://islington.edu.np/images/blog-images/women-in-it/thumbnail.png',
      'https://islington.edu.np/images/blog-images/a-level__banner.png'
    ];
    return defaultImages[Math.floor(Math.random() * defaultImages.length)];
  };

  // Auto-scroll effect
  useEffect(() => {
    if (!autoScroll || isHovering || newsItems.length === 0) return;

    const container = containerRef.current;
    if (!container) return;

    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    const maxScroll = scrollWidth - clientWidth;

    const interval = setInterval(() => {
      setScrollPosition(prev => {
        const newPosition = prev + 1;
        if (newPosition >= maxScroll) {
          return 0; // Reset to start when reaching end
        }
        return newPosition;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [autoScroll, isHovering, newsItems.length]);

  // Apply scroll position
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [scrollPosition]);

  const handleScroll = (direction) => {
    const container = containerRef.current;
    if (!container) return;

    const scrollAmount = 400;
    const newPosition = direction === 'left' 
      ? Math.max(container.scrollLeft - scrollAmount, 0)
      : Math.min(container.scrollLeft + scrollAmount, container.scrollWidth - container.clientWidth);

    setScrollPosition(newPosition);
    setAutoScroll(false);
    setTimeout(() => setAutoScroll(true), 10000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
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

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50" id="mustloadOne">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-5xl md:text-5xl font-bold mb-6 text-gray-800">
              News And <span className="text-amber-400">Events</span>
            </h2>
          </div>
          <div className="text-center py-12">Loading news...</div>
        </div>
      </section>
    );
  }

  if (newsItems.length === 0) {
    return (
      <section className="py-16 bg-gray-50" id="mustloadOne">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-5xl md:text-5xl font-bold mb-6 text-gray-800">
              News And <span className="text-amber-400">Events</span>
            </h2>
          </div>
          <div className="text-center py-12">No news available at the moment</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50" id="mustloadOne">
      <div className="container mx-auto px-4">
        <motion.div 
          className="flex justify-between items-center mb-8" 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.h2 
            variants={itemVariants}
            className="text-5xl md:text-5xl font-bold mb-6 text-gray-800"
          >
            News And <span className="text-amber-400">Events</span>
          </motion.h2>
          <Link href="/news" passHref>
            <button className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0">
              View all News
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
          </Link>
        </motion.div>

        {/* News Container with Horizontal Scroll */}
        <div className="relative">
          {/* Scrollable Container with hidden scrollbar */}
          <motion.div
            ref={containerRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-6 py-4 no-scrollbar"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {newsItems.map((item) => (
              <motion.div
                key={item.id}
                className="flex-shrink-0 w-80 md:w-72 snap-start"
                variants={itemVariants}
              >
                <Link href={item.link} className="block group h-full">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.alt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-6 flex-grow">
                      <span className="text-gray-500 text-sm">{item.date}</span>
                      <h3 className="text-xl font-semibold mt-2 mb-4 line-clamp-2">{item.title}</h3>
                      <div className="text-blue-600 font-medium flex items-center mt-auto">
                        <button className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0">
                          Read More
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
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Navigation Arrows */}
          {newsItems.length > 0 && (
            <>
              <button 
                onClick={() => handleScroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
                aria-label="Scroll left"
              >
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={() => handleScroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
                aria-label="Scroll right"
              >
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Global CSS to hide scrollbars */}
      <style jsx global>{`
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;  /* Chrome, Safari and Opera */
        }
      `}</style>
    </section>
  );
};

export default LatestNews;