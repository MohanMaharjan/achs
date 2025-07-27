// app/api/permissions/[id]/route.js
import { NextResponse } from 'next/server'
import {PrismaClient} from '@prisma/client'
const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const permission = await prisma.permission.findUnique({
      where: { id: Number(params.id) }
    })

    if (!permission) {
      return NextResponse.json(
        { message: 'Permission not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ permission })
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch permission', error: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const { name, description } = await request.json()

    if (!name) {
      return NextResponse.json(
        { message: 'Permission name is required' },
        { status: 400 }
      )
    }

    const existingPermission = await prisma.permission.findUnique({
      where: { id: Number(params.id) }
    })

    if (!existingPermission) {
      return NextResponse.json(
        { message: 'Permission not found' },
        { status: 404 }
      )
    }

    const permissionWithSameName = await prisma.permission.findFirst({
      where: {
        name,
        NOT: { id: Number(params.id) }
      }
    })

    if (permissionWithSameName) {
      return NextResponse.json(
        { message: 'Another permission with this name already exists' },
        { status: 400 }
      )
    }

    const updatedPermission = await prisma.permission.update({
      where: { id: Number(params.id) },
      data: {
        name,
        description
      }
    })

    return NextResponse.json({ permission: updatedPermission })
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to update permission', error: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const permission = await prisma.permission.findUnique({
      where: { id: Number(params.id) },
      include: {
        roles: true
      }
    })

    if (!permission) {
      return NextResponse.json(
        { message: 'Permission not found' },
        { status: 404 }
      )
    }

    if (permission.roles.length > 0) {
      return NextResponse.json(
        { 
          message: 'Cannot delete permission assigned to roles',
          roles: permission.roles.map(r => r.name)
        },
        { status: 400 }
      )
    }

    await prisma.permission.delete({
      where: { id: Number(params.id) }
    })

    return NextResponse.json(
      { message: 'Permission deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to delete permission', error: error.message },
      { status: 500 }
    )
  }
}