import type { AxiosAdapter, InternalAxiosRequestConfig } from "axios";
import { AxiosError, AxiosHeaders } from "axios";
import { handleMockRequest } from "./handlers";

export const mockAdapter: AxiosAdapter = async (config) => {
	const result = await handleMockRequest(config as InternalAxiosRequestConfig);

	const response = {
		data: result.data,
		status: result.status,
		statusText: result.status >= 200 && result.status < 300 ? "OK" : "Error",
		headers: {},
		config: {
			...config,
			headers: AxiosHeaders.from(config.headers ?? {}),
		},
		request: {},
	};

	if (result.status >= 400) {
		throw new AxiosError(
			typeof result.data === "object" &&
				result.data &&
				"message" in result.data
				? String((result.data as { message: string }).message)
				: `Request failed with status code ${result.status}`,
			AxiosError.ERR_BAD_RESPONSE,
			response.config,
			response.request,
			response,
		);
	}

	return response;
};
