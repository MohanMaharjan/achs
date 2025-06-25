import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { unlink } from 'fs/promises';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';

const prisma = new PrismaClient();

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const formData = await request.formData();
    
    const title = formData.get('title');
    const content = formData.get('content');
    const type = formData.get('type');
    const videoUrl = formData.get('videoUrl');
    const links = formData.get('links');
    const isPublished = formData.get('isPublished') === 'on';
    const imageFile = formData.get('image');
    
    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { message: 'Title and content are required' },
        { status: 400 }
      );
    }
    
    // Get current post to check for existing image
    const currentPost = await prisma.post.findUnique({
      where: { id: parseInt(id) }
    });
    
    let imageUrl = currentPost?.imageUrl || null;
    
    // Handle image upload if exists
    if (imageFile && imageFile.size > 0) {
      // Delete old image if exists
      if (currentPost?.imageUrl) {
        try {
          const oldImagePath = path.join(
            process.cwd(),
            'public',
            'uploads',
            currentPost.imageUrl
          );
          await unlink(oldImagePath);
        } catch (error) {
          console.error('Error deleting old image:', error);
          // Continue even if old image deletion fails
        }
      }
      
      // Save new image
      const buffer = await imageFile.arrayBuffer();
      const filename = `${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      
      try {
        await mkdir(uploadDir, { recursive: true });
        await writeFile(
          path.join(uploadDir, filename),
          Buffer.from(buffer)
        );
        imageUrl = filename;
      } catch (error) {
        console.error('Error saving new image:', error);
        return NextResponse.json(
          { message: 'Failed to save image' },
          { status: 500 }
        );
      }
    }
    
    // Update post in database
    const updatedPost = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        title,
        content,
        type,
        imageUrl,
        videoUrl,
        links,
        isPublished,
        publishedAt: isPublished ? new Date() : null,
      },
    });
    
    return NextResponse.json(
      { post: updatedPost },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { message: 'Failed to update post' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const postId = parseInt(id);
    
    if (isNaN(postId)) {
      return NextResponse.json(
        { message: 'Invalid Post ID' },
        { status: 400 }
      );
    }

    // Find the post first to get image details
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }

    // Delete associated image if it exists
    if (post.imageUrl) {
      try {
        const imagePath = path.join(
          process.cwd(),
          'public',
          'uploads',
          post.imageUrl
        );
        
        // Verify the path is within the intended directory for security
        const normalizedPath = path.normalize(imagePath);
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        
        if (!normalizedPath.startsWith(uploadsDir)) {
          throw new Error('Invalid image path');
        }

        await unlink(normalizedPath);
      } catch (error) {
        console.error('Error deleting image file:', error);
        // Continue with post deletion even if image deletion fails
      }
    }

    // Delete the post from database
    await prisma.post.delete({
      where: { id: postId }
    });

    return NextResponse.json(
      { message: 'Post deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { 
        message: 'Failed to delete post',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}