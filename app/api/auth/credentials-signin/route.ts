import { compare } from "bcryptjs";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { signIn } from "next-auth/react";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.password) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const isValid = await compare(password, user.password);

  if (!isValid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Manually sign in the user after successful credential validation
  // This part will be handled by next-auth/react's signIn function on the client
  // For server-side, we would typically create a session directly, but here we're just validating
  // and letting the client handle the actual signIn call with the 'credentials' provider
  // which will now be a custom provider that points to this API route.

  return NextResponse.json({ success: true });
}