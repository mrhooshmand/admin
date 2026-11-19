import type { User } from "@/features/auth/types";
import type { Role } from "@/features/roles/types/types";
import type { Menu, Permission } from "@/features/auth/types";

export interface MockUser extends User {
	password: string;
}

export const MOCK_MENUS: Menu[] = [
	{ id: 784, code: "users", title: "Users" },
	{ id: 785, code: "roles", title: "Roles" },
	{ id: 1, code: "profile", title: "Profile" },
];

export const MOCK_PERMISSIONS: Permission[] = [
	{ id: 1, code: "view", title: "View" },
	{ id: 2, code: "create", title: "Create" },
	{ id: 3, code: "edit", title: "Edit" },
	{ id: 4, code: "delete", title: "Delete" },
];

function buildUsers(count = 25): MockUser[] {
	const users: MockUser[] = [
		{
			id: 1,
			username: "admin",
			password: "1234",
			email: "admin@example.com",
			full_name: "Admin User",
			created_at: "2024-01-01 10:00:00",
		},
	];

	for (let i = 1; i <= count; i++) {
		users.push({
			id: i + 1,
			username: `user_${i}`,
			password: "1234",
			email: `user${i}@example.com`,
			full_name: `User ${i}`,
			created_at: `2024-01-${String((i % 28) + 1).padStart(2, "0")} 12:00:00`,
		});
	}

	return users;
}

export const MOCK_USERS: MockUser[] = buildUsers(25);

export const MOCK_ROLES: Role[] = [
	{
		id: 1,
		name: "admin",
		description: "Administrator Role",
		created_at: "2024-01-01 10:00:00",
	},
	{
		id: 2,
		name: "manager",
		description: "Manager Role",
		created_at: "2024-01-02 10:00:00",
	},
	{
		id: 3,
		name: "operator",
		description: "Operator Role",
		created_at: "2024-01-03 10:00:00",
	},
	{
		id: 4,
		name: "viewer",
		description: "Viewer Role",
		created_at: "2024-01-04 10:00:00",
	},
];
