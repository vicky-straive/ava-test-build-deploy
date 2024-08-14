'use client';

import React, { useState,useRef } from 'react';
import { useSetRecoilState } from 'recoil';
import { uploadedFilesState } from '../../../recoil/atoms/atoms';
import { FileUpload } from 'primereact/fileupload';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import URLLinks from '@/app/api/links';



export const UploadFiles = () => {
    const {SER_BASE_CONNECTION} = URLLinks

    const [visible, setVisible] = useState(false);
    const setUploadedFiles = useSetRecoilState(uploadedFilesState);
    const toast = useRef<Toast>(null);

  const onUpload = async (event: { files: File[] }) => {
  const uploadedFiles = event.files;
  const formData = new FormData();
    
  uploadedFiles.forEach(file => {
      formData.append('files[]', file);
  });

  console.log("uploadedFiles", uploadedFiles);
  console.log("formd", formData);

  try {
      const response = await axios.post(`${SER_BASE_CONNECTION}/uploadMedia`, formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      });
      if (Array.isArray(response.data.files)) {
          setUploadedFiles(prevFiles => [...prevFiles, ...response.data.files]);
      } else if (response.data.files) {
          setUploadedFiles(prevFiles => [...prevFiles, response.data.files]);
      } else {
          console.warn('No files data in the response');
      }
      console.log('Upload response:', response.data);
      // Update the Recoil state with the new uploaded files
      // setUploadedFiles(prevFiles => [...prevFiles, ...response.data.files]);
      setVisible(false)
      toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Media Uploaded Successfully!',
          life: 3000
      });
  } catch (error: any) {
      console.error('Error uploading files:', error);
      let errorMessage = 'Upload Failed!';
      if (error?.response) {
          errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
          errorMessage = 'No response received from server';
      } else {
          errorMessage = error.message;
      }
      setVisible(false)
      toast.current?.show({
          severity: 'error',
          summary: 'Something went wrong',
          detail: 'Media Uploaded Failed!',
          life: 3000
      });
  }
};
    return (
        <div className="flex justify-content-center">
            <Button label="Upload Files" icon="pi pi-upload" onClick={() => setVisible(true)} />
            <Toast ref={toast} />
            <Dialog header="Upload Files" visible={visible} onHide={() => setVisible(false)} style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                <div className="">
                    <FileUpload
                        name="files"
                        customUpload
                        uploadHandler={onUpload}
                        multiple
                        accept="video/*,audio/*"
                        maxFileSize={10000000}
                        emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
                    />
                </div>
            </Dialog>
        </div>
    );
};
