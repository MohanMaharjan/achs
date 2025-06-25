'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState, useEffect } from 'react'

const Programs = () => {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch('/api/posts')
        const data = await response.json()
        
        if (data.posts && data.posts.length > 0) {
          // Filter posts by type 'program'
          const programPosts = data.posts.filter(post => post.type === 'program')
          
          // Transform posts into program format
          const transformedPrograms = programPosts.map(post => ({
            id: post.id,
            title: post.title,
            description: post.content.length > 100 ? `${post.content.substring(0, 100)}...` : post.content,
            image: post.imageUrl ? `/uploads/${post.imageUrl}` : getDefaultImage(post.id),
            bgColor: getColorClass(post.id),
            textColor: 'text-white'
          }))
          
          setPrograms(transformedPrograms)
        }
      } catch (error) {
        console.error('Error fetching programs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPrograms()
  }, [])

  // Default images if no image is provided
  const getDefaultImage = (id) => {
    const defaultImages = [
      '/csit.jpg',
      '/bbm.jpg',
      '/bca.jpg',
      '/images/graduation.jpg'
    ]
    return defaultImages[id % defaultImages.length]
  }

  // Alternating background colors
  const getColorClass = (id) => {
    const colors = [
      'bg-amber-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-indigo-500'
    ]
    return colors[id % colors.length]
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-16 min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-gray-600">Loading programs...</p>
        </div>
      </div>
    )
  }

  if (programs.length === 0) {
    return (
      <div className="container mx-auto px-4 pt-16 min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">No programs available</h2>
          <p className="mt-2 text-gray-600">Check back later for our academic programs</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 pt-16">
      <div className="text-center mb-12">
        <motion.h2 
          className="text-3xl md:text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Our <span className="text-amber-500">Academic Programs</span>
        </motion.h2>
        <motion.p 
          className="text-gray-600 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Discover our range of professionally designed programs that prepare students for successful careers.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {programs.map((program, index) => (
          <motion.div
            key={program.id}
            className="relative group overflow-hidden rounded-lg h-[400px] shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {/* Image - Upper Half (50%) */}
            <div className="absolute top-0 left-0 w-full h-1/2 overflow-hidden">
              <Image
                src={program.image}
                alt={program.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            
            {/* Title - Lower Half (50%) */}
            <div className={`absolute bottom-0 left-0 w-full h-1/2 ${program.bgColor} ${program.textColor} flex items-center p-6 transition-all duration-300`}>
              <h3 className="text-xl font-bold">{program.title}</h3>
            </div>

            {/* Hover Content - Slides Up */}
            <div className={`absolute top-full left-0 w-full h-full ${program.bgColor} ${program.textColor} p-6 transition-all duration-500 ease-in-out group-hover:-translate-y-full`}>
              <div className="h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-4">{program.title}</h3>
                  <p className="text-sm opacity-90 mb-6">{program.description}</p>
                </div>
                <button className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0">
                  Learn More
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
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Programs

