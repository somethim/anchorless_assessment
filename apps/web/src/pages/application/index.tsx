import {useEffect, useState} from 'react';
import {toast} from 'sonner';
import {Identification} from '@/components/application/identification.tsx';
import {Other} from '@/components/application/other.tsx';
import {Visa} from '@/components/application/visa.tsx';
import {Button} from '@/components/ui/button';
import {type Attachment, useFileUpload} from '@/hooks/use-file-upload.ts';

export const Application = () => {
    const {isUploading, isSuccess, error, handleFileSubmit} = useFileUpload();
    const [attachments, setAttachments] = useState<Attachment[]>([]);

    useEffect(() => {
        if (isSuccess) {
            toast.success('Files uploaded successfully!');
        }
        if (error) {
            toast.error(`Error uploading files: ${error.name}`, {
                description: error.message,
            });
        }
    }, [isSuccess, error]);

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
                    setAttachments={setAttachments}
                />
                <Identification
                    attachments={attachments.filter(
                        (attachment) => attachment.type === 'identification'
                    )}
                    setAttachments={setAttachments}
                />
                <Other
                    attachments={attachments.filter(
                        (attachment) => attachment.type === 'other'
                    )}
                    setAttachments={setAttachments}
                />
            </section>
            <section className={'flex justify-end-safe'}>
                <Button
                    className={'w-auto'}
                    disabled={isUploading || attachments.length === 0}
                    onClick={() => handleFileSubmit({attachments})}
                >
                    Submit
                </Button>
            </section>
        </div>
    );
};
