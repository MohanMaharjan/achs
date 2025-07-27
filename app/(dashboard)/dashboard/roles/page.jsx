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
  Check,
  Shield,
  Key
} from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function RolesPage() {
  // State management
  const [roles, setRoles] = useState([])
  const [permissions, setPermissions] = useState([])
  const [filteredRoles, setFilteredRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form state
  const [roleName, setRoleName] = useState('')
  const [roleDescription, setRoleDescription] = useState('')
  const [selectedPermissions, setSelectedPermissions] = useState([])
  const [editingRole, setEditingRole] = useState(null)

  // Fetch roles and permissions
  const fetchData = async () => {
    setLoading(true)
    try {
      const [rolesRes, permissionsRes] = await Promise.all([
        fetch('/api/roles'),
        fetch('/api/permissions')
      ])
      
      if (!rolesRes.ok || !permissionsRes.ok) {
        throw new Error('Failed to fetch data')
      }
      
      const rolesData = await rolesRes.json()
      const permissionsData = await permissionsRes.json()
      
      setRoles(rolesData.roles)
      setFilteredRoles(rolesData.roles)
      setPermissions(permissionsData.permissions)
    } catch (err) {
      setError(err.message)
      toast.error(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchData()
  }, [])

  // Filter roles based on search term
useEffect(() => {
  if (searchTerm === '') {
    setFilteredRoles(roles);
  } else {
    setFilteredRoles(
      roles.filter(role => 
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }
}, [searchTerm, roles]);

  // Toggle permission selection
  const togglePermission = (permissionId) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    )
  }

  // Reset form
  const resetForm = () => {
    setRoleName('')
    setRoleDescription('')
    setSelectedPermissions([])
    setEditingRole(null)
  }

  // Load role data for editing
  const handleEdit = (role) => {
    setEditingRole(role)
    setRoleName(role.name)
    setRoleDescription(role.description || '')
    setSelectedPermissions(role.permissions.map(p => p.id))
    setShowModal(true)
  }

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const url = editingRole 
        ? `/api/roles/${editingRole.id}` 
        : '/api/roles'
      const method = editingRole ? 'PUT' : 'POST'

      const toastId = toast.loading(
        editingRole ? 'Updating role...' : 'Creating role...'
      )

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: roleName,
          description: roleDescription,
          permissionIds: selectedPermissions
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to save role')

      // Update roles state
      if (editingRole) {
        setRoles(prev => prev.map(role => 
          role.id === editingRole.id ? data.role : role
        ))
      } else {
        setRoles(prev => [data.role, ...prev])
      }

      toast.update(toastId, {
        render: editingRole ? 'Role updated!' : 'Role created!',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      })
      // Wait for the toast to show before reloading
    setTimeout(() => {
      window.location.reload()
    }, 2000)


      setShowModal(false)
      resetForm()
    } catch (err) {
      toast.error(`Error: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Delete confirmation
  const confirmDelete = (role) => {
    setRoleToDelete(role)
    setShowDeleteModal(true)
  }

  const handleDelete = async () => {
    if (!roleToDelete) return
    
    try {
      const toastId = toast.loading('Deleting role...')
      
      const res = await fetch(`/api/roles/${roleToDelete.id}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to delete role')
      }

      toast.update(toastId, {
        render: 'Role deleted!',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      })

      setRoles(prev => prev.filter(role => role.id !== roleToDelete.id))
      setShowDeleteModal(false)
      setRoleToDelete(null)
      // Wait for the toast to show before reloading
    setTimeout(() => {
      window.location.reload()
    }, 2000)

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
          <Shield className="w-5 h-5" />
          Role Management
        </h1>
        <button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Role
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
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
          <span className="text-sm text-gray-500 whitespace-nowrap">
            {filteredRoles.length} {filteredRoles.length === 1 ? 'role' : 'roles'}
          </span>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        /* Roles Table */
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
                    Permissions
                  </th>
                  
                  <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRoles.length > 0 ? (
                  filteredRoles.map((role) => (
                    <tr key={role.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {role.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-500 max-w-xs truncate">
                          {role.description || 'No description'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {role.permissions.map(permission => (
                            <span 
                              key={permission.id}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {permission.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(role)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => confirmDelete(role)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No roles found
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
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {editingRole ? 'Edit Role' : 'Create Role'}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={roleName}
                      onChange={(e) => setRoleName(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      id="description"
                      name="description"
                      value={roleDescription}
                      onChange={(e) => setRoleDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permissions
                  </label>
                  <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                    {permissions.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {permissions.map(permission => (
                          <div 
                            key={permission.id}
                            onClick={() => togglePermission(permission.id)}
                            className={`p-3 border rounded-md cursor-pointer transition-colors flex items-center gap-2 ${
                              selectedPermissions.includes(permission.id)
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                              selectedPermissions.includes(permission.id)
                                ? 'bg-blue-500 border-blue-500 text-white'
                                : 'border-gray-300'
                            }`}>
                              {selectedPermissions.includes(permission.id) && (
                                <Check className="w-3 h-3" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{permission.name}</div>
                              {permission.description && (
                                <div className="text-xs text-gray-500">{permission.description}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-4">
                        No permissions available
                      </div>
                    )}
                  </div>
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
                    ) : editingRole ? (
                      'Update Role'
                    ) : (
                      'Create Role'
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
                  Are you sure you want to delete the role:{" "}
                  <span className="font-semibold">"{roleToDelete?.name}"</span>?
                </p>
                <p className="text-sm text-gray-500">
                  This will remove all permissions associated with this role and may affect users.
                </p>
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