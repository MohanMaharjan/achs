'use client'

import React, { useEffect, useState } from 'react'
import { 
  Plus, 
  Loader2, 
  Edit, 
  Trash2, 
  Calendar, 
  User as UserIcon,
  Lock,
  Mail,
  Shield,
  Check,
  X,
  Filter
} from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [form, setForm] = useState({ 
    username: '', 
    email: '', 
    password: '',
    roleId: '',
    confirmPassword: ''
  })
  const [isUploading, setIsUploading] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [roles, setRoles] = useState([])
  const [filterRole, setFilterRole] = useState('all')

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to fetch users')
      setUsers(data.users)
      setFilteredUsers(data.users)
    } catch (err) {
      setError(err.message)
      toast.error(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const fetchRoles = async () => {
    try {
      const res = await fetch('/api/roles')
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to fetch roles')
      setRoles(data.roles)
    } catch (err) {
      toast.error(`Error fetching roles: ${err.message}`)
    }
  }

  useEffect(() => {
    fetchUsers()
    fetchRoles()
  }, [])

  // Apply filter when filterRole changes
  useEffect(() => {
    if (filterRole === 'all') {
      setFilteredUsers(users)
    } else {
      setFilteredUsers(users.filter(user => user.roleId.toString() === filterRole))
    }
  }, [filterRole, users])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsUploading(true)
    
    // Validate password match when creating new user
    if (!editingUser && form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      setIsUploading(false)
      return
    }

    try {
      const payload = {
        username: form.username,
        email: form.email,
        roleId: parseInt(form.roleId),
      }

      // Only include password if it's being changed (for edit) or new user
      if (form.password && (!editingUser || (editingUser && form.password !== ''))) {
        payload.password = form.password
      }

      const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users'
      const method = editingUser ? 'PUT' : 'POST'
      
      const toastId = toast.loading(editingUser ? 'Updating user...' : 'Creating user...')
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })
      
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to save user')
      }
      
      toast.update(toastId, {
        render: editingUser ? 'User updated successfully' : 'User created successfully',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      })
      
      setShowModal(false)
      resetForm()
      fetchUsers()
    } catch (err) {
      toast.error(`Error: ${err.message}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setForm({
      username: user.username,
      email: user.email,
      roleId: user.roleId.toString(),
      password: '',
      confirmPassword: ''
    })
    setShowModal(true)
    toast.info(`Editing user: ${user.username}`)
  }

  const confirmDelete = (user) => {
    setUserToDelete(user)
    setShowDeleteModal(true)
  }

  const handleDelete = async () => {
    if (!userToDelete) return
    
    try {
      const toastId = toast.loading(`Deleting user #${userToDelete.id}...`)
      
      const res = await fetch(`/api/users/${userToDelete.id}`, {
        method: 'DELETE'
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete user')
      }

      toast.update(toastId, {
        render: `User #${userToDelete.id} deleted successfully`,
        type: 'success',
        isLoading: false,
        autoClose: 3000
      })

      setShowDeleteModal(false)
      setUserToDelete(null)
      fetchUsers()
    } catch (err) {
      toast.error(`Error: ${err.message}`)
    }
  }

  const resetForm = () => {
    setForm({ 
      username: '', 
      email: '', 
      password: '',
      roleId: '',
      confirmPassword: ''
    })
    setEditingUser(null)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <UserIcon className="w-5 h-5" />
          User Management
        </h1>
        <button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New User
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          <p>Error: {error}</p>
        </div>
      )}

      {/* Filter Controls */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-700">
            <Filter className="w-5 h-5" />
            <span className="font-medium">Filter by Role:</span>
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Users</option>
            {roles.map(role => (
              <option key={role.id} value={role.id.toString()}>
                {role.name}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-500 ml-auto">
            Showing {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 border">
                      <td className="px-6 py-4 whitespace-nowrap border border-gray-200">
                        <div className="flex items-center">
                          <UserIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />
                          <div className="ml-2">
                            <div className="text-sm font-medium text-gray-900">{user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border border-gray-200">
                        <div className="flex items-center">
                          <Mail className="flex-shrink-0 h-5 w-5 text-gray-400" />
                          <div className="ml-2 text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border border-gray-200">
                        <div className="flex items-center">
                          <Shield className="flex-shrink-0 h-5 w-5 text-gray-400" />
                          <div className="ml-2">
                            <div className="text-sm font-medium text-gray-900">
                              {roles.find(r => r.id === user.roleId)?.name || 'Unknown'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border border-gray-200">
                        <div className="flex items-center">
                          <Calendar className="flex-shrink-0 h-5 w-5 text-gray-400" />
                          <div className="ml-2 text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium border border-gray-200">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => confirmDelete(user)}
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
                      No users found matching the selected filter
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {editingUser ? 'Edit User' : 'Create New User'}
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
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="user@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="roleId" className="block text-sm font-medium text-gray-700 mb-1">
                    Role *
                  </label>
                  <select
                    id="roleId"
                    name="roleId"
                    value={form.roleId || ''} 
                    onChange={(e) => setForm({ ...form, roleId: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a role</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.id.toString()}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    {editingUser ? 'New Password (leave blank to keep current)' : 'Password *'}
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder={editingUser ? 'Leave blank to keep current' : 'Password'}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required={!editingUser}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Lock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                {!editingUser && (
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm password"
                        value={form.confirmPassword}
                        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Lock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                )}

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
                    disabled={isUploading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? (
                      <span className="flex items-center">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {editingUser ? 'Updating...' : 'Creating...'}
                      </span>
                    ) : editingUser ? 'Update User' : 'Create User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
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
                  Are you sure you want to delete the user: 
                  <span className="font-semibold"> "{userToDelete?.username}"</span>?
                </p>
                <p className="text-sm text-gray-500">
                  This action cannot be undone. All posts by this user will be orphaned.
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
                    Delete User
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