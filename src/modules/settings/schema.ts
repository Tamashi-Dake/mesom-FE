import { z } from "zod";

export const displaySettingsSchema = z.object({
  theme: z.enum(["light", "dim", "dark"]),
  accent: z.enum(["blue", "yellow", "pink", "purple", "orange", "green"]),
});

export type DisplaySettingsFormData = z.infer<typeof displaySettingsSchema>;
