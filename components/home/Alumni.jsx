'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const AlumniSection = () => {
  const [selectedVideo, setSelectedVideo] = useState('');
  const [isHovered, setIsHovered] = useState(null);
  const [alumniVideos, setAlumniVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlumniVideos = async () => {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        
        if (data.posts && data.posts.length > 0) {
          // Filter posts by type 'students' and have a videoUrl
          const studentPosts = data.posts.filter(post => 
            post.type === 'students' && post.videoUrl
          );
          
          // Map to the required format
          const videos = studentPosts.map(post => ({
            id: post.id,
            videoUrl: post.videoUrl,
            title: post.title || 'Alumni Story',
            description: post.content || 'Hear from our alumni about their experience',
            imageUrl: post.imageUrl
          }));
          
          setAlumniVideos(videos);
          if (videos.length > 0) {
            setSelectedVideo(videos[0].videoUrl);
          }
        }
      } catch (err) {
        setError('Failed to load alumni videos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumniVideos();
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
      scale: 1.02,
      transition: { duration: 0.3 }
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p>Loading alumni stories...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  if (alumniVideos.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p>No alumni stories available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-4 text-center"
          >
            <span className="text-amber-500">Our</span> Alumni
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-lg text-gray-600 max-w-3xl mx-auto text-center mb-8"
          >
            With a widespread network of alumni spread across all continents, the Islington Experience reverberates
            throughout your career.
          </motion.p>
        </motion.div>

        {/* Combined Video and Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Player - Larger on desktop */}
          <div className="lg:col-span-2">
            <div className="relative pt-[56.25%] rounded-xl overflow-hidden shadow-lg bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* Video Selection - Compact List */}
          <div className="space-y-3 shadow-lg p-4">
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {alumniVideos.map((video) => (
                <motion.div
                  key={video.id}
                  onClick={() => setSelectedVideo(video.videoUrl)}
                  onMouseEnter={() => setIsHovered(video.id)}
                  onMouseLeave={() => setIsHovered(null)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedVideo === video.videoUrl 
                      ? 'bg-amber-50 border-l-4 border-amber-500' 
                      : 'bg-white hover:bg-gray-50'
                  }`}
                  variants={itemVariants}
                >
                  <div className="relative flex-shrink-0 w-16 h-16 rounded overflow-hidden">
                    {video.imageUrl ? (
                      <img 
                        src={video.imageUrl} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img 
                        src={`https://img.youtube.com/vi/${video.videoUrl}/mqdefault.jpg`} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{video.title}</h3>
                    <p className="text-gray-500 text-xs line-clamp-2">{video.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Layout - Stacked */}
        <div className="mt-8 md:hidden">
          <div className="flex overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar space-x-3">
            {alumniVideos.map((video) => (
              <motion.div
                key={video.id}
                onClick={() => setSelectedVideo(video.videoUrl)}
                className={`flex-shrink-0 w-32 rounded-lg overflow-hidden shadow-md transition-all ${
                  selectedVideo === video.videoUrl ? 'ring-2 ring-amber-500' : 'ring-1 ring-gray-200'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative pt-[56.25%]">
                  {video.imageUrl ? (
                    <img 
                      src={video.imageUrl} 
                      alt={video.title}
                      className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                  ) : (
                    <img 
                      src={`https://img.youtube.com/vi/${video.videoUrl}/mqdefault.jpg`} 
                      alt={video.title}
                      className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-2 bg-white">
                  <h3 className="font-medium text-xs line-clamp-2">{video.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Global CSS to hide scrollbars */}
        <style jsx global>{`
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </section>
  );
};

export default AlumniSection;