import {zodResolver} from '@hookform/resolvers/zod';
import {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';
import {z} from 'zod';
import {Button} from '@/components/ui/button';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {useAuth} from '@/hooks/use-auth';

const signInSchema = z.object({
    email: z.string().email({message: 'Invalid email address'}),
    password: z
        .string()
        .min(6, {message: 'Password must be at least 6 characters'}),
    remember: z.boolean().optional(),
});

type SignInValues = z.infer<typeof signInSchema>;

export const Auth = () => {
    const form = useForm<SignInValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: '',
            remember: false,
        },
    });

    const {auth, isSuccess, error} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isSuccess) {
            form.reset();
            navigate('/applications', {replace: true});
        }
    }, [isSuccess, form, navigate]);

    const onSubmit = (values: SignInValues) => {
        auth(values);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
                <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="you@example.com"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="remember"
                            render={({field}) => (
                                <FormItem className="flex flex-row items-center space-x-2">
                                    <FormControl>
                                        <input
                                            type="checkbox"
                                            id="remember"
                                            checked={field.value}
                                            onChange={field.onChange}
                                            className="mr-2"
                                        />
                                    </FormControl>
                                    <FormLabel htmlFor="remember">
                                        Remember me
                                    </FormLabel>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        {error && (
                            <div className="text-destructive text-sm text-center">
                                {error.message}
                            </div>
                        )}
                        <Button type="submit" className="w-full">
                            Sign In
                        </Button>
                        {isSuccess && (
                            <div className="text-green-600 text-sm text-center mt-2">
                                Signed in successfully!
                            </div>
                        )}
                    </form>
                </Form>
            </div>
        </div>
    );
};
