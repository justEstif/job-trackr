import { z } from "zod";

export const signUpSchema = {
  post: {
    body: z.object({
      username: z.string(),
      password: z.string(),
    }),
  },
};
