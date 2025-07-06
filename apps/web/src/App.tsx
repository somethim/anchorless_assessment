import {BrowserRouter} from 'react-router-dom';
import './App.css';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {Toaster} from '@/components/ui/sonner.tsx';
import Routes from '@/pages/routes.tsx';

const queryClient = new QueryClient();

export default () => {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Toaster/>
                <Routes/>
            </BrowserRouter>
        </QueryClientProvider>
    );
};
