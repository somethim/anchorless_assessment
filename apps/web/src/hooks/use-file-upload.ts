import type {UUID} from '@/types/uuid';

const ATTACHMENT_TYPES = ['identification', 'visa', 'other'] as const;
export type AttachmentType = (typeof ATTACHMENT_TYPES)[number];

export type Attachment = {
    _id: UUID;
    type: AttachmentType;
    file: File;
};

export type ApplicationParams = {
    attachments: Attachment[];
    remove?: UUID[];
};
