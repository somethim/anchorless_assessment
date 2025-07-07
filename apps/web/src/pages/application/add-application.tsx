import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from 'sonner';
import {Identification} from '@/components/application/identification.tsx';
import {Other} from '@/components/application/other.tsx';
import {Visa} from '@/components/application/visa.tsx';
import {Button} from '@/components/ui/button';
import {type ApplicationParams, type Attachment, type AttachmentType,} from '@/hooks/use-file-upload.ts';
import type {ApplicationResponse} from '@/types/applicationResponse.ts';
import type {UUID} from '@/types/uuid.ts';
import {getCookie, setCsrfToken} from '@/utils/cookies.ts';

export const Application = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const {mutate: submit, isPending} = useMutation({
        mutationFn: async (data: ApplicationParams) => {
            await setCsrfToken();
            const xsrfToken = getCookie('XSRF-TOKEN');

            const formData = new FormData();

            data.attachments.forEach((attachment, index) => {
                formData.append(`attachments[${index}][file]`, attachment.file);
                formData.append(`attachments[${index}][type]`, attachment.type);
            });

            const response = await fetch(
                `${import.meta.env.VITE_PROVIDER_URL}/applications`,
                {
                    method: 'POST',
                    body: formData,
                    mode: 'cors',
                    credentials: 'include',
                    headers: {
                        Accept: 'application/json',
                        'X-XSRF-TOKEN': decodeURIComponent(xsrfToken),
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            return (await response.json()) as ApplicationResponse;
        },
        onSuccess: async ({_id}) => {
            await queryClient.invalidateQueries({queryKey: ['applications']});
            toast.success('Application created successfully');
            navigate(`/application/${_id}`);
        },
        onError: async (error: Error) => {
            toast.error(`Could not create application: ${error.message}`);
        },
    });
    const [attachments, setAttachments] = useState<Attachment[]>([]);

    const handleFileAdd = (file: File, type: AttachmentType) => {
        setAttachments([
            ...attachments,
            {file, _id: 'some/id' as UUID, type},
        ]);
    };

    const handleFileRemoval = (id: UUID) => {
        setAttachments(
            attachments.filter((attachment) => attachment._id !== id)
        );
    };

    return (
        <div
            className={
                'border shadow p-4 rounded-xl bg-white flex flex-col gap-4'
            }
        >
            <section className={'flex justify-between items-center'}>
                <h4 className={'font-bold text-lg'}>
                    Essential documents to be reviewed
                </h4>
                <p className={'text-blue-600 font-semibold'}>
                    {attachments.length ?? 0}/27 files uploaded
                </p>
            </section>
            <section
                className={'grid grid-cols-3 gap-4 min-h-[40vh] max-h-[80vh]'}
            >
                <Visa
                    attachments={attachments.filter(
                        (attachment) => attachment.type === 'visa'
                    )}
                    onFileAdd={(file) => handleFileAdd(file, 'visa')}
                    onFileRemoval={handleFileRemoval}
                />
                <Identification
                    attachments={attachments.filter(
                        (attachment) => attachment.type === 'identification'
                    )}
                    onFileAdd={(file) => handleFileAdd(file, 'identification')}
                    onFileRemoval={handleFileRemoval}
                />
                <Other
                    attachments={attachments.filter(
                        (attachment) => attachment.type === 'other'
                    )}
                    onFileAdd={(file) => handleFileAdd(file, 'other')}
                    onFileRemoval={handleFileRemoval}
                />
            </section>
            <section className={'flex justify-end-safe'}>
                <Button
                    className={'w-auto'}
                    disabled={isPending || attachments.length === 0}
                    onClick={() => submit({attachments})}
                >
                    Submit
                </Button>
            </section>
        </div>
    );
};
