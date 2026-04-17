import { z } from "zod";

export const messageSchema = z.object({
  text: z.string().default(""),
});

export type MessageFormData = z.infer<typeof messageSchema>;
