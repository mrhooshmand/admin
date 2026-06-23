import { z } from "zod";

export const userSchema = z
	.object({
		username: z
			.string()
			.min(3, "Username must be at least 3 characters")
			.max(50, "Username must be at most 50 characters")
			.regex(
				/^[a-zA-Z0-9_]+$/,
				"Username can only contain letters, numbers and underscore",
			),

		email: z.email("Invalid email address").optional().or(z.literal("")),
		full_name: z
			.string()
			.max(100, "Full name must be at most 100 characters")
			.optional()
			.or(z.literal("")),

		password: z
			.string()
			.min(4, "Password must be at least 4 characters")
			.optional()
			.or(z.literal("")),

		confirmPassword: z.string().optional().or(z.literal("")),
	})
	.refine(
		(data) => {
			if (data.password && data.password !== data.confirmPassword) {
				return false;
			}
			return true;
		},
		{
			message: "Passwords do not match",
			path: ["confirmPassword"],
		},
	);

export type UserFormData = z.infer<typeof userSchema>;
