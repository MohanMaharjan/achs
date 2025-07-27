import { motion } from 'framer-motion';
import { GraduationCap, IndianRupee, Award } from 'lucide-react';

const AcademicInfoSection = ({ program }) => {
  // Define content for each program
  const programData = {
    1: { // CSIT
      title: "BSc CSIT",
      requirements: [
        "10+2 or equivalent in science discipline with minimum of 50% or equivalent in aggregate from a recognized board.",
        "Applicants are required to appear in the entrance test conducted by Institute of Science and Technology, Tribhuwan University (IOST) and should secure pass marks to be eligible."
      ],
      fees: "NRs. 11,60,000",
      scholarships: [
        "Merit Scholarship: 10% of occupied quota as per the rules of TU",
        "Discounts available as per the grade of NEB."
      ]
    },
    2: { // BCA
      title: "BCA",
      requirements: [
        "10+2 or equivalent in any discipline with minimum of 45% or equivalent in aggregate from a recognized board.",
        "Applicants must pass the entrance examination conducted by the college."
      ],
      fees: "NRs. 7,50,000",
      scholarships: [
        "Merit Scholarship: 10% of occupied quota as per the rules of TU",
        "Discounts available as per the grade of NEB."
      ]
    },
    3: { // BBM
      title: "BBM",
      requirements: [
        "10+2 or equivalent in any discipline with minimum of 45% or equivalent in aggregate from a recognized board.",
        "No entrance examination required for admission."
      ],
      fees: "NRs. 6,00,000",
      scholarships: [
       "Merit Scholarship: 10% of occupied quota as per the rules of TU",
        "Discounts available as per the grade of NEB."
      ]
    },
    4: { // BBS
      title: "BBS",
      requirements: [
        "10+2 or equivalent in any discipline with minimum of 40% or equivalent in aggregate from a recognized board.",
        "Direct admission based on first-come-first-serve basis."
      ],
      fees: "NRs. 3,50,000",
      scholarships: [
        "Need-cum-merit scholarship available for 15% of students",
        "Special scholarship for female students"
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

  const itemAnimation = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="w-full bg-gray-50 mt-10 rounded-lg py-16">
      {/* Entry Requirements Section */}
      <section id="entry-requirements" className="container mx-auto px-4 mb-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
              variants={itemAnimation}
            >
              Entry <span className="text-amber-600">Requirements</span>
            </motion.h2>
            <div className="w-20 h-1 bg-amber-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* Requirements List */}
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-md"
              variants={fadeIn}
            >
              <div className="flex items-center mb-6">
                <GraduationCap className="text-blue-500 w-8 h-8 mr-4" />
                <h3 className="text-2xl font-semibold text-gray-800">Academic Requirements for {data.title}</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Entry requirements for this course are normally:
              </p>
              
              <motion.ul 
                className="space-y-4"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {data.requirements.map((requirement, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-start gap-3"
                    variants={itemAnimation}
                  >
                    <div className="bg-blue-100 p-1 rounded-full mt-1">
                      <div className={`w-2 h-2 ${index % 2 === 0 ? 'bg-amber-600' : 'bg-blue-600'} rounded-full`}></div>
                    </div>
                    <span className="text-gray-700">
                      {requirement}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Fees and Scholarships Section */}
      <section id="fees-scholarships" className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
              variants={itemAnimation}
            >
              Fee Structure & <span className="text-amber-600">Scholarships</span>
            </motion.h2>
            <div className="w-20 h-1 bg-amber-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Fee Structure */}
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-md"
              variants={fadeIn}
            >
              <div className="flex items-center mb-6">
                <IndianRupee className="text-blue-500 w-8 h-8 mr-4" />
                <h3 className="text-2xl font-semibold text-gray-800">{data.title} Fee Structure</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between pt-2">
                  <span className="text-gray-600 font-semibold">Total Fee including Admission</span>
                  <span className="text-blue-600 font-bold">{data.fees}</span>
                </div>
              </div>
            </motion.div>

            {/* Scholarships */}
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-md"
              variants={fadeIn}
            >
              <div className="flex items-center mb-6">
                <Award className="text-blue-500 w-8 h-8 mr-4" />
                <h3 className="text-2xl font-semibold text-gray-800">Scholarships</h3>
              </div>
              
              <motion.ul 
                className="space-y-4"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {data.scholarships.map((scholarship, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-start gap-3"
                    variants={itemAnimation}
                  >
                    <div className="bg-blue-100 p-1 rounded-full mt-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <span className="text-gray-700">
                      {scholarship}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default AcademicInfoSection;