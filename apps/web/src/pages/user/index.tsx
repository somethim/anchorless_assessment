import {useQuery} from '@tanstack/react-query';
import {toast} from 'sonner';
import {DataTable} from '@/components/application/data-table.tsx';
import type {Applications} from '@/types/applicationResponse.ts';

export const User = () => {
    const {data, error, isLoading} = useQuery({
        queryKey: ['applications'],
        queryFn: async () => {
            const response = await fetch(
                `${import.meta.env.VITE_PROVIDER_URL}/applications`,
                {
                    credentials: 'include',
                    mode: 'cors',
                }
            );

            if (!response.ok)
                throw new Error(
                    `Fetching applications failed with: ${response.statusText}`
                );

            return (await response.json()) as Applications;
        },
    });

    if (error) {
        toast.error(error.message);
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto py-10">
            {data ? (
                <DataTable data={data.items}/>
            ) : (
                <div>No applications found.</div>
            )}
        </div>
    );
};
