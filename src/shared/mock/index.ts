export { mockAdapter } from "./adapter";
export { mockStore } from "./store";

export const isMockEnabled =
	import.meta.env.VITE_USE_MOCK === "true" ||
	import.meta.env.VITE_USE_MOCK === "1";
