import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


// GET: Fetch all departments
export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        courses: true,
        users: true
      }
    });

    return NextResponse.json({ departments }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch departments', error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST: Create new department
export async function POST(request) {
  try {
    const data = await request.json();


    // Create department
    const department = await prisma.department.create({
      data: {
        name: data.name.trim(),
      },
    });

    return NextResponse.json(
      { department, message: 'Department created successfully' },
      { status: 201 }
    );
  } catch (error) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: 'Department with this name already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { message: 'Failed to create department', error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}