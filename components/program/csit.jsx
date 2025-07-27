import { motion } from 'framer-motion';
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';
import { FaCheckCircle } from 'react-icons/fa';
import FEE from "@/components/program/fee";

const CombinedBlock = ({ program }) => {
  // Program data configuration
  const programData = {
    1: { // CSIT
      title: "BSc CSIT",
      testimonial: {
        quote: "As technology advances, business will need individuals who are comfortable in client situations, making collaborative efforts to solve information technology problems across a wide range of business sectors. Our B.Sc. CSIT courses provides students with a thorough understanding of core topics in computer science – both theoretical and practical alongside a wide range of technical and analytical skills.",
        name: "Er. Pranaya Nakarmi",
        position: "CSIT Co-ordinator",
        image: "/images/pranaya.jpg"
      },
      highlights: [
        "Multidisciplinary course with opportunities for exciting extra courses beyond the CSIT syllabus",
        "Gain highly sought-after skills in programming, databases, networking, web development, and security",
        "Hands-on learning in well-equipped modern labs to apply theoretical concepts",
        "Apply classroom knowledge to real-world scenarios through extracurricular activities",
        "Gain industry experience through co-operative placement internships"
      ]
    },
    2: { // BCA
      title: "BCA",
      testimonial: {
        quote: "The Bachelor of Computer Applications program prepares students for the ever-evolving IT industry with a strong foundation in computer applications. Our curriculum blends theoretical knowledge with practical skills, focusing on software development, database management, and web technologies to create competent IT professionals.",
        name: "Er. Pranaya Nakarmi",
        position: "BCA Coordinator",
        image: "/images/pranaya.jpg"
      },
      highlights: [
        "Focus on application development and software engineering principles",
        "Practical training in modern programming languages and development tools",
        "Industry-aligned curriculum with regular updates",
        "Opportunities for internships with leading IT companies",
        "Strong foundation for higher studies in computer applications"
      ]
    },
    3: { // BBM
      title: "BBM",
      testimonial: {
        quote: "Our Bachelor of Business Management program develops future business leaders with a perfect blend of theoretical knowledge and practical skills. The curriculum covers all essential aspects of modern business management, preparing students to face real-world business challenges with confidence.",
        name: "Shreejana Shahi, CHE",
        position: "BBM Co-ordinator",
        image: "/images/shreejana.jpg"
      },
      highlights: [
        "Comprehensive coverage of all business management disciplines",
        "Case-study based learning approach",
        "Industry interaction through guest lectures and corporate visits",
        "Entrepreneurship development focus",
        "Practical training in business analytics and decision-making"
      ]
    },
    4: { // BBS
      title: "BBS",
      testimonial: {
        quote: "The Bachelor of Business Studies program offers a broad understanding of business operations with flexibility to specialize in areas of interest. Our program emphasizes critical thinking, problem-solving, and decision-making skills essential for business success in today's dynamic environment.",
        name: "Dr. Sunita Thapa",
        position: "BBS Program Head",
        image: "/images/sunita.jpg"
      },
      highlights: [
        "Broad-based business education with specialization options",
        "Focus on developing analytical and decision-making skills",
        "Regular industry-academia interaction programs",
        "Practical exposure through business simulations",
        "Strong foundation for professional courses like CA, ACCA"
      ]
    }
  };

  // Get data for selected program or default to CSIT if not found
  const data = programData[program] || programData[1];

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
        staggerChildren: 0.2
      }
    }
  };

  const highlightItem = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Testimonial Block */}
        <motion.div 
          variants={fadeIn}
          className="bg-white rounded-xl shadow-lg relative p-6 md:p-8 h-full"
        >
          <FaQuoteLeft className="absolute top-6 left-6 text-amber-400 text-3xl md:text-4xl" />
          
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 relative z-10 h-full">
            <div className="flex-1">
              <blockquote className="text-md text-gray-700 italic pl-8 pr-8">
                {data.testimonial.quote}
              </blockquote>
            </div>

            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-blue-100">
                <img 
                  src={data.testimonial.image} 
                  alt={data.testimonial.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center md:text-left">
                <h4 className="text-xl font-semibold text-gray-800">{data.testimonial.name}</h4>
                <p className="text-amber-600 font-bold text-2xl">{data.testimonial.position}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Program Highlights Block */}
        <motion.div 
          variants={fadeIn}
          className="bg-white rounded-xl shadow-lg p-6 md:p-8 h-full"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">{data.title} Program Highlights</h3>
          
          <motion.ul 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            {data.highlights.map((highlight, index) => (
              <motion.li 
                key={index}
                variants={highlightItem}
                className="flex items-start gap-3"
              >
                <FaCheckCircle className="text-amber-500 mt-1 flex-shrink-0" />
                <span className="text-gray-700">
                  {highlight}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </motion.div>

      <FEE program={program} />
    </div>
  );
};

export default CombinedBlock;