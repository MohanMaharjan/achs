
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

import {PrismaClient} from '@prisma/client'
const prisma = new PrismaClient()

// GET all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        role: true
      }
    })

    // Remove password from response
    const usersWithoutPassword = users.map(user => {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    })

    return NextResponse.json({ users: usersWithoutPassword })
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch users', error: error.message },
      { status: 500 }
    )
  }
}

// POST create new user
export async function POST(request) {
  try {
    const { username, email, password, roleId } = await request.json()

    // Validate input
    if (!username || !email || !password || !roleId) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'Username or email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        roleId: parseInt(roleId)
      },
      include: {
        role: true
      }
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json(
      { user: userWithoutPassword, message: 'User created successfully' },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to create user', error: error.message },
      { status: 500 }
    )
  }
}