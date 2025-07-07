export function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    const parsed = parts.pop()!.split(';').shift();
    if (!parsed) throw new Error('Invalid cookie');
    return parsed;
}

export const setCsrfToken = async () => {
    await fetch(`${import.meta.env.VITE_PROVIDER_URL}/sanctum/csrf-cookie`, {
        credentials: 'include',
        mode: 'cors',
    });
};
