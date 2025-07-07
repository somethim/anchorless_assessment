export type User = {
    _id: string;
    name: string | null;
    email: string;
    _createdAt: string;
    _updatedAt: string;
    _deletedAt: string | null;
    _verifiedAt: string | null;
};

export type AuthenticateParams = {
    email: string;
    password: string;
    name?: string;
    remember?: boolean;
};
