import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export interface JwtPayload {
  userId: string;
}

export function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.split(' ')[1];
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch {
    return null;
  }
}

export function createToken(userId: string): string {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: 60 * 60 * 24 * 7,
  });
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { message: 'Not authorized, no token provided' },
    { status: 401 }
  );
}
