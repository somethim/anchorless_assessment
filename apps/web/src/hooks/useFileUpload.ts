import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useState} from 'react';
import type {UUID} from '@/types/uuid.ts';

const attachmentsType = ['identification', 'visa', 'other'] as const;
type AttachmentType = (typeof attachmentsType)[number];

export type Attachment = {
    type: AttachmentType;
    file: File;
};

export type ApplicationProps = {
    attachments: Attachment[];
    remove?: UUID[];
};

const useFileUpload = () => {
    const queryClient = useQueryClient();
    const [error, setError] = useState<Error | null>(null);

    const uploadMutation = useMutation({
        mutationFn: async (data: {
            attachments: ApplicationProps['attachments'];
            remove?: ApplicationProps['remove'];
        }) => {
            const formData = new FormData();

            data.attachments.forEach((attachment, index) => {
                formData.append(`attachments[${index}][file]`, attachment.file);
                formData.append(`attachments[${index}][type]`, attachment.type);
            });

            const response = await fetch(
                `${process.env.PROVIDER_URL}/applications`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            return response.json();
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['applications']});
            setError(null);
        },
        onError: (error) => {
            setError(error);
        },
    });

    const handleFileSubmit = (formData: ApplicationProps) => {
        uploadMutation.mutate({
            attachments: formData.attachments,
            remove: formData.remove,
        });
    };

    return {
        handleFileSubmit,
        isUploading: uploadMutation.isPending,
        error: error || uploadMutation.error,
        isSuccess: uploadMutation.isSuccess,
    };
};

export {useFileUpload};
