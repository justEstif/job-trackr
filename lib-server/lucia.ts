// auth/lucia.ts
import lucia from "lucia-auth";
import { node } from "lucia-auth/middleware";
import prisma from "@lucia-auth/adapter-prisma";
import prismeClient from "./prisma";

export const auth = lucia({
  adapter: prisma(prismeClient),
  env: process.env.NODE_ENV === "development" ? "DEV" : "PROD",
  middleware: node(),
});

export type Auth = typeof auth;
