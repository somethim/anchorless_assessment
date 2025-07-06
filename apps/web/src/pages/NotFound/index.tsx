import {Link} from 'react-router-dom';

export default () => {
    return (
        <div className={'flex flex-col items-center justify-center h-[70svh]'}>
            <h1 className={'text-5xl pb-2'}>404 Not Found</h1>
            <p className={'text-lg pb-2'}>
                The page you are looking for does not exist.
            </p>
            <Link to={'/'} className={'text-gray-700 text-lg'}>
                Go to Home
            </Link>
        </div>
    );
};
