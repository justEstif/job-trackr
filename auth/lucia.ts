import lucia from "lucia-auth";
import { node } from "lucia-auth/middleware";
import prisma from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";
import "lucia-auth/polyfill/node";

export const auth = lucia({
  adapter: prisma(new PrismaClient()),
  env: process.env.NODE_ENV === "development" ? "DEV" : "PROD",
  middleware: node(),
  transformDatabaseUser: (userData) => {
    return {
      userId: userData.id,
      username: userData.username,
    };
  },
});

export type Auth = typeof auth;
