import { z } from "zod";

export const updateProfileSchema = z.object({
  displayName: z.string().min(1, "Name can't be blank").max(50),
  bio: z.string().max(160).optional().default(""),
  location: z.string().max(30).optional().default(""),
  website: z.string().max(100).optional().default(""),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
