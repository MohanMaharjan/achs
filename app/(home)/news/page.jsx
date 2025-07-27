'use client';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const LatestNews = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNews, setSelectedNews] = useState(null);
  const itemsPerPage = 4;

  // Fetch news posts from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        
        if (data.posts && data.posts.length > 0) {
          const newsPosts = data.posts
            .filter(post => post.isPublished && (post.type === 'news' || post.type === 'event'))
            .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
          
          const transformedNews = newsPosts.map(post => ({
            id: post.id,
            date: post.publishedAt ? new Date(post.publishedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            title: post.title,
            image: post.imageUrl ? `/uploads/${post.imageUrl}` : getDefaultImage(),
            content: post.content || 'No content available',
            author: post.author || 'Admin',
            alt: post.title,
            type: post.type
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

  const getDefaultImage = () => {
    const defaultImages = [
      'https://islington.edu.np/images/blog-images/international_exposure/thumbnail.jpg',
      'https://islington.edu.np/images/blog-images/women-in-it/thumbnail.png',
      'https://islington.edu.np/images/blog-images/a-level__banner.png'
    ];
    return defaultImages[Math.floor(Math.random() * defaultImages.length)];
  };

  // Pagination logic
  const totalPages = Math.ceil(newsItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = newsItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openNewsModal = (newsItem) => {
    setSelectedNews(newsItem);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  const closeNewsModal = () => {
    setSelectedNews(null);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  // Animation variants
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

  const modalVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      y: 50,
      transition: { duration: 0.2 }
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50" id="mustloadOne">
        <div className="container mx-auto px-4">
          <div className="flex justify-center mb-8">
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
          <div className="flex justify-center mb-8">
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
          className="flex justify-center mb-8" 
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
        </motion.div>

        {/* News Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {currentItems.map((item) => (
            <motion.div
              key={item.id}
              className="h-full"
              variants={itemVariants}
              whileHover="hover"
            >
              <button 
                onClick={() => openNewsModal(item)}
                className="block group h-full w-full text-left"
              >
                <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-md text-xs font-medium">
                      {item.type === 'news' ? 'News' : 'Event'}
                    </div>
                  </div>
                  <div className="p-6 flex-grow">
                    <span className="text-gray-500 text-sm">{item.date}</span>
                    <h3 className="text-xl font-semibold mt-2 mb-4 line-clamp-2">{item.title}</h3>
                    <div className="mt-auto">
                      <span className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium">
                        Read More
                        <span className="ml-1 inline-block">→</span>
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => paginate(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                &larr; Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-3 py-1 rounded-md ${currentPage === number 
                    ? 'bg-amber-500 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                >
                  {number}
                </button>
              ))}

              <button
                onClick={() => paginate(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                Next &rarr;
              </button>
            </nav>
          </div>
        )}

        {/* News Detail Modal */}
        <AnimatePresence>
            {selectedNews && (
                <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                >
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <motion.div
                    initial={{ scale: 0.9, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, y: 20, opacity: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative" // Added relative here
                    >
                    {/* Image Section with Close Button */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative h-64 w-full overflow-hidden"
                    >
                        {/* Close Button - Positioned absolutely within image container */}
                        <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={closeNewsModal}
                        className="absolute top-4 right-4 z-20 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors" // Increased z-index to 20
                        >
                        <X size={24} className="text-gray-800" />
                        </motion.button>

                        <Image
                        src={selectedNews.image || getDefaultImage()}
                        alt={selectedNews.alt || 'News image'}
                        fill
                        className="object-cover"
                        priority
                        />
                        <div className="absolute bottom-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-md text-sm font-medium z-10">
                        {selectedNews.type === 'news' ? 'News' : 'Event'}
                        </div>
                    </motion.div>

                    {/* Content Section */}
                    <motion.div 
                        className="overflow-y-auto p-6 md:p-8"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {/* Meta Information */}
                        <div className="flex justify-between items-start mb-4 text-sm text-gray-500">
                        <span>{selectedNews.date || 'No date available'}</span>
                        <span>By {selectedNews.author || 'Admin'}</span>
                        </div>
                        
                        {/* Title */}
                        <motion.h2 
                        className="text-3xl font-bold mb-6 text-gray-800"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        >
                        {selectedNews.title || 'No title available'}
                        </motion.h2>
                        
                        {/* Content */}
                        <motion.div
                        className="prose max-w-none text-gray-700"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        dangerouslySetInnerHTML={{ __html: selectedNews.content || '<p>No content available</p>' }}
                        />
                    </motion.div>
                    </motion.div>
                </div>
                </motion.div>
            )}
            </AnimatePresence>
      </div>
    </section>
  );
};

export default LatestNews;