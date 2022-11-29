import { useContext, useEffect, useRef } from 'react';
import { GFORMS_POST_URL } from '../utils/constants';
import { FormValuesContext } from './contexts/FormValuesContext';

export function FinalForwardToGForms() {
    const { formValues } = useContext(FormValuesContext)!;

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (!(formRef.current)) {
            return;
        }

        formRef.current.submit();
    }, []);

    return (
        <>
            <p>Mohon tunggu sebentar, anda akan diarahkan ke Google Forms sesaat lagi...</p>
            <form ref={formRef} action={GFORMS_POST_URL} method='POST'>
                <input type='hidden' name='entry.1007815414' value={formValues.nama} />
                <input type='hidden' name='entry.662957076' value={formValues.umur} />
                <input type='hidden' name='entry.1927649973' value={formValues.prodi} />
                <input type='hidden' name='entry.1939594509' value={formValues.timeToTaskForVariantA[0] ?? ''} />
                <input type='hidden' name='entry.367688428' value={formValues.timeToTaskForVariantA[1] ?? ''} />
                <input type='hidden' name='entry.1332894438' value={formValues.timeToTaskForVariantA[2] ?? ''} />
                <input type='hidden' name='entry.1555142731' value={formValues.timeToTaskForVariantA[3] ?? ''} />
                <input type='hidden' name='entry.516546986' value={formValues.timeToTaskForVariantB[0] ?? ''} />
                <input type='hidden' name='entry.430156267' value={formValues.timeToTaskForVariantB[1] ?? ''} />
                <input type='hidden' name='entry.420259243' value={formValues.timeToTaskForVariantB[2] ?? ''} />
                <input type='hidden' name='entry.1487767922' value={formValues.timeToTaskForVariantB[3] ?? ''} />
                <input type='hidden' name='entry.1029420874' value={formValues.jenisKelamin!} />

                {formValues.taskCompletionForVariantA.map((item, index) => (
                    item && <input type='hidden' name='entry.2118516128' value={`task-${index + 1}`} />
                ))}

                {formValues.taskCompletionForVariantB.map((item, index) => (
                    item && <input type='hidden' name='entry.56165825' value={`task-${index + 1}`} />
                ))}

                {/* To allow continuing the fulfillment of the rest of the forms (e.g. SUS scores) */}
                <input type='hidden' name='continue' value='1' />
            </form>
        </>
    );
}
