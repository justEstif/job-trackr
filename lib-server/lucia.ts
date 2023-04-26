import lucia from "lucia-auth";
import { node } from "lucia-auth/middleware";
import prismaAdapter from "@lucia-auth/adapter-prisma";
import "lucia-auth/polyfill/node";
import { prisma } from "./prisma";

export const auth = lucia({
  adapter: prismaAdapter(prisma),
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
