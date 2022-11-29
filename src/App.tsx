import { useContext, useEffect, useState } from 'react';
import { FormValuesContext } from './components/contexts/FormValuesContext';
import { FinalForwardToGForms } from './components/FinalForwardToGForms';
import { FormField } from './components/FormField';
import { VariantSpecificStep } from './components/VariantSpecificStep';

enum Steps {
    Greeting,
    Identity,
    PathChoice,
    FirstVariantTesting,
    SecondVariantTesting,
    FinalProcessing
}

function StepGreeting({ onContinue }: StepProps) {
    return (
        <div className='flex-grow flex flex-col justify-center p-8'>
            <p className='text-4xl font-bold mb-4'>Halo!</p>
            <p className='mb-4'>
                Terima kasih telah bersedia untuk membantu riset kami.
                Aplikasi rancangan kami bertujuan untuk memudahkan masyarakat
                dalam melakukan penghematan dengan cara mengonsolidasi informasi-informasi
                penghematan ke dalam satu aplikasi.
            </p>
            <p className='mb-4'>
                Sebelumnya, apakah Anda bersedia untuk berpartisipasi dalam riset kami?
            </p>
            <button type='button' className='button bg-green-500' onClick={onContinue}>Ya, saya bersedia &rarr;</button>
        </div>
    );
}

function StepIdentity({ onContinue }: StepProps) {
    const { formValues, setFormValues } = useContext(FormValuesContext)!;

    return (
        <div className='p-8'>
            <h1 className='text-4xl font-bold mb-4'>Silakan isi data dirimu</h1>
            <p className='mb-8'>Data yang kamu masukkan akan tetap aman dan tidak akan kami sebarluaskan.</p>
            <form onSubmit={(evr) => {
                evr.preventDefault();
                onContinue();
            }}>
                <FormField
                    type='text'
                    id='nama'
                    labelText='Nama Inisial (boleh asli ataupun samaran)'
                    value={formValues.nama}
                    onChange={(ev) => {
                        setFormValues((p) => ({
                            ...p,
                            nama: ev.target.value
                        }))
                    }}
                    required
                />
                <FormField
                    type='number'
                    id='umur'
                    labelText='Umur'
                    value={formValues.umur}
                    onChange={(ev) => {
                        setFormValues((p) => ({
                            ...p,
                            umur: ev.target.value
                        }))
                    }}
                    required
                />

                <label htmlFor='jenisKelamin' className='block mb-2'>Jenis Kelamin</label>
                <div className='mb-4'>
                    <div className='mb-2'>
                        <input
                            id='jenisKelaminLakiLaki'
                            name='jenisKelamin'
                            type='radio'
                            checked={formValues.jenisKelamin === 'P'}
                            onChange={() => { setFormValues((p) => ({ ...p, jenisKelamin: 'P' })) }}
                            required
                            className='mr-1.5'
                        />
                        <label htmlFor='jenisKelaminLakiLaki'>Perempuan</label>
                    </div>

                    <div>
                        <input
                            id='jenisKelaminPerempuan'
                            name='jenisKelamin'
                            type='radio'
                            checked={formValues.jenisKelamin === 'L'}
                            onChange={() => { setFormValues((p) => ({ ...p, jenisKelamin: 'L' })) }}
                            required
                            className='mr-1.5'
                        />
                        <label htmlFor='jenisKelaminPerempuan'>Laki-laki</label>
                    </div>
                </div>

                <FormField
                    type='text'
                    id='prodi'
                    labelText='Program Studi'
                    value={formValues.prodi}
                    onChange={(ev) => {
                        setFormValues((p) => ({
                            ...p,
                            prodi: ev.target.value
                        }))
                    }}
                    required
                />

                <button type='submit' className='button w-full mt-8'>Lanjut</button>
            </form>
        </div>
    );
}

function VariantChoiceButton({
    variant,
    setterFunc,
    onContinue
}: StepProps & {
    setterFunc: (arg: typeof variant) => any,
    variant: 'A' | 'B'
}) {
    return (
        <button
            onClick={() => {setterFunc(variant); onContinue();}}
            className='block p-8 w-full mb-4 last:mb-0 bg-black bg-opacity-10 hover:bg-opacity-20 transition-colors rounded-lg font-light text-xl'
        >
            Varian {variant}
        </button>
    )
};


export function App() {
    const [formValues, setFormValues] = useState<FormValues>({
        nama: '',
        umur: '',
        jenisKelamin: null,
        prodi: '',
        taskCompletionForVariantA: [null, null, null, null],
        taskCompletionForVariantB: [null, null, null, null],
        timeToTaskForVariantA: [null, null, null, null],
        timeToTaskForVariantB: [null, null, null, null],
    });

    const [firstVariantChoice, setFirstVariantChoice] = useState<'A' | 'B' | null>(null);

    const [currentStep, setCurrentStep] = useState(Steps.Greeting);

    const nextStep = () => {
        setCurrentStep((prev) => Math.min(++prev, StepComponents.length - 1));
    }

    // Just for logging and debugging purposes only
    useEffect(() => {
        console.log(formValues);
    }, [formValues]);

    const StepPathChoice = ({ onContinue }: StepProps) => (
        <div className='p-8 flex-grow flex flex-col justify-center'>
            <h1 className='text-4xl font-bold mb-4'>Varian mana yang ingin Anda coba terlebih dahulu?</h1>
            <p className='mb-8'>Kami mempunyai 2 varian yang akan kami uji.</p>
            <div>
                <VariantChoiceButton variant='A' setterFunc={setFirstVariantChoice} onContinue={onContinue} />
                <VariantChoiceButton variant='B' setterFunc={setFirstVariantChoice} onContinue={onContinue} />
            </div>
        </div>
    );

    const variants = ['A', 'B'] as const;

    const StepComponents = [
        StepGreeting,
        StepIdentity,
        StepPathChoice,
        () => <VariantSpecificStep variant={firstVariantChoice!} onContinue={nextStep} />,
        () => <VariantSpecificStep variant={variants.filter((v) => v !== firstVariantChoice)[0]} onContinue={nextStep} isFinalVariant />,
        FinalForwardToGForms
    ];

    const CurrentRenderedComponent = StepComponents[currentStep];

    return (
        <FormValuesContext.Provider value={{ formValues, setFormValues }}>
            <div className='min-h-screen max-w-screen-md mx-auto relative flex flex-col bg-gray-200'>
                <CurrentRenderedComponent onContinue={nextStep} />
            </div>

            {/* Prevent opening from devices other than mobile */}
            <aside className='fixed top-0 left-0 w-full h-full bg-gray-800 text-white hidden md:flex flex-col items-center justify-center'>
                <p className='font-light text-xl'>Mohon buka halaman ini di ponsel Anda.</p>
            </aside>
        </FormValuesContext.Provider>
    );
}
