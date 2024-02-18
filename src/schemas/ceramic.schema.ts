import { z } from "zod";

export const LinkSchema = z.object({
  url: z.string(),
  description: z.string().min(3).max(100).optional(),
});
export type LinkSchema = z.infer<typeof LinkSchema>;

export const UserProfileSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(3).max(1000),
  emoji: z.string().min(1).max(2),
  urls: LinkSchema.array(),
});
export type UserProfileSchema = z.infer<typeof UserProfileSchema>;
