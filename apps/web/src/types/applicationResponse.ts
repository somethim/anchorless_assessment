import type {AttachmentType} from '@/hooks/use-file-upload.ts';
import type {UUID} from '@/types/uuid.ts';

type Attachment = {
    path: string;
    _id: UUID;
    type: AttachmentType;
};

export type ApplicationResponse = {
    _id: string;
    user_uuid: string;
    _createdAt: string;
    _updatedAt: string;
    _deletedAt: string | null;
    attachments: Attachment[];
};

export type Pagination = {
    firstPage: number;
    currentPage: number;
    lastPage: number;
    firstPageUrl: string;
    lastPageUrl: string;
    perPage: number;
    nextPageUrl: string | null;
    prevPageUrl: string | null;
    total: number;
    hasMorePages: boolean;
};

export type Applications = {
    items: Omit<ApplicationResponse, 'attachments'>[];
    pagination: Pagination;
};
