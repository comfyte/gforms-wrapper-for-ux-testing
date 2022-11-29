import { useContext, useEffect, useRef, useState } from 'react';
import { PROTO_A_URL, PROTO_B_URL } from '../utils/constants';
import { FormValuesContext } from './contexts/FormValuesContext';

const taskStrings = [
    'Mencari barang dengan kata kunci \'kursi gaming\', kemudian memilih toko online dengan harga termurah.',
    'Ingin menonton film paling top saat ini (Black Panther: Wakanda Forever), kemudian memilih bioskop dengan harga tiket termurah.',
    'Saya mempunyai informasi promo dan ingin membagikannya di platform ini.',
    'Saya ingin melihat semua promo hasil kontribusi saya sejauh ini.'
];

export function VariantSpecificStep({ variant, onContinue, isFinalVariant }: StepProps & { variant: 'A' | 'B', isFinalVariant?: boolean }) {
    const { setFormValues } = useContext(FormValuesContext)!;

    const protoEmbedUrl = variant === 'A' ? PROTO_A_URL : PROTO_B_URL;

    const [isEmbedReady, setEmbedReady] = useState(false);

    const [taskData, setTaskData] = useState<[boolean, number | null][]>([]);

    const taskStartTime = useRef<number | null>(null);

    const controlBarRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);


    useEffect(() => {
        // Adjust the iframe height on each control border element change
        if (iframeRef.current && controlBarRef.current) {
            iframeRef.current.style.height = `calc(100vh - ${controlBarRef.current.offsetHeight}px)`
        }

        if (!isEmbedReady) {
            return;
        }

        if (taskData.length >= taskStrings.length) {
            setFormValues((prev) => ({
                ...prev,
                [`taskCompletionForVariant${variant}`]: taskData.map(([x,]) => x),
                [`timeToTaskForVariant${variant}`]: taskData.map(([, x]) => x)
            }));

            if (!isFinalVariant) {
                window.alert(`Selanjutnya, Anda akan melakukan pengujian pada varian ${variant === 'A' ? 'B' : 'A'}.`);
            }

            onContinue();
            return;
        }

        window.alert(`TUGAS ${taskData.length + 1}:\n"${taskStrings[taskData.length]}"\n\nBila Anda telah memahami maksud tugas ini, silakan tekan OK.\n\nHarap ingat untuk menekan tombol "TUGAS SELESAI" di atas layar ketika Anda telah mencapai tujuan tugas ini.`);
        taskStartTime.current = Date.now();
    }, [taskData, isEmbedReady]);

    const onTaskGiveUp = () => {
        const isYes = window.confirm(`Apakah anda yakin ingin menyerah dalam melakukan tugas ke-${taskData.length + 1} ini?`);

        if (isYes) {
            setTaskData((prev) => [...prev, [
                false,
                null
            ]]);
        }
    }

    const onTaskSuccess = () => {
        const taskEndTime = Date.now();

        setTaskData((prev) => [...prev, [
            true,
            new Date(taskEndTime - taskStartTime.current!).getSeconds()
        ]]);
    }

    return (
        <>
            <div className='flex items-center justify-between p-4 bg-yellow-200' ref={controlBarRef}>
                {!isEmbedReady ? (
                    <>
                        <p>Apakah tampilan sudah selesai termuat?</p>
                        <button type='button' onClick={() => {setEmbedReady(true)}} className='button ml-4'>
                            Sudah
                        </button>
                    </>
                ) : (
                    <>
                        <div>
                            <p className='text-lg'><span className='font-bold'>Varian {variant}</span> ({taskData.length + 1}/{taskStrings.length})</p>
                        </div>
                        <div className='flex ml-4 items-center'>
                            <button type='button' className='button bg-red-500' onClick={onTaskGiveUp}>
                                Saya menyerah
                            </button>
                            <button type='button' className='button bg-green-500 ml-2' onClick={onTaskSuccess}>
                                Tugas selesai
                            </button>
                        </div>
                    </>
                )}
            </div>
            <div className='flex-grow'>
                <iframe
                    src={protoEmbedUrl}
                    allowFullScreen
                    className='block w-full'
                    ref={iframeRef}
                />
            </div>
        </>
    );
}
