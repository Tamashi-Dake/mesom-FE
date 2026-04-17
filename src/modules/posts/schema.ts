import { z } from "zod";

export const createPostSchema = z.object({
  text: z.string().default(""),
});

export type CreatePostFormData = z.infer<typeof createPostSchema>;
