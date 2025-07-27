'use client'
import React, { useEffect, useState } from 'react'
import { 
  Plus, 
  Loader2, 
  Edit, 
  Trash2, 
  Filter,
  X,
  Check,
  Key,
  ShieldAlert
} from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function PermissionsPage() {
  // State management
  const [permissions, setPermissions] = useState([])
  const [filteredPermissions, setFilteredPermissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [permissionToDelete, setPermissionToDelete] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form state
  const [permissionName, setPermissionName] = useState('')
  const [permissionDescription, setPermissionDescription] = useState('')
  const [editingPermission, setEditingPermission] = useState(null)

  // Fetch permissions
  const fetchPermissions = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/permissions')
      
      if (!response.ok) {
        throw new Error('Failed to fetch permissions')
      }
      
      const data = await response.json()
      setPermissions(data.permissions)
      setFilteredPermissions(data.permissions)
    } catch (err) {
      setError(err.message)
      toast.error(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchPermissions()
  }, [])

  // Filter permissions based on search term
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredPermissions(permissions);
    } else {
      setFilteredPermissions(
        permissions.filter(permission => 
          permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          permission.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, permissions]);

  // Reset form
  const resetForm = () => {
    setPermissionName('')
    setPermissionDescription('')
    setEditingPermission(null)
  }

  // Load permission data for editing
  const handleEdit = (permission) => {
    setEditingPermission(permission)
    setPermissionName(permission.name)
    setPermissionDescription(permission.description || '')
    setShowModal(true)
  }

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const url = editingPermission 
        ? `/api/permissions/${editingPermission.id}` 
        : '/api/permissions'
      const method = editingPermission ? 'PUT' : 'POST'

      const toastId = toast.loading(
        editingPermission ? 'Updating permission...' : 'Creating permission...'
      )

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: permissionName,
          description: permissionDescription
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to save permission')

      // Update permissions state
      if (editingPermission) {
        setPermissions(prev => prev.map(perm => 
          perm.id === editingPermission.id ? data.permission : perm
        ))
      } else {
        setPermissions(prev => [data.permission, ...prev])
      }

      toast.update(toastId, {
        render: editingPermission ? 'Permission updated!' : 'Permission created!',
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

  // Delete confirmation
  const confirmDelete = (permission) => {
    setPermissionToDelete(permission)
    setShowDeleteModal(true)
  }

  const handleDelete = async () => {
    if (!permissionToDelete) return
    
    try {
      const toastId = toast.loading('Deleting permission...')
      
      const res = await fetch(`/api/permissions/${permissionToDelete.id}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to delete permission')
      }

      toast.update(toastId, {
        render: 'Permission deleted!',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      })

      setPermissions(prev => prev.filter(perm => perm.id !== permissionToDelete.id))
      setShowDeleteModal(false)
      setPermissionToDelete(null)
    } catch (err) {
      toast.error(`Error: ${err.message}`)
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ToastContainer position="top-right" autoClose={5000} />
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <Key className="w-5 h-5" />
          Permission Management
        </h1>
        <button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Permission
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
              placeholder="Search permissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
          <span className="text-sm text-gray-500 whitespace-nowrap">
            {filteredPermissions.length} {filteredPermissions.length === 1 ? 'permission' : 'permissions'}
          </span>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        /* Permissions Table */
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Used in Roles
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPermissions.length > 0 ? (
                  filteredPermissions.map((permission) => (
                    <tr key={permission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {permission.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-500 max-w-xs truncate">
                          {permission.description || 'No description'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-500">
                          {permission.roles?.length || 0} roles
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(permission)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => confirmDelete(permission)}
                          className="text-red-600 hover:text-red-900"
                          disabled={permission.roles?.length > 0}
                          title={permission.roles?.length > 0 ? "Cannot delete - assigned to roles" : ""}
                        >
                          <Trash2 className={`w-5 h-5 ${permission.roles?.length > 0 ? 'opacity-50 cursor-not-allowed' : ''}`} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      No permissions found
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
                  {editingPermission ? 'Edit Permission' : 'Create Permission'}
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
                    value={permissionName}
                    onChange={(e) => setPermissionName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={permissionDescription}
                    onChange={(e) => setPermissionDescription(e.target.value)}
                    rows={3}
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
                    ) : editingPermission ? (
                      'Update Permission'
                    ) : (
                      'Create Permission'
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
                  Are you sure you want to delete the permission:{" "}
                  <span className="font-semibold">"{permissionToDelete?.name}"</span>?
                </p>
                
                {permissionToDelete?.roles?.length > 0 && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <ShieldAlert className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          This permission is assigned to {permissionToDelete.roles.length} role(s). 
                          Deleting it will remove it from all roles.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-sm text-red-500 font-medium">
                  Warning: This action cannot be undone.
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