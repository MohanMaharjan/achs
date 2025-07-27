'use client'
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const LifeAtACHS = () => {
  // Event gallery data
  const events = [
    {
      id: 1,
      title: "Orientation Program 2023",
      date: "March 15, 2023",
      description: "Welcoming our new batch of students with an exciting orientation program",
      photos: [
        "/gallery/orientation-1.jpg",
        "/gallery/orientation-2.jpg",
        "/gallery/orientation-3.jpg",
        "/gallery/orientation-4.jpg",
        "/gallery/orientation-5.jpg",
      ]
    },
    {
      id: 2,
      title: "Tech Fest 2023",
      date: "May 20-22, 2023",
      description: "Annual technology festival showcasing student projects and innovations",
      photos: [
        "/gallery/techfest-1.jpg",
        "/gallery/techfest-2.jpg",
        "/gallery/techfest-3.jpg",
        "/gallery/techfest-4.jpg",
      ]
    },
    {
      id: 3,
      title: "Sports Week",
      date: "October 10-15, 2023",
      description: "Inter-department sports competition with various games and activities",
      photos: [
        "/gallery/sports-1.jpg",
        "/gallery/sports-2.jpg",
        "/gallery/sports-3.jpg",
        "/gallery/sports-4.jpg",
        "/gallery/sports-5.jpg",
        "/gallery/sports-6.jpg",
      ]
    },
    {
      id: 4,
      title: "Cultural Festival",
      date: "December 5, 2023",
      description: "Celebrating our diverse culture through music, dance and art",
      photos: [
        "/gallery/cultural-1.jpg",
        "/gallery/cultural-2.jpg",
        "/gallery/cultural-3.jpg",
      ]
    }
  ];

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Open modal with selected event and photo index
  const openModal = (event, index = 0) => {
    setCurrentEvent(event);
    setCurrentPhotoIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  // Navigate photos in modal
  const navigatePhotos = (direction) => {
    if (direction === 'prev') {
      setCurrentPhotoIndex(prev => 
        prev === 0 ? currentEvent.photos.length - 1 : prev - 1
      );
    } else {
      setCurrentPhotoIndex(prev => 
        prev === currentEvent.photos.length - 1 ? 0 : prev + 1
      );
    }
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const galleryItem = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Life at <span className='text-amber-600'>ACHS</span></h1>
        <div className="w-24 h-1 bg-amber-500 mx-auto mb-6"></div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Explore the vibrant campus life at ACHS through our events, activities, and student experiences.
          Our community thrives on learning, creativity, and collaboration.
        </p>
      </motion.section>

      {/* Events Gallery */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="max-w-7xl mx-auto"
      >
        {events.map((event) => (
          <motion.div 
            key={event.id}
            variants={fadeIn}
            className="mb-20"
          >
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{event.title}</h2>
              <p className="text-amber-600 font-medium">{event.date}</p>
              <p className="text-gray-600 mt-2">{event.description}</p>
            </div>

            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {event.photos.slice(0, 4).map((photo, index) => (
                <motion.div
                  key={index}
                  variants={galleryItem}
                  className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md"
                  onClick={() => openModal(event, index)}
                >
                  <img 
                    src={photo} 
                    alt={`${event.title} ${index + 1}`}
                    className="w-full h-48 md:h-64 object-cover transform group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition duration-300 flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition duration-300 text-lg font-medium">
                      View
                    </span>
                  </div>
                </motion.div>
              ))}
              {event.photos.length > 4 && (
                <motion.div
                  variants={galleryItem}
                  className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md"
                  onClick={() => openModal(event, 4)}
                >
                  <div className="w-full h-48 md:h-64 bg-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-700">+{event.photos.length - 4}</p>
                      <p className="text-gray-600">More photos</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Other Campus Life Sections */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="max-w-7xl mx-auto mb-20"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Campus Facilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Modern Labs",
              description: "State-of-the-art computer and science laboratories equipped with latest technology",
              icon: "🔬"
            },
            {
              title: "Library",
              description: "Well-stocked library with thousands of books, journals, and digital resources",
              icon: "📚"
            },
            {
              title: "Sports Complex",
              description: "Indoor and outdoor sports facilities including basketball court and gymnasium",
              icon: "⚽"
            },
            {
              title: "Cafeteria",
              description: "Spacious cafeteria serving healthy and hygienic food options",
              icon: "🍽️"
            },
            {
              title: "Auditorium",
              description: "Fully equipped auditorium for seminars, workshops, and cultural events",
              icon: "🎤"
            },
            {
              title: "Student Lounge",
              description: "Comfortable spaces for students to relax and collaborate between classes",
              icon: "🛋️"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={galleryItem}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Student Testimonials */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="max-w-7xl mx-auto mb-20"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Student Experiences</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              name: "Riya Sharma",
              program: "BSc CSIT, 3rd Year",
              quote: "ACHS has provided me with countless opportunities to grow both academically and personally. The faculty is extremely supportive and the campus environment is very conducive to learning.",
              image: "/students/riya.jpg"
            },
            {
              name: "Amit Gurung",
              program: "BBM, 2nd Year",
              quote: "The practical approach to learning at ACHS has helped me understand business concepts better. The industry visits and guest lectures are particularly valuable.",
              image: "/students/amit.jpg"
            },
            {
              name: "Sneha Thapa",
              program: "BCA, Final Year",
              quote: "I've had the chance to work on real-world projects and participate in hackathons that have boosted my confidence and technical skills significantly.",
              image: "/students/sneha.jpg"
            },
            {
              name: "Rajiv Shrestha",
              program: "BBS, Alumni",
              quote: "The holistic education I received at ACHS prepared me well for my professional career. The soft skills training was as valuable as the academic curriculum.",
              image: "/students/rajiv.jpg"
            }
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              variants={galleryItem}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
            >
              <div className="flex items-start mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-amber-400">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{testimonial.name}</h3>
                  <p className="text-amber-600">{testimonial.program}</p>
                </div>
              </div>
              <p className="text-gray-600 italic">"{testimonial.quote}"</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Photo Gallery Modal */}
      {isModalOpen && currentEvent && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          onClick={closeModal}
        >
          <div 
            className="relative max-w-6xl w-full max-h-screen"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 text-white text-2xl hover:text-amber-400 transition"
            >
              <FiX />
            </button>

            <div className="flex flex-col h-full">
              <div className="text-white mb-4">
                <h3 className="text-xl md:text-2xl font-bold">{currentEvent.title}</h3>
                <p className="text-gray-300">{currentPhotoIndex + 1} / {currentEvent.photos.length}</p>
              </div>

              <div className="relative flex-grow">
                <img 
                  src={currentEvent.photos[currentPhotoIndex]} 
                  alt={`${currentEvent.title} ${currentPhotoIndex + 1}`}
                  className="w-full h-full max-h-[70vh] object-contain"
                />

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigatePhotos('prev');
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
                >
                  <FiChevronLeft size={28} />
                </button>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigatePhotos('next');
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
                >
                  <FiChevronRight size={28} />
                </button>
              </div>

              <div className="mt-4 flex overflow-x-auto py-2">
                {currentEvent.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Thumbnail ${index + 1}`}
                    className={`w-16 h-16 object-cover mr-2 cursor-pointer ${currentPhotoIndex === index ? 'ring-2 ring-amber-400' : 'opacity-70'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentPhotoIndex(index);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LifeAtACHS;