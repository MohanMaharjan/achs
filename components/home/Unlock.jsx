'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

const UnlockYourself = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        duration: 0.8, 
        ease: [0.16, 0.77, 0.47, 0.97],
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } }
  };

  const scaleUp = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.8 } }
  };

  return (
    <section className="relative py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Decorative elements */}
      <motion.div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </motion.div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Header section */}
        <motion.div
          className="max-w-4xl mx-auto text-center mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            variants={itemVariants}
          >
            Unlock Your <span className="text-amber-400">Potential</span>
          </motion.h2>
          
          <motion.p 
            className="text-lg md:text-xl text-slate-300 mb-12 leading-relaxed"
            variants={itemVariants}
          >
            Your bachelor's journey at <span className="font-bold text-amber-400">ACHS</span> is more than education - it's a transformation into the leader of tomorrow.
          </motion.p>

          <motion.div variants={itemVariants}>
            <button className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0">
              Start Your Journey
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
          </motion.div>
        </motion.div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Feature cards */}
          <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                title: "Future-Ready Education",
                description: "Cutting-edge curriculum designed with industry experts to prepare you for emerging careers.",
                icon: "🧠",
                color: "amber"
              },
              {
                title: "Global Opportunities",
                description: "International collaborations and exchange programs to broaden your horizons.",
                icon: "🌍",
                color: "blue"
              },
              {
                title: "Innovation Labs",
                description: "State-of-the-art facilities for hands-on learning and research projects.",
                icon: "🔬",
                color: "amber"
              },
              {
                title: "Career Launchpad",
                description: "Dedicated placement cell with 90%+ placement rate in top companies.",
                icon: "🚀",
                color: "amber"
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className={`p-6 rounded-xl bg-white bg-opacity-5 backdrop-blur-sm border border-white border-opacity-10 shadow-md hover:shadow-lg transition-all`}
                variants={itemVariants}
                whileHover={{ 
                  y: -4,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: `rgba(var(--${item.color}-500), 0.3)`,
                  boxShadow: `0 10px 15px -3px rgba(var(--${item.color}-500), 0.1)`
                }}
              >
                <div className="flex items-start gap-5">
                  <motion.div 
                    className={`p-3 rounded-lg bg-${item.color}-500 bg-opacity-20 text-${item.color}-400`}
                    whileHover={{ rotate: [0, 10, -5, 0] }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="text-2xl">{item.icon}</span>
                  </motion.div>
                  <div>
                    <h3 className={`text-xl font-semibold text-gray-400 mb-2`}>{item.title}</h3>
                    <p className="text-slate-500">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Hero image */}
          <motion.div
            className="relative h-[500px] rounded-2xl overflow-hidden border-4 border-white border-opacity-10 shadow-xl"
            initial="hidden"
            whileInView="visible"
            variants={scaleUp}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Image
              src="/images/unlock.JPG"
              alt="ACHS vibrant campus life"
              fill
              className="object-cover"
              priority
              quality={100}
            />
            
            {/* Image overlay */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-800/40 to-transparent flex items-end p-8"
              initial="hidden"
              whileInView="visible"
              variants={fadeIn}
              viewport={{ once: true }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <motion.p 
                  className="text-xl font-semibold text-white mb-4"
                  animate={{
                    textShadow: ["0 0 8px rgba(255,255,255,0)", "0 0 12px rgba(255,255,255,0.3)", "0 0 8px rgba(255,255,255,0)"],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  Where Great Careers Begin
                </motion.p>
                <button className="px-6 py-2.5 bg-white hover:bg-amber-50 text-slate-900 font-medium rounded-lg shadow-md transition-all flex items-center">
                  Take Campus Tour
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
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Educational Journey Timeline */}
        <motion.div 
          className="mt-24"
          initial="hidden"
          whileInView="visible"
          variants={fadeIn}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl font-semibold text-white mb-3">Your Academic Journey</h3>
            <p className="text-slate-300 max-w-2xl mx-auto">A transformative path from foundation to career readiness</p>
          </div>

          <div className="relative h-[400px]">
            <svg 
              className="w-full h-full" 
              viewBox="0 0 1000 400" 
              preserveAspectRatio="none"
            >
              {/* Timeline path */}
              <motion.path
                d="M50,200 Q250,50 450,200 Q650,350 850,200 L950,200"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1.5 }}
                viewport={{ once: true }}
              />
              
              {/* Progress path */}
              <motion.path
                d="M50,200 Q250,50 450,200 Q650,350 850,200 L950,200"
                stroke="url(#timelineGradient)"
                strokeWidth="4"
                fill="none"
                strokeDasharray="8 4"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 0.3 }}
                viewport={{ once: true }}
              />

              <defs>
                <linearGradient id="timelineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>

              {/* Milestones */}
              {[
                { x: 50, y: 200, icon: "📚", title: "Foundation", color: "amber" },
                { x: 250, y: 50, icon: "🌐", title: "Exploration", color: "blue" },
                { x: 450, y: 200, icon: "🔍", title: "Specialization", color: "amber" },
                { x: 850, y: 200, icon: "🎓", title: "Graduation", color: "amber" }
              ].map((milestone, index) => (
                <g key={index} transform={`translate(${milestone.x},${milestone.y})`}>
                  {/* Animated circle */}
                  <motion.circle
                    cx="0"
                    cy="0"
                    r="24"
                    fill="white"
                    stroke={`var(--${milestone.color}-500)`}
                    strokeWidth="2"
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ 
                      scale: 1, 
                      opacity: 1,
                      transition: { 
                        delay: 0.5 + index * 0.2,
                        type: "spring",
                        stiffness: 300,
                        damping: 15
                      }
                    }}
                    viewport={{ once: true }}
                  />
                  
                  {/* Icon */}
                  <text 
                    x="0" 
                    y="8" 
                    textAnchor="middle" 
                    fontSize="16"
                    fill={`var(--${milestone.color}-500)`}
                  >
                    {milestone.icon}
                  </text>
                  
                  {/* Title */}
                  <text 
                    x="0" 
                    y="50" 
                    textAnchor="middle" 
                    fontSize="12" 
                    fontWeight="bold"
                    fill="white"
                  >
                    {milestone.title}
                  </text>
                </g>
              ))}

              {/* Animated YOU marker */}
              <motion.g
                initial={{ x: 0, y: 0 }}
                animate={{
                  x: [50, 250, 450, 850],
                  y: [200, 50, 200, 200],
                  transition: {
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                    times: [0, 0.33, 0.66, 1]
                  }
                }}
              >
                <motion.circle
                  cx="0"
                  cy="0"
                  r="12"
                  fill="#F59E0B"
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: 1,
                    transition: { delay: 1.5 }
                  }}
                />
                <text 
                  x="0" 
                  y="4" 
                  textAnchor="middle" 
                  fontSize="10" 
                  fill="white"
                  fontWeight="bold"
                >
                  YOU
                </text>
              </motion.g>
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default UnlockYourself;