import {FileTextIcon, HomeIcon, LockKeyholeOpenIcon, type LucideIcon, UserIcon,} from 'lucide-react';
import * as React from 'react';
import {Link, Route, Routes} from 'react-router-dom';
import SignOutButton from '@/components/navigation/SignOutButton';
import {Button} from '@/components/ui/button';
import Application from '@/pages/Application';
import Auth from '@/pages/Auth';
import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';
import User from '@/pages/User';

type RouteType = {
    path: string;
    component: React.ComponentType;
    title: string;
    icon: LucideIcon;
    navbar: boolean;
};

const ROUTES: RouteType[] = [
    {
        path: '/',
        component: Home,
        title: 'home',
        icon: HomeIcon,
        navbar: true,
    },
    {
        path: '/current-user',
        component: User,
        title: 'user',
        icon: UserIcon,
        navbar: true,
    },
    {
        path: '/applications',
        component: Application,
        title: 'applications',
        icon: FileTextIcon,
        navbar: true,
    },
    {
        path: '/authenticate',
        component: Auth,
        title: 'authenticate',
        icon: LockKeyholeOpenIcon,
        navbar: false,
    },
];

export default () => {
    return (
        <div className="min-h-screen">
            <nav className="max-w-7xl mx-auto px-4">
                <ul className="flex gap-1 list-none items-center justify-center">
                    {ROUTES.map(({path, title, icon: Icon, navbar}) => {
                        if (!navbar) {
                            return;
                        }
                        if (title === 'sign out') {
                            return (
                                <li key={title}>
                                    <SignOutButton/>
                                </li>
                            );
                        }
                        return (
                            <li key={title}>
                                <Link to={path}>
                                    <Button variant={'outline'}>
                                        <Icon/>
                                        <span className="capitalize">
                                            {title}
                                        </span>
                                    </Button>
                                </Link>
                            </li>
                        );
                    })}
                    {!ROUTES.some((r) => r.title === 'sign out') && (
                        <li key="sign-out">
                            <SignOutButton/>
                        </li>
                    )}
                </ul>
            </nav>

            <main>
                <Routes>
                    {ROUTES.map(({path, component: Component}) => (
                        <Route
                            key={path}
                            path={path}
                            element={Component ? <Component/> : null}
                        />
                    ))}
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </main>
        </div>
    );
};
