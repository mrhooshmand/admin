import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginRequest } from "../api/authApi";

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
