import {XIcon} from 'lucide-react';
import {useEffect, useState} from 'react';
import {Button} from '@/components/ui/button.tsx';
import {Dialog, DialogContent, DialogTrigger} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input.tsx';
import {Label} from '@/components/ui/label.tsx';
import type {Attachment} from '@/hooks/use-file-upload.ts';
import type {UUID} from '@/types/uuid.ts';

export const FileIconWithModal = ({
                                      file,
                                      onlyIcon = false,
                                  }: {
    file: File;
    onlyIcon?: boolean;
}) => {
    const [url, setUrl] = useState<string | null>(null);

    useEffect(() => {
        const blobUrl = URL.createObjectURL(file);
        setUrl(blobUrl);
        return () => URL.revokeObjectURL(blobUrl);
    }, [file]);

    const isImage = file.type.startsWith('image/');
    if (onlyIcon) {
        return isImage ? (
            <img
                src={url || ''}
                alt={file.name}
                className="w-8 h-8 object-cover rounded border mr-2"
            />
        ) : (
            <span
                className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded border text-xs font-bold mr-2">
                {file.type.startsWith('application/pdf') ? 'PDF' : 'FILE'}
            </span>
        );
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <span className="cursor-pointer mr-2 flex items-center">
                    {isImage ? (
                        <img
                            src={url || ''}
                            alt={file.name}
                            className="w-8 h-8 object-cover rounded border"
                        />
                    ) : (
                        <span
                            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded border text-xs font-bold">
                            {file.type.startsWith('application/pdf')
                                ? 'PDF'
                                : 'FILE'}
                        </span>
                    )}
                </span>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <div className="flex flex-col items-center">
                    <div className="mb-2 font-semibold">{file.name}</div>
                    {isImage ? (
                        <img
                            src={url || ''}
                            alt={file.name}
                            className="max-h-[60vh] max-w-full rounded border"
                        />
                    ) : (
                        <iframe
                            src={url || ''}
                            title={file.name}
                            className="w-full h-[60vh] border rounded"
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export const Visa = ({
                         attachments,
                         onFileRemoval,
                         onFileAdd,
                     }: {
    attachments: Attachment[];
    onFileRemoval: (id: UUID) => void;
    onFileAdd: (file: File) => void;
}) => {
    const triggerFileInput = () => {
        const fileInput = document.getElementById(
            'visa-upload'
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
                    <h3 className={'font-bold'}>National visa request form</h3>
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
                        {attachments.map((attachment, index) => (
                            <Dialog key={index}>
                                <DialogTrigger asChild>
                                    <li
                                        className={
                                            'flex items-center justify-between my-1 p-2 text-gray-700 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 transition-colors'
                                        }
                                        tabIndex={0}
                                        role="button"
                                        aria-label={`Preview file: ${attachment.file.name}`}
                                    >
                                        <FileIconWithModal
                                            file={attachment.file}
                                            onlyIcon
                                        />
                                        <span
                                            className={'overflow-auto flex-1'}
                                        >
                                            {attachment.file.name}
                                        </span>
                                        <Button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onFileRemoval(attachment._id);
                                            }}
                                            variant={'ghost'}
                                            size={'sm'}
                                            className={'ml-2 h-6 w-6 p-0'}
                                        >
                                            <XIcon size={14}/>
                                        </Button>
                                    </li>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <div className="flex flex-col items-center">
                                        <div className="mb-2 font-semibold">
                                            {attachment.file.name}
                                        </div>
                                        {attachment.file.type.startsWith(
                                            'image/'
                                        ) ? (
                                            <img
                                                src={URL.createObjectURL(
                                                    attachment.file
                                                )}
                                                alt={attachment.file.name}
                                                className="max-h-[60vh] max-w-full rounded border"
                                            />
                                        ) : (
                                            <iframe
                                                src={URL.createObjectURL(
                                                    attachment.file
                                                )}
                                                title={attachment.file.name}
                                                className="w-full h-[60vh] border rounded"
                                            />
                                        )}
                                    </div>
                                </DialogContent>
                            </Dialog>
                        ))}
                    </ul>
                ) : (
                    <p className={'text-gray-500 mt-2'}>
                        No files uploaded yet.
                    </p>
                )}
            </section>

            <section className={'ml-2 mt-auto'}>
                <Label htmlFor="visa-upload" className="block mb-2">
                    <Button
                        onClick={triggerFileInput}
                        variant="outline"
                        type="button"
                    >
                        Click to upload visa documents
                    </Button>
                </Label>
                <Input
                    id="visa-upload"
                    type="file"
                    onChange={(e) => {
                        if (!e.target.files?.[0]) return;
                        onFileAdd(e.target.files[0]);
                    }}
                    className="hidden"
                    accept=".pdf,.jpg,.png"
                />
            </section>
        </div>
    );
};
