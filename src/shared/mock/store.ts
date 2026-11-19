import {
	MOCK_MENUS,
	MOCK_PERMISSIONS,
	MOCK_ROLES,
	MOCK_USERS,
	type MockUser,
} from "./seed";
import type { Role } from "@/features/roles/types/types";
import type { Menu, Permission } from "@/features/auth/types";

const AUTH_KEY = "mock_auth_username";

function cloneUsers(): MockUser[] {
	return MOCK_USERS.map((user) => ({ ...user }));
}

function cloneRoles(): Role[] {
	return MOCK_ROLES.map((role) => ({ ...role }));
}

class MockStore {
	users: MockUser[] = cloneUsers();
	roles: Role[] = cloneRoles();
	menus: Menu[] = [...MOCK_MENUS];
	permissions: Permission[] = [...MOCK_PERMISSIONS];
	nextUserId = Math.max(...this.users.map((u) => u.id)) + 1;
	nextRoleId = Math.max(...this.roles.map((r) => r.id)) + 1;

	getSessionUsername(): string | null {
		return localStorage.getItem(AUTH_KEY);
	}

	setSession(username: string) {
		localStorage.setItem(AUTH_KEY, username);
	}

	clearSession() {
		localStorage.removeItem(AUTH_KEY);
	}

	findUserByUsername(username: string) {
		return this.users.find((user) => user.username === username);
	}

	findUserById(id: number) {
		return this.users.find((user) => user.id === id);
	}

	findRoleById(id: number) {
		return this.roles.find((role) => role.id === id);
	}

	publicUser(user: MockUser) {
		const { password: _password, ...rest } = user;
		return rest;
	}
}

export const mockStore = new MockStore();
