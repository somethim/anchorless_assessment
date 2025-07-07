import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useParams} from 'react-router-dom';
import {Identification} from '@/components/application/identification.tsx';
import {Other} from '@/components/application/other.tsx';
import {Visa} from '@/components/application/visa.tsx';
import type {Attachment, AttachmentType} from '@/hooks/use-file-upload.ts';
import type {ApplicationResponse} from '@/types/applicationResponse.ts';
import type {UUID} from '@/types/uuid.ts';
import {getCookie, setCsrfToken} from '@/utils/cookies.ts';

export const ShowApplication = () => {
    const {id: application} = useParams();
    const queryClient = useQueryClient();

    const {data: attachments} = useQuery({
        queryKey: ['applications', application],
        queryFn: async () => {
            const response = await fetch(
                `${import.meta.env.VITE_PROVIDER_URL}/applications/${application}`,
                {
                    credentials: 'include',
                    mode: 'cors',
                }
            );

            if (!response.ok)
                throw new Error(
                    `Fetching application of id: ${application} failed with: ${response.statusText}`
                );

            const result = (await response.json()) as ApplicationResponse;

            return await Promise.all(
                result.attachments.map(async ({path, type, _id}) => {
                    const blob = await fetch(path, {
                        credentials: 'include',
                        mode: 'no-cors',
                    }).then((response) => response.blob());

                    const name = path.split('/').pop() ?? 'unknown.png';

                    const extension =
                        name.split('.').pop()?.toLowerCase() ?? 'png';

                    return {
                        _id,
                        file: new File([blob], name, {type: extension}),
                        name,
                        type,
                    };
                })
            );
        },
    });

    const {mutate: remove} = useMutation({
        mutationFn: async (id: UUID) => {
            await setCsrfToken();
            const xsrfToken = getCookie('XSRF-TOKEN');

            const response = await fetch(
                `${import.meta.env.VITE_PROVIDER_URL}/applications/${application}?_method=PATCH`,
                {
                    method: 'POST',
                    credentials: 'include',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'X-XSRF-TOKEN': decodeURIComponent(xsrfToken),
                    },
                    body: JSON.stringify({remove: [id]}),
                }
            );

            if (!response.ok) throw new Error('Failed to remove attachment');
            return await response.json();
        },
        onSuccess: async (_, file) => {
            queryClient.setQueryData<Attachment[]>(
                ['applications', application],
                (attachments) => {
                    if (!attachments) return attachments;

                    return attachments.filter(
                        (attachment) => attachment._id !== file
                    );
                }
            );
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['applications', application],
            });
        },
    });

    const {mutate: add} = useMutation({
        mutationFn: async ({
                               file,
                               type,
                           }: {
            file: File;
            type: AttachmentType;
        }) => {
            if (!attachments) return;

            await setCsrfToken();
            const xsrfToken = getCookie('XSRF-TOKEN');

            const formData = new FormData();

            formData.append(`attachments[${attachments.length}][file]`, file);
            formData.append(`attachments[${attachments.length}][type]`, type);

            const response = await fetch(
                `${import.meta.env.VITE_PROVIDER_URL}/applications/${application}?_method=PATCH`,
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

            return response.json();
        },
        onSuccess: async (_, file) => {
            queryClient.setQueryData<Attachment[]>(
                ['applications', application],
                (attachments) => {
                    if (!attachments) return attachments;

                    return [
                        ...attachments,
                        {
                            ...file,
                            _id: 'uuid/new' as UUID,
                            path: file.file.name,
                        },
                    ];
                }
            );
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['applications', application],
            });
        },
    });

    if (!attachments) {
        return <div>Loading...</div>;
    }

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
                    onFileRemoval={remove}
                    onFileAdd={(file) => add({file, type: 'visa'})}
                />
                <Identification
                    attachments={attachments.filter(
                        (attachment) => attachment.type === 'identification'
                    )}
                    onFileRemoval={remove}
                    onFileAdd={(file) => add({file, type: 'identification'})}
                />
                <Other
                    attachments={attachments.filter(
                        (attachment) => attachment.type === 'other'
                    )}
                    onFileRemoval={remove}
                    onFileAdd={(file) => add({file, type: 'other'})}
                />
            </section>
        </div>
    );
};
