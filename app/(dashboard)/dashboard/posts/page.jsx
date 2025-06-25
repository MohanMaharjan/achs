'use client'

import React, { useEffect, useState } from 'react'
import { 
  Plus, 
  Loader2, 
  Edit, 
  Trash2, 
  Calendar, 
  User as UserIcon, 
  Link as LinkIcon,
  Image as ImageIcon,
  Film,
  FileText,
  Check,
  X,
  Filter
} from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function PostsPage() {
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [postToDelete, setPostToDelete] = useState(null)
  const [form, setForm] = useState({ 
    title: '', 
    content: '', 
    type: '',
    imageFile: null,
    videoUrl: '',
    links: '',
    isPublished: false 
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [filterType, setFilterType] = useState('all')

  // Valid type options for validation
  const validTypes = ['slider', 'program', 'news', 'gallery', 'students', 'partners']

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/posts')
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to fetch posts')
      setPosts(data.posts)
      setFilteredPosts(data.posts) // Initialize filtered posts with all posts
    } catch (err) {
      setError(err.message)
      toast.error(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  // Apply filter when filterType changes
  useEffect(() => {
    if (filterType === 'all') {
      setFilteredPosts(posts)
    } else {
      setFilteredPosts(posts.filter(post => post.type === filterType))
    }
  }, [filterType, posts])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg']
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a PNG or JPG image')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB')
        return
      }
      setForm({ ...form, imageFile: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setForm({ ...form, imageFile: null })
    setImagePreview(null)
  }

  const handleDeleteCurrentImage = async () => {
    if (!editingPost?.imageUrl) return
    
    try {
      const res = await fetch(`/api/posts/${editingPost.id}/image`, {
        method: 'DELETE'
      })
      
      if (!res.ok) throw new Error('Failed to delete image')
      
      setEditingPost({ ...editingPost, imageUrl: null })
      setForm({ ...form, imageFile: null })
      setImagePreview(null)
      toast.success('Image deleted successfully')
    } catch (err) {
      toast.error(`Error: ${err.message}`)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('content', form.content)
      formData.append('type', form.type)
      formData.append('videoUrl', form.videoUrl)
      formData.append('links', form.links)
      formData.append('isPublished', form.isPublished ? 'on' : 'off')
      
      if (form.imageFile) {
        formData.append('image', form.imageFile)
      }
      
      const url = editingPost ? `/api/posts/${editingPost.id}` : '/api/posts'
      const method = editingPost ? 'PUT' : 'POST'
      
      const toastId = toast.loading(editingPost ? 'Updating post...' : 'Creating post...')
      
      const res = await fetch(url, {
        method,
        body: formData
      })
      
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to save post')
      }
      
      toast.update(toastId, {
        render: editingPost ? 'Post updated successfully' : 'Post created successfully',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      })
      
      setShowModal(false)
      resetForm()
      fetchPosts()
    } catch (err) {
      toast.error(`Error: ${err.message}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleEdit = (post) => {
    const normalizedType = validTypes.includes(post.type?.toLowerCase()) 
      ? post.type.toLowerCase() 
      : ''
    setEditingPost(post)
    setForm({
      title: post.title,
      content: post.content,
      type: normalizedType,
      imageFile: null,
      videoUrl: post.videoUrl || '',
      links: post.links || '',
      isPublished: post.isPublished
    })
    setImagePreview(post.imageUrl ? `/uploads/${post.imageUrl}` : null)
    setShowModal(true)
    toast.info(`Editing post: ${post.title}`)
  }

  const confirmDelete = (post) => {
    setPostToDelete(post)
    setShowDeleteModal(true)
  }

  const handleDelete = async () => {
    if (!postToDelete) return
    
    try {
      const toastId = toast.loading(`Deleting post #${postToDelete.id}...`)
      
      const res = await fetch(`/api/posts/${postToDelete.id}`, {
        method: 'DELETE'
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete post')
      }

      toast.update(toastId, {
        render: `Post #${postToDelete.id} deleted successfully`,
        type: 'success',
        isLoading: false,
        autoClose: 3000
      })

      setShowDeleteModal(false)
      setPostToDelete(null)
      fetchPosts()
    } catch (err) {
      toast.error(`Error: ${err.message}`)
    }
  }

  const resetForm = () => {
    setForm({ 
      title: '', 
      content: '', 
      type: '',
      imageFile: null,
      videoUrl: '',
      links: '',
      isPublished: false 
    })
    setImagePreview(null)
    setEditingPost(null)
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
          <FileText className="w-5 h-5" />
          Post Management
        </h1>
        <button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Post
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
            <span className="font-medium">Filter by Type:</span>
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Posts</option>
            {validTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-500 ml-auto">
            Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Published At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Media</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50 border">
                      <td className="px-6 py-4 whitespace-nowrap border border-gray-200">
                        <div className="text-sm font-medium text-gray-900">{post.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-2">{post.content.substring(0, 100)}...</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-200">
                        {post.type || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border border-gray-200">
                        <div className="flex items-center">
                          <UserIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />
                          <div className="ml-2">
                            <div className="text-sm font-medium text-gray-900">{post.author?.name || 'Unknown'}</div>
                            <div className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border border-gray-200">
                        <div className="flex items-center">
                          <Calendar className="flex-shrink-0 h-5 w-5 text-gray-400" />
                          <div className="ml-2 text-sm text-gray-500">
                            {post.publishedAt ? new Date(post.publishedAt).toLocaleString() : 'Not published'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border border-gray-200">
                        <div className="flex items-center space-x-2">
                          {post.imageUrl && (
                            <a href={`/uploads/${post.imageUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                              <ImageIcon className="h-5 w-5" />
                            </a>
                          )}
                          {post.videoUrl && (
                            <a href={post.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                              <Film className="h-5 w-5" />
                            </a>
                          )}
                          {post.links && (
                            <a href={post.links} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                              <LinkIcon className="h-5 w-5" />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border border-gray-200">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            post.isPublished 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {post.isPublished ? (
                            <span className="flex items-center">
                              <Check className="w-3 h-3 mr-1" /> Published
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <X className="w-3 h-3 mr-1" /> Draft
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium border border-gray-200">
                        <button
                          onClick={() => handleEdit(post)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => confirmDelete(post)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      No posts found matching the selected filter
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Post Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {editingPost ? 'Edit Post' : 'Create New Post'}
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
                    placeholder="Post title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                    Content *
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    placeholder="Post content"
                    rows={5}
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={form.type || ''} 
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a type</option>
                    <option value="slider">Slider</option>
                    <option value="program">Program</option>
                    <option value="news">News</option>
                    <option value="gallery">Gallery</option>
                    <option value="students">Students</option>
                    <option value="partners">Partners</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Image
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG (MAX. 5MB)</p>
                      </div>
                      <input 
                        id="image"
                        name="image"
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                    {imagePreview && (
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="h-64 w-64 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={editingPost?.imageUrl && !form.imageFile ? handleDeleteCurrentImage : handleRemoveImage}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 -mt-2 -mr-2"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                  {editingPost?.imageUrl && !imagePreview && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">Current image:</p>
                      <div className="relative inline-block">
                        <img 
                          src={`/uploads/${editingPost.imageUrl}`} 
                          alt="Current" 
                          className="h-64 w-64 object-cover rounded-md mt-1"
                        />
                        <button
                          type="button"
                          onClick={handleDeleteCurrentImage}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 -mt-2 -mr-2"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    Video URL
                  </label>
                  <input
                    type="text"
                    id="videoUrl"
                    name="videoUrl"
                    placeholder="https://example.com/video.mp4"
                    value={form.videoUrl}
                    onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="links" className="block text-sm font-medium text-gray-700 mb-1">
                    External Links
                  </label>
                  <input
                    type="text"
                    id="links"
                    name="links"
                    placeholder="https://example.com"
                    value={form.links}
                    onChange={(e) => setForm({ ...form, links: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPublished"
                    name="isPublished"
                    checked={form.isPublished}
                    onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-700">
                    Publish this post
                  </label>
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
                    disabled={isUploading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? (
                      <span className="flex items-center">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {editingPost ? 'Updating...' : 'Creating...'}
                      </span>
                    ) : editingPost ? 'Update Post' : 'Create Post'}
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
                  Are you sure you want to delete the post titled: 
                  <span className="font-semibold"> "{postToDelete?.title}"</span>?
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
                    Delete Post
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