import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginRequest,registerRequest } from "../api/authApi";

export function useLogin() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: loginRequest,

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["me"],
			});
		},
	});
}
export function useRegister() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: registerRequest,

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["me"],
			});
		},
	});
}
