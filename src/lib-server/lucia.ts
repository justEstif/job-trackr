// auth/lucia.ts
import lucia from "lucia-auth";
import { node } from "lucia-auth/middleware";
import prisma from "@lucia-auth/adapter-prisma";
import prismaClient from "./prisma";

export const auth = lucia({
  adapter: prisma(prismaClient),
  env: process.env.NODE_ENV === "development" ? "DEV" : "PROD",
  middleware: node(),
});

export type Auth = typeof auth;
