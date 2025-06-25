import { NextResponse } from 'next/server'
import { unlink } from 'fs/promises'
import path from 'path'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    
    // First get the post to check for image
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) }
    })
    
    if (!post) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      )
    }
    
    if (!post.imageUrl) {
      return NextResponse.json(
        { message: 'Post has no image to delete' },
        { status: 400 }
      )
    }
    
    // Delete the image file
    try {
      const imagePath = path.join(
        process.cwd(),
        'public',
        'uploads',
        post.imageUrl
      )
      await unlink(imagePath)
    } catch (error) {
      console.error('Error deleting image:', error)
      return NextResponse.json(
        { message: 'Failed to delete image file' },
        { status: 500 }
      )
    }
    
    // Update the post to remove the image reference
    await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        imageUrl: null
      }
    })
    
    return NextResponse.json(
      { message: 'Image deleted successfully' },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Error deleting post image:', error)
    return NextResponse.json(
      { message: 'Failed to delete post image' },
      { status: 500 }
    )
  }
}