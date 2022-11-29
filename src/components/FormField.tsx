import type { InputHTMLAttributes } from 'react';

export function FormField({ id, labelText, className, ...inputProps }: InputHTMLAttributes<HTMLInputElement> & { labelText: string }) {
    return (
        <div className='mb-4'>
            <label htmlFor={id} className='block'>{labelText}</label>
            <input id={id} className='block w-full' {...inputProps} />
        </div>
    );
}
