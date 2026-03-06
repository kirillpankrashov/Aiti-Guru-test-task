import { useMutation } from '@tanstack/react-query';
import type { AuthFormValues } from '../../types/types';
import { auth } from '../../api/auth';
import type { AuthResponse } from '../../api/auth';

const useAuth = () => {
	return useMutation({
		mutationFn: async (body: AuthFormValues): Promise<AuthResponse> =>
			auth({ username: body.login, password: body.password }),
	});
};

export { useAuth };
