import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Helper to extract and verify JWT
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }
  const token = authHeader.substring(7);
  return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
}

// GET /api/projects - Browse all projects or get user's projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const myProjects = searchParams.get('my') === 'true';

    let where: any = {};
    
    if (myProjects) {
      const decoded = verifyToken(request);
      where.clientId = decoded.userId;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (category) {
      where.category = category;
    }

    const projects = await prisma.job.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            rating: true,
          },
        },
        bids: {
          include: {
            freelancer: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
                rating: true,
                hourlyRate: true,
              },
            },
          },
        },
        _count: {
          select: {
            bids: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: projects,
    });
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const decoded = verifyToken(request);
    
    if (decoded.role !== 'CLIENT') {
      return NextResponse.json(
        { success: false, error: 'Only clients can create projects' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      category,
      requiredSkills,
      budget,
      budgetType,
      customBudget,
      deadline,
      isUrgent,
      attachments,
    } = body;

    // Validate required fields
    if (!title || !description || !category || !requiredSkills || (!budget && !customBudget)) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate max bid price (80% of budget)
    const finalBudget = customBudget || budget;
    const maxBidPrice = finalBudget * 0.8;

    // Set bidding end time (24 hours from now)
    const biddingEndsAt = new Date();
    biddingEndsAt.setHours(biddingEndsAt.getHours() + 24);

    // Set week deadline from submission
    const weekDeadline = new Date();
    weekDeadline.setDate(weekDeadline.getDate() + 7);

    const project = await prisma.job.create({
      data: {
        title,
        description,
        category,
        requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [requiredSkills],
        budget: finalBudget,
        budgetType: budgetType || 'fixed',
        customBudget,
        maxBidPrice,
        deadline: deadline ? new Date(deadline) : null,
        isUrgent: isUrgent || false,
        attachments: attachments || [],
        clientId: decoded.userId,
        status: 'OPEN',
        biddingEndsAt,
        weekDeadline,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            rating: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: project,
      message: 'Project created successfully',
    });
  } catch (error: any) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
