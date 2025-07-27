import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { db } from '@/db';
import { usersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface SignupRequest {
  name: string;
  email: string;
  password: string;
  age: number;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as SignupRequest;
    const { name, email, password, age } = body;

    // Input validation
    if (!name || !email || !password || !age) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user
    const newUser = await db.insert(usersTable)
      .values({
        name,
        email,
        password: hashedPassword,
        age,
      })
      .returning();

    // Return success response without password
    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: newUser[0].id,
        name: newUser[0].name,
        email: newUser[0].email,
        age: newUser[0].age,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}