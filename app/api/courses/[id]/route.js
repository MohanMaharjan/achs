import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

const prisma = new PrismaClient();
const uploadDir = path.join(process.cwd(), 'public/uploads/syllabus');

// Utility function to upload file
async function uploadFile(file) {
  if (!file || file.size === 0) return null;
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
  const filePath = path.join(uploadDir, filename);
  await writeFile(filePath, buffer);
  return `/uploads/syllabus/${filename}`;
}

// Utility function to delete file
async function deleteFile(filePath) {
  if (!filePath) return;
  const fullPath = path.join(process.cwd(), 'public', filePath);
  if (existsSync(fullPath)) await unlink(fullPath);
}

// PUT: Update a course
export async function PUT(request, { params }) {
  try {
    const resolvedParams = await params; // Await params to resolve the Promise
    const courseId = parseInt(resolvedParams.id);
    if (isNaN(courseId)) {
      return NextResponse.json({ message: 'Invalid course ID' }, { status: 400 });
    }

    const formData = await request.formData();
    const title = formData.get('title')?.toString().trim();
    const code = formData.get('code')?.toString().trim().toUpperCase();
    const Lecture = parseInt(formData.get('Lecture') || '');
    const Practical = parseInt(formData.get('Practical') || '0');
    const description = formData.get('description')?.toString().trim();
    const departmentId = parseInt(formData.get('departmentId') || '');
    const semester = parseInt(formData.get('semester') || ''); // Convert to integer
    const year = parseInt(formData.get('year') || '');
    const syllabusFile = formData.get('syllabus');

    if (!title || !code || isNaN(Lecture) || isNaN(departmentId) || isNaN(semester) || isNaN(year)) {
      return NextResponse.json({ message: 'Missing or invalid required fields' }, { status: 400 });
    }

    if (![1, 2, 3, 4, 5, 6, 7, 8].includes(semester)) {
      return NextResponse.json({ message: 'Invalid semester value' }, { status: 400 });
    }

    const existingCourse = await prisma.course.findUnique({ where: { id: courseId } });
    if (!existingCourse) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    if (code !== existingCourse.code) {
      const codeExists = await prisma.course.findFirst({ where: { code } });
      if (codeExists) {
        return NextResponse.json({ message: 'Course code already exists' }, { status: 409 });
      }
    }

    let syllabusPath = existingCourse.syllabus;
    if (syllabusFile?.size > 0) {
      await deleteFile(syllabusPath);
      syllabusPath = await uploadFile(syllabusFile);
    }

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        title,
        code,
        Lecture,
        Practical: isNaN(Practical) ? 0 : Practical,
        description: description || null,
        syllabus: syllabusPath,
        departmentId,
        semester,
        year
      },
      include: { department: true }
    });

    return NextResponse.json({ course: updatedCourse, message: 'Course updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json({ message: 'Failed to update course', error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE: Delete a course
export async function DELETE(request, { params }) {
  try {
    const courseId = parseInt(params.id);
    if (isNaN(courseId)) {
      return NextResponse.json({ message: 'Invalid course ID' }, { status: 400 });
    }

    const existingCourse = await prisma.course.findUnique({ where: { id: courseId } });
    if (!existingCourse) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    await deleteFile(existingCourse.syllabus);
    await prisma.course.delete({ where: { id: courseId } });

    return NextResponse.json({ message: 'Course deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json({ message: 'Failed to delete course', error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}