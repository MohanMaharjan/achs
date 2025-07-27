import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile } from 'fs/promises';
import path from 'path';

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

// GET: Fetch courses by department and semester

  // Add this new GET function in your route.js file
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const departmentId = parseInt(searchParams.get('departmentId'));
    
    // Validate departmentId is provided and is a number
    if (isNaN(departmentId)) {
      return NextResponse.json(
        { message: 'Valid departmentId is required' },
        { status: 400 }
      );
    }

    // Handle semester parameter properly
    let semester;
    const semesterParam = searchParams.get('semester');
    if (semesterParam && !isNaN(parseInt(semesterParam))) {
      semester = parseInt(semesterParam);
    }

    // Build the where clause
    const whereClause = { 
      departmentId,
      ...(semester !== undefined && { semester }) // Only add if semester exists
    };

    const courses = await prisma.course.findMany({
      where: whereClause,
      include: { department: true },
      orderBy: [
        { semester: 'asc' },
        { code: 'asc' }
      ]
    });

    return NextResponse.json({ courses }, { status: 200 });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { message: 'Failed to fetch courses', error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
// POST: Create a new course
export async function POST(request) {
  try {
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

    const codeExists = await prisma.course.findFirst({ where: { code } });
    if (codeExists) {
      return NextResponse.json({ message: 'Course code already exists' }, { status: 409 });
    }

    let syllabusPath = null;
    if (syllabusFile?.size > 0) {
      syllabusPath = await uploadFile(syllabusFile);
    }

    const course = await prisma.course.create({
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

    return NextResponse.json({ course, message: 'Course created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json({ message: 'Failed to create course', error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}