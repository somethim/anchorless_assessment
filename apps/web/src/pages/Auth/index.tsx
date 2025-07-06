import useAuth from '@/hooks/useAuth';

export default () => {
    const {auth, isPending, isSuccess, user, error} = useAuth();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">
                Welcome to the Auth Page
            </h1>
            <p className="text-lg text-gray-700">
                This is a simple authentication page.
            </p>
        </div>
    );
};
