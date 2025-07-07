import {FilePenIcon, FileTextIcon, LockKeyholeOpenIcon, type LucideIcon,} from 'lucide-react';
import * as React from 'react';
import {Link, Route, Routes} from 'react-router-dom';
import {SignOutButton} from '@/components/navigation/sign-out-button';
import {Button} from '@/components/ui/button';
import {Application} from '@/pages/application/add-application.tsx';
import {ShowApplication} from '@/pages/application/show-application.tsx';
import {NotFound} from '@/pages/not-found';
import {User} from '@/pages/user';
import {Auth} from './auth';

type RouteType = {
    path: string;
    component: React.ComponentType;
    title: string;
    icon: LucideIcon;
    navbar: boolean;
};

const ROUTES: RouteType[] = [
    {
        path: '/applications',
        component: User,
        title: 'applications',
        icon: FileTextIcon,
        navbar: true,
    },
    {
        path: '/add-application',
        component: Application,
        title: 'add application',
        icon: FilePenIcon,
        navbar: true,
    },
    {
        path: '/application/:id',
        component: ShowApplication,
        title: 'application detail',
        icon: FileTextIcon,
        navbar: false,
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
            <nav className="max-w-7xl mx-auto px-4 pb-4">
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
