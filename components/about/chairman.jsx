'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

const ChairmanMessage = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-gray-200 py-10 w-full">

  <div className="container mx-auto px-4 mb-10 ">
      <div className="tab-content">
        <div className="inner-contents">
          <motion.div 
            className="mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl font-bold text-gray-800 w-full text-center ">
              Message From <span className="text-amber-400">Chairman</span>
            </h2>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Image Column - appears second on mobile, first on desktop */}
            <motion.div 
              className="w-full md:w-4/12 order-1 md:order-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <figure className="shadow-lg rounded-lg overflow-hidden">
                <div className="relative h-80 w-full">
                  <Image
                    src="/images/chairman.jpg"
                    alt="Chairman's Photo"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <figcaption className="p-4 bg-white">
                  <h4 className="text-xl font-semibold text-gray-800">Mr. Dinesh Chandra Nakarmi</h4>
                  <p className="text-gray-600">Chairman</p>
                </figcaption>
              </figure>
            </motion.div>

            {/* Text Content - appears first on mobile, second on desktop */}
            <motion.div 
              className="w-full md:w-8/12 order-2 md:order-1"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Welcome to the Asian College of Higher Studies (ACHS), an innovative learning center. As Chairman, I'm delighted and grateful to be part of ACHS. Here, you're not just an individual; you're part of a supportive family that stands by you through every joy and challenge.
                </p>

                <p>
                  ACHS offers more than IT and Management studies. Students engage in Guest Lectures, Workshops, Seminars, and Co-curricular activities for holistic growth. Our scientific approach, from infrastructure to teaching methods, shapes students into market-ready professionals.
                </p>

                <p>
                  Ethics and morality are vital in today's world. ACHS emphasizes these values, fostering better individuals and professionals who catalyze positive societal and national change. ACHS is dedicated to its goals. With experienced faculty and committed management, we're reaching new heights. Join us in our innovative journey to transform our nation.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>      </div>
    
  );
};

export default ChairmanMessage;