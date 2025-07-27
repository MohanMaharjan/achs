// app/api/user-permissions/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    // Explicit database connection
    await prisma.$connect();

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        role: {
          select: {
            name: true,  // Explicitly select role name
            permissions: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.role) {
      return NextResponse.json(
        { 
          error: 'User has no role assigned',
          role: null,
          permissions: {}
        }, 
        { status: 400 }
      );
    }

    // Transform permissions into object format
    const permissions = {};
    user.role.permissions.forEach(permission => {
      permissions[permission.name] = true;
    });

    return NextResponse.json({
      role: user.role.name,  // Include role name in response
      permissions
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch permissions',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect().catch(e => {
      console.error('Error disconnecting Prisma:', e);
    });
  }
}