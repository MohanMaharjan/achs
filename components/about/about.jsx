'use client'
import { motion } from 'framer-motion';
import Image from 'next/image';

const Mission = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
          {/* Vision & Mission Column */}
          <div className="w-full lg:w-5/12 lg:pe-12">
            <motion.div 
              className="mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-5xl   font-bold mb-4 text-gray-800">Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                To be an innovative global leader in imparting competitive, quality education by transforming lives that will change the world for the better, at whatever level of human endeavor they are involved in.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-5xl  font-bold mb-4 text-gray-800">Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                The mission of the IIMS Education Foundation is to develop citizens of integrity with the managerial expertise, vision, pragmatism, and ethical sensibility to succeed professionally and personally, both independently and collaboratively. Additionally, we intend to prepare leaders to face the challenges of a dynamic and diverse world, grounded in our ideals of excellence in education, the importance of community, and a commitment to service.
              </p>
            </motion.div>
          </div>

          {/* Image Column */}
          <div className="w-full lg:w-6/12 mb-8 lg:mb-0">
            <motion.div
              className="relative w-full h-96 lg:h-[500px] rounded-lg overflow-hidden shadow-lg"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Image
                src="/images/unlock.jpg"
                alt="IIMS College"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
          </div>
        </div>

        {/* Objectives Section */}
        <motion.div
          className="w-full mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-5xl  font-bold mb-6 text-gray-800 ">Objectives</h2>
          <ul className="space-y-2 pl-5">
            <li className="relative before:content-[''] before:absolute before:left-[-20px] before:top-2 before:w-2 before:h-2 before:bg-blue-500 before:rounded-full text-gray-600">
              To develop competent professionals committed to excellence in their personal and professional endeavors.
            </li>
            <li className="relative before:content-[''] before:absolute before:left-[-20px] before:top-2 before:w-2 before:h-2 before:bg-blue-500 before:rounded-full text-gray-600">
              To improve industry practices through research, training, and enrichment programs, thus making a meaningful contribution to the socio-economic development of Nepal.
            </li>
            <li className="relative before:content-[''] before:absolute before:left-[-20px] before:top-2 before:w-2 before:h-2 before:bg-blue-500 before:rounded-full text-gray-600">
              To serve as an intellectual resource base in Nepal, maintaining standards of excellence in every aspect of operation and becoming a role model for newly emerging centers of quality education.
            </li>
            <li className="relative before:content-[''] before:absolute before:left-[-20px] before:top-2 before:w-2 before:h-2 before:bg-blue-500 before:rounded-full text-gray-600">
              To provide comprehensive management and IT academic programs to students, involving them in industrial visits, conferences, projects, presentations, job orientations, and placements.
            </li>
          </ul>
        </motion.div>
      </div>
      
    </section>
    
  );
};

export default Mission;