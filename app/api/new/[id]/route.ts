import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const postId = Number(params.id);

    if (isNaN(postId)) {
      return NextResponse.json({ message: 'Invalid post ID' }, { status: 400 });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    if (post.userId !== userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ message: 'Error deleting post', error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const postId = Number(params.id);

    if (isNaN(postId)) {
      return NextResponse.json({ message: 'Invalid post ID' }, { status: 400 });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    if (post.userId !== userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const updatedData = await req.json();

    // Optional validation for updatedData can be added here
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        heading: updatedData.heading,
        code: updatedData.code,
        language: updatedData.language,
      },
    });

    return NextResponse.json({ message: 'Post updated successfully', post: updatedPost }, { status: 200 });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ message: 'Error updating post', error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}