'use client'
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import CSIT from "@/components/program/csit"

const Program = () => {
  const searchParams = useSearchParams();
  const departmentId = searchParams.get('departmentId');
  
  const [program, setProgram] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [selectedSyllabus, setSelectedSyllabus] = useState(null);
  const [expandedSemesters, setExpandedSemesters] = useState(new Set());

  // Default description that can be overridden by API data
  const defaultDescription = `B.Sc. CSIT (Bachelor of Science in Computer Science and Information Technology) is a four years / 8 Semesters / 126 credit hours course that offers intensive courses in Computer Science and Information Technology. This course allows you to specialise in the subject of your choice. During the final semester with lots emphasis on practical based learning, the course gives you ample opportunities to pursue your career anywhere in the world.`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (departmentId) {
          const programRes = await fetch(`/api/departments/${departmentId}`);
          if (!programRes.ok) throw new Error('Failed to fetch program');
          const programData = await programRes.json();
          setProgram(programData.data || programData);
          
          const coursesRes = await fetch(`/api/courses?departmentId=${departmentId}`);
          if (!coursesRes.ok) throw new Error('Failed to fetch courses');
          const coursesData = await coursesRes.json();
          setCourses(coursesData.data || coursesData.courses || coursesData || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [departmentId]);

  const toggleSemester = (semester) => {
    const newExpanded = new Set(expandedSemesters);
    if (newExpanded.has(semester)) {
      newExpanded.delete(semester);
    } else {
      newExpanded.add(semester);
    }
    setExpandedSemesters(newExpanded);
    setSelectedSemester(semester);
  };

  const semesters = [...new Set(courses?.map(course => course?.semester) || [])].sort((a, b) => a - b);
  const filteredCourses = courses?.filter(course => course?.semester === selectedSemester) || [];

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  const courseItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.1 }
    })
  };

  const semesterVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto' }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen ">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen  flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <section className="container mx-auto px-4 py-12">
        {/* Program Header */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="bg-white rounded-xl shadow-lg overflow-hidden mb-8"
        >
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-8 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {program?.department?.name || program?.name || 'Program Details'}
            </h1>
            <div className="w-20 h-1 bg-blue-300 mb-6"></div>
            <p className="text-blue-100 leading-relaxed">
              {program?.description || defaultDescription}
            </p>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.article
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Semester Accordion */}
          {semesters.length > 0 ? (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
                Program Curriculum
              </h2>
              
              <div className="space-y-4">
                {semesters.map(semester => (
                  <div key={semester} className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md">
                    <button
                      onClick={() => toggleSemester(semester)}
                      className="w-full flex justify-between items-center p-5 text-left bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">
                          {semester}
                        </div>
                        <span className="font-medium text-gray-800">Semester {semester}</span>
                      </div>
                      <svg
                        className={`w-5 h-5 text-blue-600 transform transition-transform ${
                          expandedSemesters.has(semester) ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {expandedSemesters.has(semester) && (
                      <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={semesterVariants}
                        transition={{ duration: 0.3 }}
                        className="bg-white"
                      >
                        <div className="p-5 pt-0">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4 pl-2 border-l-4 border-blue-500">
                            Courses for Semester {semester}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {courses
                              ?.filter(course => course?.semester === semester)
                              ?.map((course, index) => (
                                <motion.div
                                  key={course.id || index}
                                  custom={index}
                                  initial="hidden"
                                  animate="visible"
                                  variants={courseItemVariants}
                                  className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg border border-gray-200 transition-colors"
                                >
                                  <div className="flex items-start">
                                    <div className="bg-blue-100 p-2 rounded-lg mr-4">
                                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                      </svg>
                                    </div>
                                    <div>
                                      <h4 className="text-lg font-medium text-gray-800">{course.title}</h4>
                                      <p className="text-blue-600 font-mono text-sm mb-2">{course.code}</p>
                                      {course.description && (
                                        <p className="text-gray-600 text-sm mb-3">{course.description}</p>
                                      )}
                                      <div className="flex flex-wrap gap-3 text-sm">
                                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                          Lecture: {course.lecture || course.Lecture}hrs
                                        </span>
                                        {(course.practical || course.Practical) > 0 && (
                                          <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded">
                                            Practical: {course.practical || course.Practical}hrs
                                          </span>
                                        )}
                                      </div>
                                      {course.syllabus && (
                                        <button
                                          onClick={() => setSelectedSyllabus(course.syllabus)}
                                          className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                                        >
                                          View Syllabus
                                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                          </svg>
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-xl font-medium text-gray-900">No courses found</h3>
              <p className="mt-2 text-gray-500">No courses available for this program yet.</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Refresh
              </button>
            </div>
          )}
        </motion.article>

        {/* PDF Viewer Modal */}
        {selectedSyllabus && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col">
              <div className="flex justify-between items-center p-5 border-b">
                <h3 className="text-xl font-semibold text-gray-800">Syllabus Viewer</h3>
                <button
                  onClick={() => setSelectedSyllabus(null)}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1">
                <iframe 
                  src={`${selectedSyllabus}#view=fitH`}
                  className="w-full h-full border-0"
                  title="PDF Viewer"
                >
                  <p className="p-4">Your browser does not support PDFs. 
                    <a href={selectedSyllabus} className="text-blue-600 hover:text-blue-800 ml-1">Download the PDF</a> instead.
                  </p>
                </iframe>
              </div>
            </div>
          </div>
        )}
      </section>
      <CSIT program={departmentId}/>
    </div>
  );
};

export default Program;