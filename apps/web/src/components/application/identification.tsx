import {XIcon} from 'lucide-react';
import {FileIconWithModal} from '@/components/application/visa.tsx';
import {Button} from '@/components/ui/button.tsx';
import {Dialog, DialogContent, DialogTrigger} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input.tsx';
import {Label} from '@/components/ui/label.tsx';
import type {Attachment} from '@/hooks/use-file-upload.ts';
import type {UUID} from '@/types/uuid.ts';

export const Identification = ({
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
            'identification-upload'
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
                    <h3 className={'font-bold'}>Identification documents</h3>
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
                            <Dialog key={index}>
                                <DialogTrigger asChild>
                                    <li
                                        className={
                                            'flex items-center justify-between my-1 p-2 text-gray-700 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 transition-colors'
                                        }
                                        tabIndex={0}
                                        role="button"
                                        aria-label={`Preview file: ${file.file.name}`}
                                    >
                                        <FileIconWithModal
                                            file={file.file}
                                            onlyIcon
                                        />
                                        <span
                                            className={'overflow-auto flex-1'}
                                        >
                                            {file.file.name}
                                        </span>
                                        <Button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onFileRemoval(file._id);
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
                                            {file.file.name}
                                        </div>
                                        {file.file.type.startsWith('image/') ? (
                                            <img
                                                src={URL.createObjectURL(
                                                    file.file
                                                )}
                                                alt={file.file.name}
                                                className="max-h-[60vh] max-w-full rounded border"
                                            />
                                        ) : (
                                            <iframe
                                                src={URL.createObjectURL(
                                                    file.file
                                                )}
                                                title={file.file.name}
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
                <Label htmlFor="identification-upload" className="block mb-2">
                    <Button
                        onClick={triggerFileInput}
                        variant="outline"
                        type="button"
                    >
                        Click to upload your identification documents
                    </Button>
                </Label>
                <Input
                    id="identification-upload"
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
