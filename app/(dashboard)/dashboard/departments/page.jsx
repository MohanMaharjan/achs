'use client'
import React, { useEffect, useState } from 'react'
import { 
  Plus, 
  Loader2, 
  Edit, 
  Trash2, 
  Calendar, 
  FileText,
  Filter,
  X,
  Check
} from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function DepartmentsPage() {
  // State management
  const [departments, setDepartments] = useState([])
  const [filteredDepartments, setFilteredDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [departmentToDelete, setDepartmentToDelete] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [shouldShowAll, setShouldShowAll] = useState(true)
  
  // Form state
  const [departmentName, setDepartmentName] = useState('')
  const [editingDepartment, setEditingDepartment] = useState(null)

  // Fetch departments
  const fetchDepartments = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/departments')
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to fetch departments')
      setDepartments(data.departments)
      setFilteredDepartments(data.departments)
      setShouldShowAll(true) // Show all departments after refresh or initial load
    } catch (err) {
      setError(err.message)
      toast.error(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchDepartments()
  }, [])

  // Filter departments based on search term
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredDepartments(shouldShowAll ? departments : departments.slice(0, 1))
    } else {
      setFilteredDepartments(
        departments.filter(dept => 
          dept.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }
  }, [searchTerm, departments, shouldShowAll])

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const url = editingDepartment 
        ? `/api/departments/${editingDepartment.id}` 
        : '/api/departments'
      const method = editingDepartment ? 'PUT' : 'POST'

      const toastId = toast.loading(
        editingDepartment ? 'Updating department...' : 'Creating department...'
      )

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: departmentName })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to save department')

      // Update departments state
      if (editingDepartment) {
        setDepartments(prev => prev.map(dept => 
          dept.id === editingDepartment.id ? data.department : dept
        ))
      } else {
        setDepartments(prev => [data.department, ...prev])
      }

      toast.update(toastId, {
        render: editingDepartment ? 'Department updated!' : 'Department created!',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      })

      setShowModal(false)
      resetForm()
      setShouldShowAll(false) // Show only the created/edited department
    } catch (err) {
      toast.error(`Error: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Department actions
  const handleEdit = (department) => {
    setEditingDepartment(department)
    setDepartmentName(department.name)
    setShowModal(true)
  }

  const confirmDelete = (department) => {
    setDepartmentToDelete(department)
    setShowDeleteModal(true)
  }

  const handleDelete = async () => {
    if (!departmentToDelete) return
    
    try {
      const toastId = toast.loading('Deleting department...')
      
      const res = await fetch(`/api/departments/${departmentToDelete.id}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to delete department')
      }

      toast.update(toastId, {
        render: 'Department deleted!',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      })

      setDepartments(prev => prev.filter(dept => dept.id !== departmentToDelete.id))
      setShowDeleteModal(false)
      setDepartmentToDelete(null)
      setShouldShowAll(true) // Show remaining departments
    } catch (err) {
      toast.error(`Error: ${err.message}`)
    }
  }

  // Reset form
  const resetForm = () => {
    setDepartmentName('')
    setEditingDepartment(null)
  }

  // Show all departments
  const showAllDepartments = () => {
    setShouldShowAll(true)
    setSearchTerm('')
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ToastContainer position="top-right" autoClose={5000} />
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Department Management
        </h1>
        <button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Department
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          <p>{error}</p>
        </div>
      )}

      {/* Search Filter */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
          {!shouldShowAll && (
            <button
              onClick={showAllDepartments}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Show All Departments
            </button>
          )}
          <span className="text-sm text-gray-500 whitespace-nowrap">
            {filteredDepartments.length} {filteredDepartments.length === 1 ? 'department' : 'departments'}
          </span>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        /* Departments Table */
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDepartments.length > 0 ? (
                  filteredDepartments.map((department) => (
                    <tr key={department.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {department.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-gray-500">
                          <Calendar className="flex-shrink-0 h-4 w-4 mr-1" />
                          <span className="text-sm">
                            {new Date(department.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(department)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => confirmDelete(department)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                      No departments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {editingDepartment ? 'Edit Department' : 'Create Department'}
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
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
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
                    ) : editingDepartment ? (
                      'Update Department'
                    ) : (
                      'Create Department'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Confirm Deletion
                </h2>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-gray-700">
                  Are you sure you want to delete the department:{" "}
                  <span className="font-semibold">"{departmentToDelete?.name}"</span>?
                </p>
                <p className="text-sm text-gray-500">
                  This action cannot be undone.
                </p>

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
        </div>
      )}
    </div>
  )
}