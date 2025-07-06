import {useAtom} from 'jotai/index';
import {XIcon} from 'lucide-react';
import * as React from 'react';
import {Button} from '@/components/ui/button.tsx';
import {Input} from '@/components/ui/input.tsx';
import {Label} from '@/components/ui/label.tsx';
import type {Attachment} from '@/hooks/useFileUpload.ts';
import {applicationAtom} from '@/jotai/application.ts';

export default () => {
    const [application, setApplication] = useAtom(applicationAtom);
    const attachments = application.attachments.filter(
        (attachment) => attachment.type === 'other'
    );

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            const newAttachment: Attachment = {
                file,
                type: 'other',
            };

            setApplication((prev) => ({
                ...prev,
                attachments: [...(prev.attachments || []), newAttachment],
            }));

            event.target.value = '';
        }
    };

    const handleRemoveFile = (index: number) => {
        setApplication((prev) => ({
            ...prev,
            attachments: prev.attachments?.filter((_, i) => i !== index) || [],
        }));
    };

    const triggerFileInput = () => {
        const fileInput = document.getElementById(
            'other-upload'
        ) as HTMLInputElement;
        fileInput?.click();
    };

    return (
        <div
            className={
                'border shadow p-4 rounded-xl bg-white flex flex-col h-full'
            }
        >
            <section className={'ml-3'}>
                <div className={'flex justify-between'}>
                    <h3 className={'font-bold'}>Other documents</h3>
                    <p
                        className={
                            'mr-4 text-gray-500 bg-gray-200 border-1 border-gray-300 rounded-xl px-2 py-1 text-sm'
                        }
                    >
                        {attachments
                            ? attachments.length === 1
                                ? '1 file'
                                : `${attachments.length} files`
                            : '0 files'}
                    </p>
                </div>
                <a
                    className={'underline text-gray-500 font-medium text-sm'}
                    href={'#'}
                >
                    You can download it from here.
                </a>
            </section>

            <section className={'ml-3 mt-4 flex-1 overflow-y-scroll'}>
                {attachments && attachments.length > 0 ? (
                    <ul className={'mt-2 p-1'}>
                        {attachments.map((file, index) => (
                            <li
                                key={index}
                                className={
                                    'flex items-center justify-between my-1 p-2 text-gray-700 bg-gray-100 rounded'
                                }
                            >
                                <span className={'overflow-auto'}>
                                    {file.file.name}
                                </span>
                                <Button
                                    onClick={() => handleRemoveFile(index)}
                                    variant={'ghost'}
                                    size={'sm'}
                                    className={'ml-2 h-6 w-6 p-0'}
                                >
                                    <XIcon size={14}/>
                                </Button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className={'text-gray-500 mt-2'}>
                        No files uploaded yet.
                    </p>
                )}
            </section>

            <section className={'ml-2 mt-auto'}>
                <Label htmlFor="other-upload" className="block mb-2">
                    <Button
                        onClick={triggerFileInput}
                        variant="outline"
                        type="button"
                    >
                        Click to upload other documents
                    </Button>
                </Label>
                <Input
                    id="other-upload"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.jpg,.png"
                />
            </section>
        </div>
    );
};
