// app/api/permissions/route.js
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
  try {
    const permissions = await prisma.permission.findMany({
      orderBy: {
        name: 'asc'
      }
    })
    return NextResponse.json({ permissions })
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch permissions', error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(req) {
  try {
    const { name, description } = await req.json()

    if (!name) {
      return NextResponse.json(
        { message: 'Permission name is required' },
        { status: 400 }
      )
    }

    const existingPermission = await prisma.permission.findUnique({
      where: { name }
    })

    if (existingPermission) {
      return NextResponse.json(
        { message: 'Permission with this name already exists' },
        { status: 400 }
      )
    }

    const permission = await prisma.permission.create({
      data: {
        name,
        description
      }
    })

    return NextResponse.json({ permission }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to create permission', error: error.message },
      { status: 500 }
    )
  }
}