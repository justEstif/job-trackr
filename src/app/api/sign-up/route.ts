import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { LuciaError } from "lucia-auth";

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const { username, password } = z
      .object({
        username: z.string(),
        password: z.string(),
      })
      .parse(body);

    return NextResponse.json({
      username,
      password,
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
    });
  }
}
