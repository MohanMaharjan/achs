'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const TeachingMethodology = () => {
  return (
    <section className="py-12 md:py-20 bg-gray-300">
      <div className="container mx-auto px-4">
        {/* Teaching Methodology Section */}
        <div className="flex flex-col lg:flex-row items-stretch gap-8 mb-16">
          {/* Methodology Content */}
          <motion.div
            className="w-full lg:w-1/2 bg-white rounded-xl shadow-lg p-6 md:p-8"
            initial={{ rotateY: 90, opacity: 0 }}
            whileInView={{ rotateY: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: 'spring' }}
          >
            <h2 className="text-3xl md:text-5xl  font-bold mb-6 text-gray-800">
              TEACHING <span className="text-amber-400">METHODOLOGY</span>
            </h2>
            
            <div className="mb-8">
              <p className="text-lg text-gray-600 mb-8">
                We employ a globally recognized three-tiered instructional framework that bridges theory and practice.
              </p>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {/* Lecture */}
                <motion.div 
                  variants={fadeIn}
                  className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500"
                >
                  <h3 className="font-bold text-lg text-blue-700 mb-2">Lecture</h3>
                  <p className="text-gray-700 text-sm">
                    Expert-led theoretical instruction for foundational knowledge.
                  </p>
                </motion.div>

                {/* Practical */}
                <motion.div 
                  variants={fadeIn}
                  transition={{ delay: 0.1 }}
                  className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500"
                >
                  <h3 className="font-bold text-lg text-green-700 mb-2">Practical</h3>
                  <p className="text-gray-700 text-sm">
                    Hands-on sessions to develop tangible skills.
                  </p>
                </motion.div>

                {/* Training */}
                <motion.div 
                  variants={fadeIn}
                  transition={{ delay: 0.2 }}
                  className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500"
                >
                  <h3 className="font-bold text-lg text-purple-700 mb-2">Training</h3>
                  <p className="text-gray-700 text-sm">
                    Real-world simulations for professional readiness.
                  </p>
                </motion.div>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg">
                <h3 className="font-bold text-lg text-gray-800 mb-3">Key Outcomes:</h3>
                <ul className="space-y-2">
                  <motion.li variants={fadeIn} className="flex items-start">
                    <span className="inline-block bg-blue-100 text-blue-800 p-1 rounded-full mr-2 mt-1">
                      ✓
                    </span>
                    <span className="text-gray-700">
                      <strong>Knowledge Mastery</strong> through lectures
                    </span>
                  </motion.li>
                  <motion.li 
                    variants={fadeIn}
                    transition={{ delay: 0.1 }}
                    className="flex items-start"
                  >
                    <span className="inline-block bg-green-100 text-green-800 p-1 rounded-full mr-2 mt-1">
                      ✓
                    </span>
                    <span className="text-gray-700">
                      <strong>Skill Proficiency</strong> via practical sessions
                    </span>
                  </motion.li>
                  <motion.li 
                    variants={fadeIn}
                    transition={{ delay: 0.2 }}
                    className="flex items-start"
                  >
                    <span className="inline-block bg-purple-100 text-purple-800 p-1 rounded-full mr-2 mt-1">
                      ✓
                    </span>
                    <span className="text-gray-700">
                      <strong>Industry Readiness</strong> through training
                    </span>
                  </motion.li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Methodology Image */}
          <motion.div
            className="w-full lg:w-1/2 relative"
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="absolute inset-0 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/images/campuslife.jpg"
                alt="Teaching Methodology"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </motion.div>
        </div>

        
      </div>
    </section>
  )
}

export default TeachingMethodology