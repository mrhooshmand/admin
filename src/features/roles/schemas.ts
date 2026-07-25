import {z} from "zod";

export const roleSchema = z
    .object({
        name: z
            .string()
            .min(3, "Name must be at least 3 characters")
            .max(50, "Name must be at most 50 characters")
            .regex(
                /^[a-zA-Z0-9_]+$/,
                "Name can only contain letters, numbers and underscore",
            ),

        description: z
            .string()
            .min(5, "Description must be at least 5 characters")
            .max(100, "Description must be at most 100 characters")
            .regex(/^[a-zA-Z 0-9]+$/, "Description can only contain letters and space"),
    })

export type RoleFormData = z.infer<typeof roleSchema>;
