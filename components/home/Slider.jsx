'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const Slider = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSlide, setExpandedSlide] = useState(null);

  // Fetch posts from your API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        
        if (data.posts && data.posts.length > 0) {
          // Filter posts to only include those with type 'slider'
          const sliderPosts = data.posts.filter(post => post.type === 'slider');
          
          const transformedSlides = sliderPosts.map((post, index) => ({
            id: post.id,
            title: post.title,
            description: post.content,
            buttonText: post.buttonText || 'Learn More',
            image: post.imageUrl ? `/uploads/${post.imageUrl}` : getDefaultImage(index),
            overlay: getOverlayClass(index),
            fullContent: post.fullContent || post.content // Add full content for expanded view
          }));
          
          setSlides(transformedSlides);
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
      '/images/default-slide-1.jpg',
      '/images/default-slide-2.jpg',
      '/images/default-slide-3.jpg',
      '/images/default-slide-4.jpg'
    ];
    return defaultImages[index % defaultImages.length];
  };

  // Overlay classes
  const getOverlayClass = (index) => {
    const overlays = [
      'bg-gradient-to-b from-black/70 via-black/40 to-transparent',
      'bg-gradient-to-b from-gray-900/70 via-gray-900/40 to-transparent',
      'bg-gradient-to-b from-blue-900/70 via-blue-900/40 to-transparent',
      'bg-gradient-to-b from-purple-900/70 via-purple-900/40 to-transparent'
    ];
    return overlays[index % overlays.length];
  };

  // Character animation for title
  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5
      }
    })
  };

  const nextSlide = () => {
    if (slides.length === 0) return;
    setDirection(1);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (slides.length === 0) return;
    setDirection(-1);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const toggleExpand = (index) => {
    setExpandedSlide(expandedSlide === index ? null : index);
  };

  // Auto-advance slides
  useEffect(() => {
    if (slides.length === 0 || expandedSlide !== null) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [currentSlide, slides, expandedSlide]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0
    })
  };

  if (isLoading) {
    return (
      <div className="absolute top-0 left-0 w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">Loading slides...</div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="absolute top-0 left-0 w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">No slider posts available</div>
      </div>
    );
  }

  return (
    <div className="absolute top-0 left-0 w-full h-screen overflow-hidden">
      {/* Main Slider View */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={slides[currentSlide].id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${slides[currentSlide].image})`
            }}
          >
            <div className={`absolute inset-0 ${slides[currentSlide].overlay}`}></div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Expanded Content View */}
      <AnimatePresence>
        {expandedSlide !== null && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-0 z-30 bg-white dark:bg-gray-900 overflow-y-auto"
          >
            <div className="container mx-auto px-6 py-20 relative">
              <button
                onClick={() => setExpandedSlide(null)}
                className="fixed top-4 right-4 z-40 bg-black/10 text-black dark:text-white p-2 rounded-full hover:bg-black/20 transition-colors"
                aria-label="Close expanded view"
              >
                <X size={24} />
              </button>
              
              <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  {slides[expandedSlide].title}
                </h1>
                
                <div className="h-0.5 bg-gray-200 dark:bg-gray-700 w-full mb-8"></div>
                
                <div className="prose dark:prose-invert max-w-none">
                  {slides[expandedSlide].fullContent}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content (visible when not expanded) */}
      {expandedSlide === null && (
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-6">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={slides[currentSlide].id}
                custom={direction}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl mx-auto text-center"
              >
                <h1 className="text-4xl md:text-5xl font-bold text-amber-400 mb-6 tracking-wider">
                  {slides[currentSlide].title.split('').map((char, i) => (
                    <motion.span
                      key={i}
                      custom={i}
                      variants={titleVariants}
                      initial="hidden"
                      animate="visible"
                      className="inline-block"
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                </h1>
                
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="h-0.5 bg-green-500 w-full max-w-md mx-auto mb-6"
                />
                
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-xl md:text-2xl text-green-400/90 mb-8 font-sans leading-relaxed"
                >
                  {slides[currentSlide].description}
                </motion.p>
                
               
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Navigation Arrows (visible when not expanded) */}
      {expandedSlide === null && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft size={32} />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight size={32} />
          </button>
        </>
      )}

      {/* Slide Indicators (visible when not expanded) */}
      {expandedSlide === null && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentSlide ? 1 : -1);
                setCurrentSlide(index);
              }}
              className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white w-6' : 'bg-white/50'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Slider;