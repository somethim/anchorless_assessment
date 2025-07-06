import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useState} from 'react';

interface AuthUser {
    id: string;
    email: string;
    name: string;
}

interface AuthenticateParams {
    email: string;
    password: string;
    name?: string;
    remember?: boolean;
}

export default () => {
    const queryClient = useQueryClient();
    const [error, setError] = useState<Error | null>(null);

    const {
        mutate,
        isPending,
        isSuccess,
        error: mutationError,
    } = useMutation({
        mutationFn: async ({
                               email,
                               password,
                               name,
                               remember,
                           }: AuthenticateParams): Promise<AuthUser> => {
            const body = {email, password, name, remember};
            if (name) body.name = name;
            if (remember !== undefined) body.remember = remember;

            const response = await fetch(`${process.env.PROVIDER_URL}/auth`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error(
                    (await response.json()).message || 'Authentication failed'
                );
            }

            const data = await response.json();
            return data as AuthUser;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['auth'], data);
        },
        onError: (error) => {
            setError(error);
            queryClient.setQueryData(['auth'], null);
        },
    });

    return {
        auth: mutate,
        isPending,
        isSuccess,
        error: error || mutationError,
        user: queryClient.getQueryData<AuthUser>(['auth']),
    };
};
