import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetch single department
export async function GET(request, { params }) {
  const { id } =await params;
  
  try {
    const department = await prisma.department.findUnique({
      where: { id: parseInt(id) },
      include: {
        courses: true,
        users: true
      }
    });

    if (!department) {
      return NextResponse.json(
        { message: 'Department not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ department }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch department', error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT: Update department
export async function PUT(request, { params }) {
  const { id } =await params;
  
  try {
    const data = await request.json();

    // Validate input
    const errors = {};
    let isValid = true;

    if (!data.name || data.name.trim() === '') {
      errors.name = 'Department name is required';
      isValid = false;
    } else if (data.name.length > 50) {
      errors.name = 'Department name must be less than 50 characters';
      isValid = false;
    }

    if (!isValid) {
      return NextResponse.json(
        { message: 'Validation failed', errors },
        { status: 400 }
      );
    }

    // Update department
    const department = await prisma.department.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name.trim(),
      },
    });

    return NextResponse.json(
      { department, message: 'Department updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: 'Department with this name already exists' },
        { status: 409 }
      );
    }
    if (error.code === 'P2025') {
      return NextResponse.json(
        { message: 'Department not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: 'Failed to update department', error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE: Remove department
export async function DELETE(request, { params }) {
  const { id } =await params;
  
  try {
    await prisma.department.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: 'Department deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { message: 'Department not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: 'Failed to delete department', error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}