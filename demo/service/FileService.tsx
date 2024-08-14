import { Demo } from '@/types';

export const FileService = {
    getUploadedFiles() {
        return fetch('/demo/data/uploadedFiles.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Files[]);
    },
}