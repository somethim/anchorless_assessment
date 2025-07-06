import {atom} from 'jotai';
import type {ApplicationProps} from '@/hooks/useFileUpload';

export const applicationAtom = atom<ApplicationProps>({
    attachments: [],
    remove: [],
});
