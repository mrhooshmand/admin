import type { AxiosRequestConfig } from "axios";
import { mockStore } from "./store";
import type { MockUser } from "./seed";
import type { Role } from "@/features/roles/types/types";

export interface MockResult {
	status: number;
	data: unknown;
}

type SearchBody = {
	fields?: Record<string, string | number | undefined>;
	page?: number;
	pageSize?: number;
	order?: string;
	orderType?: string;
};

function parseBody(config: AxiosRequestConfig): Record<string, unknown> {
	if (!config.data) return {};
	if (typeof config.data === "string") {
		try {
			return JSON.parse(config.data) as Record<string, unknown>;
		} catch {
			return {};
		}
	}
	return config.data as Record<string, unknown>;
}

function normalizePath(url = ""): string {
	const withoutBase = url.replace(/^https?:\/\/[^/]+/i, "");
	const path = withoutBase.split("?")[0] ?? "";
	return path.replace(/\/+$/, "") || "/";
}

function paginate<T>(
	items: T[],
	page: number,
	pageSize: number,
	order: string,
	orderType: "asc" | "desc",
) {
	const sorted = [...items].sort((a, b) => {
		const left = (a as Record<string, unknown>)[order];
		const right = (b as Record<string, unknown>)[order];
		if (left === right) return 0;
		if (left == null) return 1;
		if (right == null) return -1;
		const cmp = left > right ? 1 : -1;
		return orderType === "asc" ? cmp : -cmp;
	});

	const safePage = Math.max(page, 1);
	const safeSize = Math.max(pageSize, 1);
	const total = sorted.length;
	const totalPages = Math.max(1, Math.ceil(total / safeSize));
	const start = (safePage - 1) * safeSize;

	return {
		data: sorted.slice(start, start + safeSize),
		pagination: {
			page: safePage,
			pageSize: safeSize,
			total,
			totalPages,
			order,
			orderType,
		},
	};
}

function ok(data: unknown, status = 200): MockResult {
	return { status, data };
}

function fail(message: string, status = 400, extra: Record<string, unknown> = {}): MockResult {
	return {
		status,
		data: {
			status: "error",
			message,
			error: message,
			...extra,
		},
	};
}

function handleSearchUsers(body: SearchBody): MockResult {
	const fields = body.fields ?? {};
	const username = String(fields.username ?? "").trim().toLowerCase();
	const email = String(fields.email ?? "").trim().toLowerCase();
	const fullName = String(fields.full_name ?? "").trim().toLowerCase();

	let filtered = mockStore.users.map((user) => mockStore.publicUser(user));

	if (username) {
		filtered = filtered.filter((user) =>
			user.username.toLowerCase().includes(username),
		);
	}
	if (email) {
		filtered = filtered.filter((user) =>
			user.email.toLowerCase().includes(email),
		);
	}
	if (fullName) {
		filtered = filtered.filter((user) =>
			user.full_name.toLowerCase().includes(fullName),
		);
	}

	const order = body.order ?? "created_at";
	const orderType = (body.orderType ?? "desc").toLowerCase() === "asc" ? "asc" : "desc";
	const result = paginate(
		filtered,
		Number(body.page ?? 1),
		Number(body.pageSize ?? 20),
		order,
		orderType,
	);

	return ok({
		status: "success",
		message: "",
		data: result.data,
		pagination: result.pagination,
	});
}

function handleSearchRoles(body: SearchBody): MockResult {
	const fields = body.fields ?? {};
	const name = String(fields.name ?? "").trim().toLowerCase();
	const description = String(fields.description ?? "").trim().toLowerCase();

	let filtered = [...mockStore.roles];

	if (name) {
		filtered = filtered.filter((role) =>
			role.name.toLowerCase().includes(name),
		);
	}
	if (description) {
		filtered = filtered.filter((role) =>
			role.description.toLowerCase().includes(description),
		);
	}

	const order = body.order ?? "created_at";
	const orderType = (body.orderType ?? "desc").toLowerCase() === "asc" ? "asc" : "desc";
	const result = paginate(
		filtered,
		Number(body.page ?? 1),
		Number(body.pageSize ?? 20),
		order,
		orderType,
	);

	return ok({
		status: "success",
		message: "",
		data: result.data,
		pagination: result.pagination,
	});
}

export async function handleMockRequest(
	config: AxiosRequestConfig,
): Promise<MockResult> {
	// slight delay so loading states still feel real
	await new Promise((resolve) => setTimeout(resolve, 120));

	const method = (config.method ?? "get").toLowerCase();
	const path = normalizePath(config.url);
	const body = parseBody(config);

	if (method === "get" && path.endsWith("/health")) {
		return ok({ status: "ok" });
	}

	if (method === "post" && path.endsWith("/login")) {
		const username = String(body.username ?? "");
		const password = String(body.password ?? "");
		const user = mockStore.findUserByUsername(username);

		if (!user || user.password !== password) {
			return fail("Invalid credentials", 401);
		}

		mockStore.setSession(user.username);

		return ok({
			message: "Login successful",
			user: {
				username: user.username,
				email: user.email,
				full_name: user.full_name,
			},
			menus: mockStore.menus,
		});
	}

	if (method === "post" && path.endsWith("/register")) {
		const username = String(body.username ?? "");
		const password = String(body.password ?? "");
		const email = String(body.email ?? "");
		const full_name = String(body.full_name ?? "");

		if (!username || !password) {
			return fail("Username and password required");
		}
		if (password.length < 4) {
			return fail("Password must be at least 4 characters");
		}
		if (mockStore.findUserByUsername(username)) {
			return fail("Username already exists");
		}

		const newUser: MockUser = {
			id: mockStore.nextUserId++,
			username,
			password,
			email,
			full_name,
			created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
		};
		mockStore.users.push(newUser);
		mockStore.setSession(username);

		return ok(
			{
				token: "mock-token",
				user: {
					username,
					email,
					full_name,
				},
			},
			201,
		);
	}

	if (method === "post" && path.endsWith("/logout")) {
		mockStore.clearSession();
		return ok({ message: "Logged out successfully" });
	}

	if (method === "get" && path.endsWith("/me")) {
		const username = mockStore.getSessionUsername();
		if (!username) {
			return fail("Not authorised, please sign in", 401);
		}

		const user = mockStore.findUserByUsername(username);
		if (!user) {
			return fail("User not found", 404);
		}

		return ok({
			username: user.username,
			email: user.email,
			full_name: user.full_name,
			created_at: user.created_at,
		});
	}

	if (method === "get" && path.endsWith("/menus")) {
		return ok({
			status: "success",
			message: "",
			data: mockStore.menus.filter((menu) => menu.code !== "profile"),
		});
	}

	if (method === "post" && path.endsWith("/getAccess")) {
		return ok({
			status: "success",
			message: "",
			data: mockStore.permissions,
		});
	}

	if (method === "post" && path.endsWith("/users/search")) {
		return handleSearchUsers(body as SearchBody);
	}

	if (method === "post" && /\/users$/.test(path)) {
		const fields = (body.fields ?? {}) as Record<string, string>;
		const username = fields.username ?? "";
		const password = fields.password ?? "";
		const email = fields.email ?? "";
		const full_name = fields.full_name ?? "";

		if (!username || !password) {
			return fail("Username and password required");
		}
		if (password.length < 4) {
			return fail("Password must be at least 4 characters");
		}
		if (mockStore.findUserByUsername(username)) {
			return fail("Username already exists");
		}

		const newUser: MockUser = {
			id: mockStore.nextUserId++,
			username,
			password,
			email,
			full_name,
			created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
		};
		mockStore.users.push(newUser);

		return ok({
			status: "success",
			message: "User created successfully",
			data: { id: newUser.id, username: newUser.username },
		});
	}

	const userIdMatch = path.match(/\/users\/(\d+)$/);
	if (userIdMatch) {
		const userId = Number(userIdMatch[1]);
		const user = mockStore.findUserById(userId);

		if (method === "put") {
			if (!user) return fail("User not found", 404);
			if (user.username === "admin") {
				return fail("Cannot modify admin user", 403);
			}

			const fields = (body.fields ?? {}) as Record<string, string>;
			if (fields.username) user.username = fields.username;
			if (fields.email !== undefined) user.email = fields.email;
			if (fields.full_name !== undefined) user.full_name = fields.full_name;
			if (fields.password) user.password = fields.password;

			return ok({
				status: "success",
				message: "User updated successfully",
				data: { id: user.id, username: user.username },
			});
		}

		if (method === "delete") {
			if (!user) return fail("User not found", 404);
			if (user.username === "admin") {
				return fail("Cannot delete admin user", 403);
			}

			mockStore.users = mockStore.users.filter((item) => item.id !== userId);
			return ok({
				status: "success",
				message: "User deleted successfully!",
			});
		}
	}

	if (method === "put" && path.endsWith("/users/bulkDelete")) {
		const fields = (body.fields ?? {}) as { ids?: number[] };
		const ids = fields.ids ?? [];

		if (!ids.length) {
			return fail("No users selected");
		}

		const selected = mockStore.users.filter((user) => ids.includes(user.id));
		if (!selected.length) {
			return fail("No users found", 404);
		}
		if (selected.some((user) => user.username === "admin")) {
			return fail("Cannot delete admin user", 403);
		}

		mockStore.users = mockStore.users.filter((user) => !ids.includes(user.id));

		return ok({
			status: "success",
			message: `${selected.length} users deleted successfully`,
			data: { ids },
		});
	}

	if (method === "post" && path.endsWith("/roles/search")) {
		return handleSearchRoles(body as SearchBody);
	}

	if (method === "post" && /\/roles$/.test(path)) {
		const name = String(body.name ?? "");
		const description = String(body.description ?? "");

		if (!name || !description) {
			return fail("Name and description required");
		}
		if (mockStore.roles.some((role) => role.name === name)) {
			return fail("Role already exists");
		}

		const newRole: Role = {
			id: mockStore.nextRoleId++,
			name,
			description,
			created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
		};
		mockStore.roles.push(newRole);

		return ok({
			status: "success",
			message: "Role created successfully",
			data: { id: newRole.id, name: newRole.name },
		});
	}

	const roleIdMatch = path.match(/\/roles\/(\d+)$/);
	if (roleIdMatch) {
		const roleId = Number(roleIdMatch[1]);
		const role = mockStore.findRoleById(roleId);

		if (method === "put") {
			if (!role) return fail("Role not found", 404);
			if (role.name === "admin") {
				return fail("Cannot modify admin role", 403);
			}

			const name = String(body.name ?? "");
			const description = String(body.description ?? "");
			if (!name || !description) {
				return fail("Name and Description are required");
			}

			role.name = name;
			role.description = description;

			return ok({
				status: "success",
				message: "Role updated successfully",
				data: { id: role.id, name: role.name },
			});
		}

		if (method === "delete") {
			if (!role) return fail("Role not found", 404);
			if (role.name === "admin") {
				return fail("Cannot delete admin role", 403);
			}

			mockStore.roles = mockStore.roles.filter((item) => item.id !== roleId);
			return ok({
				status: "success",
				message: "Role deleted successfully!",
			});
		}
	}

	return fail(`Mock route not found: ${method.toUpperCase()} ${path}`, 404);
}
