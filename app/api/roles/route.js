// app/api/roles/route.js
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Initialize Prisma Client properly
const prisma = new PrismaClient()

export async function GET() {
  try {
    const roles = await prisma.role.findMany({
      include: {
        permissions: true
      },
      orderBy: {
        id: 'asc'
      }
    })
    
    // Properly close the Prisma connection
    await prisma.$disconnect()
    
    return NextResponse.json({ roles })
  } catch (error) {
    // Ensure connection is closed even if error occurs
    await prisma.$disconnect()
    console.error('Error fetching roles:', error)
    
    return NextResponse.json(
      { 
        message: 'Failed to fetch roles',
        error: error.message 
      },
      { status: 500 }
    )
  }
}

export async function POST(req) {
  try {
    const { name, description, permissionIds } = await req.json()

    // Validate input
    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { message: 'Valid role name is required' },
        { status: 400 }
      )
    }

    // Check for existing role
    const existingRole = await prisma.role.findUnique({
      where: { name }
    })

    if (existingRole) {
      await prisma.$disconnect()
      return NextResponse.json(
        { message: 'Role with this name already exists' },
        { status: 400 }
      )
    }

    // Validate permission IDs if provided
    if (permissionIds && permissionIds.length > 0) {
      const existingPermissions = await prisma.permission.findMany({
        where: { id: { in: permissionIds } }
      })
      
      if (existingPermissions.length !== permissionIds.length) {
        await prisma.$disconnect()
        return NextResponse.json(
          { message: 'One or more permission IDs are invalid' },
          { status: 400 }
        )
      }
    }

    // Create new role
    const role = await prisma.role.create({
      data: {
        name,
        description,
        permissions: {
          connect: permissionIds?.map((id) => ({ id })) || []
        }
      },
      include: {
        permissions: true
      }
    })

    await prisma.$disconnect()
    return NextResponse.json({ role }, { status: 201 })
  } catch (error) {
    await prisma.$disconnect()
    console.error('Error creating role:', error)
    
    return NextResponse.json(
      { 
        message: 'Failed to create role',
        error: error.message 
      },
      { status: 500 }
    )
  }
}