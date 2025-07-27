'use client'
import React, { useEffect, useState } from 'react'
import { 
  Plus, 
  Loader2, 
  Edit, 
  Trash2, 
  FileText, 
  Download, 
  X 
} from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function CoursesPage() {
  // State management
  const [courses, setCourses] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [file, setFile] = useState(null)
  const [filePreview, setFilePreview] = useState('')
  const [formErrors, setFormErrors] = useState({})
  
  // Selection states
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedSemester, setSelectedSemester] = useState('')
  const [loadingCourses, setLoadingCourses] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    Lecture: '',
    Practical: '',
    description: '',
    departmentId: '',
    syllabus: '',
    semester: '1',
    year: new Date().getFullYear().toString()
  })
  const [editingCourse, setEditingCourse] = useState(null)

  // Semester options
  const semesterOptions = [
    { value: '1', label: 'First Semester' },
    { value: '2', label: 'Second Semester' },
    { value: '3', label: 'Third Semester' },
    { value: '4', label: 'Fourth Semester' },
    { value: '5', label: 'Fifth Semester' },
    { value: '6', label: 'Sixth Semester' },
    { value: '7', label: 'Seventh Semester' },
    { value: '8', label: 'Eighth Semester' }
  ]

  // Fetch departments
  const fetchDepartments = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/departments')
      if (!res.ok) throw new Error('Failed to fetch departments')
      const data = await res.json()
      setDepartments(data.departments)
      if (data.departments.length > 0) {
        setSelectedDepartment(data.departments[0].id.toString())
        setFormData(prev => ({ ...prev, departmentId: data.departments[0].id.toString() }))
      }
    } catch (err) {
      setError(err.message)
      toast.error(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Fetch courses
  const fetchCourses = async () => {
    if (!selectedDepartment || !selectedSemester) return
    setLoadingCourses(true)
    try {
      const res = await fetch(`/api/courses?departmentId=${selectedDepartment}&semester=${selectedSemester}`)
      if (!res.ok) throw new Error('Failed to fetch courses')
      const data = await res.json()
      setCourses(data.courses)
    } catch (err) {
      setError(err.message)
      toast.error(`Error: ${err.message}`)
    } finally {
      setLoadingCourses(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchDepartments()
  }, [])

  // Fetch courses when department or semester changes
  useEffect(() => {
    if (selectedDepartment && selectedSemester) fetchCourses()
  }, [selectedDepartment, selectedSemester])

  // Handle department change
  const handleDepartmentChange = (deptId) => {
    setSelectedDepartment(deptId)
    setSelectedSemester('') // Reset semester
    setCourses([]) // Clear courses
    setFormData(prev => ({ ...prev, departmentId: deptId }))
  }

  // Handle semester selection
  const handleSemesterSelect = (semester) => {
    setSelectedSemester(semester)
    setFormData(prev => ({ ...prev, semester }))
  }

  // Validate form
  const validateForm = () => {
    const errors = {}
    if (!formData.title.trim()) errors.title = 'Title is required'
    if (!formData.code.trim()) errors.code = 'Code is required'
    if (!formData.Lecture || isNaN(parseInt(formData.Lecture))) errors.Lecture = 'Valid lecture hours required'
    if (!formData.departmentId) errors.departmentId = 'Department is required'
    if (!formData.semester) errors.semester = 'Semester is required'
    if (!formData.year || isNaN(parseInt(formData.year))) errors.year = 'Valid year required'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Handle file upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!validTypes.includes(selectedFile.type)) {
      toast.error('Only PDF and DOCX files are allowed')
      return
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }
    setFile(selectedFile)
    setFilePreview(selectedFile.name)
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      toast.error('Please fix the form errors')
      return
    }
    setIsSubmitting(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title.trim())
      formDataToSend.append('code', formData.code.trim().toUpperCase())
      formDataToSend.append('Lecture', formData.Lecture)
      formDataToSend.append('Practical', formData.Practical || '0')
      formDataToSend.append('description', formData.description.trim())
      formDataToSend.append('departmentId', formData.departmentId)
      formDataToSend.append('semester', formData.semester)
      formDataToSend.append('year', formData.year)
      if (file) formDataToSend.append('syllabus', file)

      const url = editingCourse ? `/api/courses/${editingCourse.id}` : '/api/courses'
      const method = editingCourse ? 'PUT' : 'POST'
      const toastId = toast.loading(editingCourse ? 'Updating course...' : 'Creating course...')

      const res = await fetch(url, { method, body: formDataToSend })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to save course')
      }

      const data = await res.json()
      if (editingCourse) {
        setCourses(prev => prev.map(course => course.id === editingCourse.id ? data.course : course))
      } else {
        setCourses(prev => [data.course, ...prev])
      }

      toast.update(toastId, {
        render: editingCourse ? 'Course updated!' : 'Course created!',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      })
      setShowModal(false)
      resetForm()
    } catch (err) {
      toast.error(`Error: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle edit
  const handleEdit = (course) => {
    setEditingCourse(course)
    setFormData({
      title: course.title,
      code: course.code,
      Lecture: course.Lecture.toString(),
      Practical: course.Practical.toString(),
      description: course.description || '',
      departmentId: course.departmentId.toString(),
      syllabus: course.syllabus || '',
      semester: course.semester.toString(),
      year: course.year.toString()
    })
    setFilePreview(course.syllabus ? 'Existing file: ' + course.syllabus.split('/').pop() : '')
    setShowModal(true)
  }

  // Handle delete
  const confirmDelete = (course) => {
    setCourseToDelete(course)
    setShowDeleteModal(true)
  }

  const handleDelete = async () => {
    if (!courseToDelete) return
    try {
      const toastId = toast.loading('Deleting course...')
      const res = await fetch(`/api/courses/${courseToDelete.id}`, { method: 'DELETE' })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to delete course')
      }
      toast.update(toastId, {
        render: 'Course deleted!',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      })
      setCourses(prev => prev.filter(course => course.id !== courseToDelete.id))
      setShowDeleteModal(false)
      setCourseToDelete(null)
    } catch (err) {
      toast.error(`Error: ${err.message}`)
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      code: '',
      Lecture: '',
      Practical: '',
      description: '',
      departmentId: selectedDepartment || '',
      syllabus: '',
      semester: selectedSemester || '1',
      year: new Date().getFullYear().toString()
    })
    setFile(null)
    setFilePreview('')
    setEditingCourse(null)
    setFormErrors({})
  }

  // Download syllabus
  const downloadSyllabus = (syllabusUrl) => {
    window.open(syllabusUrl, '_blank')
  }

  // Get semester label
  const getSemesterLabel = (value) => {
    const semester = semesterOptions.find(s => s.value === value)
    return semester ? semester.label : `Semester ${value}`
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ToastContainer position="top-right" autoClose={5000} />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Course Management
        </h1>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  id="department"
                  value={selectedDepartment}
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>

              {selectedDepartment && (
                <div>
                  <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">
                    Semester
                  </label>
                  <select
                    id="semester"
                    value={selectedSemester}
                    onChange={(e) => handleSemesterSelect(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" disabled>Select Semester</option>
                    {semesterOptions.map(semester => (
                      <option key={semester.value} value={semester.value}>{semester.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {selectedSemester && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-medium">
                  {getSemesterLabel(selectedSemester)} Courses {courses.length > 0 && ` (${courses.length})`}
                </h2>
                <button
                  onClick={() => {
                    resetForm()
                    setShowModal(true)
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Course
                </button>
              </div>

              {loadingCourses ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              ) : courses.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No courses found for this semester. Add a new course to get started.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours (L/P)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Syllabus</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {courses.map(course => (
                        <tr key={course.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{course.title}</div>
                            {course.description && (
                              <div className="text-sm text-gray-500 mt-1">
                                {course.description.length > 50 ? `${course.description.substring(0, 50)}...` : course.description}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-gray-900 font-mono">{course.code}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-gray-900">{course.Lecture}h/{course.Practical}h</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {course.syllabus ? (
                              <button
                                onClick={() => downloadSyllabus(course.syllabus)}
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              >
                                <Download className="w-4 h-4" />
                                <span>Download</span>
                              </button>
                            ) : (
                              <span className="text-gray-500">No syllabus</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onClick={() => handleEdit(course)} className="text-blue-600 hover:text-blue-900 mr-4">
                              <Edit className="w-5 h-5" />
                            </button>
                            <button onClick={() => confirmDelete(course)} className="text-red-600 hover:text-red-900">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {editingCourse ? 'Edit Course' : 'Create Course'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      formErrors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {formErrors.title && <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>}
                </div>

                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                    Code *
                  </label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      formErrors.code ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {formErrors.code && <p className="mt-1 text-sm text-red-600">{formErrors.code}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="Lecture" className="block text-sm font-medium text-gray-700 mb-1">
                      Lecture Hours *
                    </label>
                    <input
                      type="number"
                      id="Lecture"
                      name="Lecture"
                      value={formData.Lecture}
                      onChange={handleInputChange}
                      min="0"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                        formErrors.Lecture ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                    {formErrors.Lecture && <p className="mt-1 text-sm text-red-600">{formErrors.Lecture}</p>}
                  </div>
                  <div>
                    <label htmlFor="Practical" className="block text-sm font-medium text-gray-700 mb-1">
                      Practical Hours
                    </label>
                    <input
                      type="number"
                      id="Practical"
                      name="Practical"
                      value={formData.Practical}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">
                    Semester *
                  </label>
                  <select
                    id="semester"
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      formErrors.semester ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  >
                    {semesterOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  {formErrors.semester && <p className="mt-1 text-sm text-red-600">{formErrors.semester}</p>}
                </div>

                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                    Year *
                  </label>
                  <input
                    type="number"
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    min="1"
                    max={new Date().getFullYear() + 1}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      formErrors.year ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {formErrors.year && <p className="mt-1 text-sm text-red-600">{formErrors.year}</p>}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="syllabus" className="block text-sm font-medium text-gray-700 mb-1">
                    Syllabus (PDF/DOCX)
                  </label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md border border-gray-300 w-full sm:w-auto">
                      <span>Choose File</span>
                      <input
                        type="file"
                        id="syllabus"
                        name="syllabus"
                        onChange={handleFileChange}
                        accept=".pdf,.docx"
                        className="hidden"
                      />
                    </label>
                    {filePreview && (
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {filePreview}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Max file size: 5MB</p>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      resetForm()
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                    ) : editingCourse ? 'Update Course' : 'Create Course'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Confirm Deletion</h2>
                <button onClick={() => setShowDeleteModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-700">
                Are you sure you want to delete the course: <span className="font-semibold">"{courseToDelete?.title}"</span>?
              </p>
              <p className="text-sm text-gray-500 mt-2">This action cannot be undone and will remove all associated data.</p>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}