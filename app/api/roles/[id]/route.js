// app/api/roles/[id]/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const role = await prisma.role.findUnique({
      where: { id: Number(params.id) },
      include: { permissions: true }
    });

    if (!role) {
      return NextResponse.json(
        { message: 'Role not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ role });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch role', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { name, description, permissionIds } = await request.json();

    if (!name) {
      return NextResponse.json(
        { message: 'Role name is required' },
        { status: 400 }
      );
    }

    const existingRole = await prisma.role.findUnique({
      where: { id: Number(params.id) }
    });

    if (!existingRole) {
      return NextResponse.json(
        { message: 'Role not found' },
        { status: 404 }
      );
    }

    const roleWithSameName = await prisma.role.findFirst({
      where: {
        name,
        NOT: { id: Number(params.id) }
      }
    });

    if (roleWithSameName) {
      return NextResponse.json(
        { message: 'Role name already exists' },
        { status: 400 }
      );
    }

    const updatedRole = await prisma.role.update({
      where: { id: Number(params.id) },
      data: {
        name,
        description,
        permissions: {
          set: permissionIds?.map(id => ({ id })) || []
        }
      },
      include: { permissions: true }
    });

    return NextResponse.json({ role: updatedRole });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to update role', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const role = await prisma.role.findUnique({
      where: { id: Number(params.id) },
      include: { users: true }
    });

    if (!role) {
      return NextResponse.json(
        { message: 'Role not found' },
        { status: 404 }
      );
    }

    if (role.users && role.users.length > 0) {
      return NextResponse.json(
        { message: 'Cannot delete role with assigned users' },
        { status: 400 }
      );
    }

    await prisma.role.delete({
      where: { id: Number(params.id) }
    });

    return NextResponse.json(
      { message: 'Role deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to delete role', error: error.message },
      { status: 500 }
    );
  }
}