import {useAtom} from 'jotai';
import {useEffect} from 'react';
import {toast} from 'sonner';
import {Button} from '@/components/ui/button';
import {useFileUpload} from '@/hooks/useFileUpload';
import {applicationAtom} from '@/jotai/application';
import Passport from '../../components/application/Identification.tsx';
import Other from '../../components/application/Other.tsx';
import Visa from '../../components/application/Visa.tsx';

export default () => {
    const [application] = useAtom(applicationAtom);
    const {isUploading, isSuccess, error, handleFileSubmit} = useFileUpload();

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
                    {application.attachments.length ?? 0}/27 files uploaded
                </p>
            </section>
            <section
                className={'grid grid-cols-3 gap-4 min-h-[40vh] max-h-[80vh]'}
            >
                <Visa/>
                <Passport/>
                <Other/>
            </section>
            <section className={'flex justify-end-safe'}>
                <Button
                    className={'w-auto'}
                    disabled={
                        isUploading || application.attachments.length === 0
                    }
                    onClick={() => handleFileSubmit(application)}
                >
                    Submit
                </Button>
            </section>
        </div>
    );
};
