
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
// GET single user
export async function GET(request, { params }) {
  try {
    const { id } = params

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        role: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user

    return NextResponse.json({ user: userWithoutPassword })
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch user', error: error.message },
      { status: 500 }
    )
  }
}

// PUT update user
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const updateData = await request.json()

    // If password is being updated, hash it
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10)
    }

    // Convert roleId to number if it exists
    if (updateData.roleId) {
      updateData.roleId = parseInt(updateData.roleId)
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        role: true
      }
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser

    return NextResponse.json(
      { user: userWithoutPassword, message: 'User updated successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to update user', error: error.message },
      { status: 500 }
    )
  }
}

// DELETE user
export async function DELETE(request, { params }) {
  try {
    const { id } = params

    await prisma.user.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to delete user', error: error.message },
      { status: 500 }
    )
  }
}