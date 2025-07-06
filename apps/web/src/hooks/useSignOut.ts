import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useState} from 'react';

export default () => {
    const queryClient = useQueryClient();
    const [error, setError] = useState<Error | null>(null);

    const {
        mutate,
        isPending,
        isSuccess,
        error: mutationError,
    } = useMutation({
        mutationFn: async () => {
            const response = await fetch(
                `${process.env.PROVIDER_URL}/sign-out`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Sign out failed');
            }

            return response.json();
        },
        onSuccess: async () => {
            queryClient.setQueryData(['auth'], null);
            await queryClient.invalidateQueries();
        },
        onError: (error) => {
            setError(error);
            queryClient.setQueryData(['auth'], null);
        },
    });

    return {
        signOut: mutate,
        isPending,
        isSuccess,
        error: error || mutationError,
    };
};
