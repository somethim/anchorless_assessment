import {useMutation, useQueryClient} from '@tanstack/react-query';
import type {AuthenticateParams, User} from '@/types/user';
import {getCookie, setCsrfToken} from '@/utils/cookies';

export const useAuth = () => {
    const queryClient = useQueryClient();

    const {mutate, isSuccess, error} = useMutation({
        mutationFn: async ({
                               email,
                               password,
                               name,
                               remember,
                           }: AuthenticateParams): Promise<User> => {
            await setCsrfToken();
            const xsrfToken = getCookie('XSRF-TOKEN');

            const body = {email, password, name, remember};
            if (name) body.name = name;
            if (remember !== undefined) body.remember = remember;

            const response = await fetch(
                `${import.meta.env.VITE_PROVIDER_URL}/auth`,
                {
                    method: 'POST',
                    credentials: 'include',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'X-XSRF-TOKEN': decodeURIComponent(xsrfToken),
                    },
                    body: JSON.stringify(body),
                }
            );

            if (!response.ok) {
                throw new Error(
                    (await response.json()).message || 'Authentication failed'
                );
            }

            return (await response.json()) as User;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['auth'], data);
        },
    });

    return {
        auth: mutate,
        isSuccess,
        error,
        user: queryClient.getQueryData<User>(['auth']),
    };
};
