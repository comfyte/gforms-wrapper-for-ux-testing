type NBool = boolean | null;
type NNum = number | null;

interface FormValues {
    nama: string;
    umur: string;
    jenisKelamin: 'L' | 'P' | null;
    prodi: string;
    taskCompletionForVariantA: [NBool, NBool, NBool, NBool],
    taskCompletionForVariantB: [NBool, NBool, NBool, NBool],
    timeToTaskForVariantA: [NNum, NNum, NNum, NNum],
    timeToTaskForVariantB: [NNum, NNum, NNum, NNum]
}
