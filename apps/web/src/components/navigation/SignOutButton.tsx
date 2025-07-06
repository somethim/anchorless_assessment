import {DialogTrigger} from '@radix-ui/react-dialog';
import {LogOutIcon} from 'lucide-react';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from 'sonner';
import {Button} from '@/components/ui/button.tsx';
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle,} from '@/components/ui/dialog.tsx';
import useSignOut from '@/hooks/useSignOut.ts';

const SignOutButton = () => {
    const {signOut, isPending, isSuccess, error} = useSignOut();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isPending) {
            toast.loading('Signing out...');
        }
        if (error && !isPending) {
            toast.error(`Error signing out: ${error.name}`, {
                description: error.message,
            });
        }
        if (isSuccess) {
            toast.success('Successfully signed out!');
            setOpen(false);
            navigate('/');
        }
    }, [error, isPending, isSuccess, navigate]);

    return (
        <>
            <Button variant="outline" onClick={() => setOpen(true)}>
                <LogOutIcon/>
                <span className="capitalize">sign out</span>
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Sign out</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to sign out?</p>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" disabled={isPending}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            onClick={(e) => {
                                e.preventDefault();
                                signOut();
                            }}
                            variant="destructive"
                            disabled={isPending}
                        >
                            {isPending ? 'Signing out...' : 'Sign out'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default SignOutButton;
