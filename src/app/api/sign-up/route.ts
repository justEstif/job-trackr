import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { LuciaError } from "lucia-auth";
import { auth } from "@/lib-server/lucia";

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const { username, password } = z
      .object({
        username: z.string(),
        password: z.string(),
      })
      .parse(body);

    const user = await auth.createUser({
      primaryKey: {
        providerId: "username",
        providerUserId: username,
        password,
      },
      attributes: {
        username,
      },
    });
    const session = await auth.createSession(user.userId);
    const authRequest = auth.handleRequest(req, new Response());
    authRequest.setSession(session);

    return NextResponse.json({
      id: user.userId,
      username: user.username,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: error.issues,
        dump: error,
      });
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002" &&
      error.message?.includes("username")
    ) {
      return NextResponse.json({
        error: "Username already in use",
      });
    }
    if (
      error instanceof LuciaError &&
      error.message === "AUTH_DUPLICATE_KEY_ID"
    ) {
      return NextResponse.json({
        error: "Username already in use",
      });
    }
    // database connection error
    console.error(error);
    return NextResponse.json({
      error: "Unknown error occurred",
      dump: error,
    });
  }
}
