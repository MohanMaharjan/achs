import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

import { writeFile } from 'fs/promises';
import path from 'path';
import { mkdir } from 'fs/promises';




const prisma = new PrismaClient()

// GET: Fetch posts
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
 
  include: {
    author: { select: { username: true } },
  },
})

const formattedPosts = posts.map(post => ({
  ...post,
  author: post.author?.name || 'Unknown',
}))


    return NextResponse.json({ posts: formattedPosts })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ message: 'Failed to create post', error: error.message }, { status: 500 })

  }
}

// POST: Create a new post

export async function POST(request) {
  try {
    const formData = await request.formData()
    
    const title = formData.get('title')
    const content = formData.get('content')
    const type = formData.get('type')
    const videoUrl = formData.get('videoUrl')
    const links = formData.get('links')
    const isPublished = formData.get('isPublished') === 'on'
    const imageFile = formData.get('image')
    
    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { message: 'Title and content are required' },
        { status: 400 }
      )
    }
    
    let imageUrl = null
    
    // Handle image upload if exists
    if (imageFile && imageFile.size > 0) {
      const buffer = await imageFile.arrayBuffer()
      const filename = `${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`
      const uploadDir = path.join(process.cwd(), 'public', 'uploads')
      
      try {
        // Ensure upload directory exists
        await mkdir(uploadDir, { recursive: true })
        
        // Write file to uploads directory
        await writeFile(
          path.join(uploadDir, filename),
          Buffer.from(buffer)
        )
        
        imageUrl = filename
      } catch (error) {
        console.error('Error saving image:', error)
        return NextResponse.json(
          { message: 'Failed to save image' },
          { status: 500 }
        )
      }
    }
    
    // Create post in database
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        type,
        imageUrl,
        videoUrl,
        links,
        isPublished,
        publishedAt: isPublished ? new Date() : null,
        authorId: 1, // Replace with actual user ID from session
      },
    })
    
    return NextResponse.json(
      { post: newPost },
      { status: 201 }
    )
    
  } catch (error) {
  console.error('Error creating post:', error)
  return NextResponse.json(
    { 
      message: 'Failed to create post',
      error: error.message, // Include the actual error message
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    },
    { status: 500 }
  )
}
}
