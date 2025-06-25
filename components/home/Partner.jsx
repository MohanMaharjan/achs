'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const AccreditationSection = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Filter posts by type 'partners' and ensure they have an imageUrl
        const partnerPosts = data.posts.filter(post => 
          post.type === 'partners' && post.imageUrl
        );
        
        // Map to the required format for display
        const formattedPartners = partnerPosts.map(post => ({
          src: post.imageUrl ? `/uploads/${post.imageUrl}` : getDefaultImage(index),
          alt: post.title || 'Partner Logo',
          id: post.id,
          link: post.links || null
        }));
        
        setPartners(formattedPartners);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load partners data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
      scale: 1.05,
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      transition: { duration: 0.2 }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6 mx-auto"></div>
          <div className="h-12 bg-gray-200 rounded w-32 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div 
        className="flex flex-col lg:flex-row justify-between gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        {/* Text Content */}
        <motion.div className="lg:w-5/12" variants={itemVariants}>
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-4 text-center lg:text-left"
            variants={itemVariants}
          >
            <span className="text-amber-500">Our Accreditation</span> & Partners
          </motion.h2>
          
          <motion.p 
            className="text-md text-gray-600 mb-6"
            variants={itemVariants}
          >
            ACHS College, a leading IT and business college in Nepal, is accredited by top educational bodies.
          </motion.p>
         
          <button className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0">
            View All
            <motion.span 
              className="ml-2 inline-block"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </button>
        </motion.div>

        {/* Partners Logos */}
        <motion.div className="lg:w-6/12 lg:ps-8" variants={containerVariants}>
          {partners.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {partners.map((partner) => (
                <motion.div
                  key={partner.id}
                  className="flex items-center justify-center p-4 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all aspect-square"
                  variants={itemVariants}
                  whileHover="hover"
                >
                  {partner.link ? (
                    <a href={partner.link} target="_blank" rel="noopener noreferrer" className="w-full h-full">
                      <Image
                        src={partner.src}
                        alt={partner.alt}
                        width={160}
                        height={160}
                        className="object-contain w-full h-full p-2"
                      />
                    </a>
                  ) : (
                    <Image
                      src={partner.src}
                      alt={partner.alt}
                      width={160}
                      height={160}
                      className="object-contain w-full h-full p-2"
                    />
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-4">No partner information available</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Refresh
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AccreditationSection;