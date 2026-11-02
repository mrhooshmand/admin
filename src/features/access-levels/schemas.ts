import { z } from "zod";

export const accessLevelFilterSchema = z.object({
    title: z.string().max(80),
    status: z.enum(["-1", "0", "1"]),
});

export const accessLevelSchema = z.object({
    title: z.string().trim().min(1, "Title is required").max(80),
    roles: z.array(z.string()).min(1, "Select a module"),
    status: z.enum(["0", "1"]),
    permissions: z.array(z.string()),
});

export type AccessLevelFormData = z.infer<typeof accessLevelSchema>;
