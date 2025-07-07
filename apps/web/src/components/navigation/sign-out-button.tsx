import {DialogTrigger} from '@radix-ui/react-dialog';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {LogOutIcon} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import {toast} from 'sonner';
import {Button} from '@/components/ui/button.tsx';
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle,} from '@/components/ui/dialog.tsx';
import {getCookie, setCsrfToken} from '@/utils/cookies.ts';

export const SignOutButton = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const {mutate} = useMutation({
        mutationFn: async () => {
            await setCsrfToken();
            const xsrfToken = getCookie('XSRF-TOKEN');

            const response = await fetch(
                `${import.meta.env.VITE_PROVIDER_URL}/sign-out`,
                {
                    method: 'POST',
                    credentials: 'include',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',

                        'X-XSRF-TOKEN': decodeURIComponent(xsrfToken),
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
            toast.success('Sign Out');
            navigate('/authenticate');
        },
        onError: (error) => {
            toast.error('Could not sign out');

            console.error('Sign out error:', error);
        },
    });

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <LogOutIcon/>
                    <span className="capitalize">sign out</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Sign out</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to sign out?</p>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            mutate();
                        }}
                        variant="destructive"
                    >
                        Sign out
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
