import { createContext, Dispatch, SetStateAction } from 'react';

export const FormValuesContext = createContext<{
    formValues: FormValues,
    setFormValues: Dispatch<SetStateAction<FormValues>>
} | null>(null);
