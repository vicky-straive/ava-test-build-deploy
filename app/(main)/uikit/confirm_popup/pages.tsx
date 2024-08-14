'use client'


import React, { useRef } from 'react';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';

export default function HeadlessDemo() {
    const toast = useRef(null);

    const accept = () => {
        if (toast.current) {
            (toast.current as any).show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
        }
    };

    const reject = () => {
        if (toast.current) {
            (toast.current as any).show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    };

    const confirm1 = () => {
        confirmDialog({
            message: 'Are you sure you want to proceed?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept,
            reject
        });
    };

    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog
                content={({ headerRef, contentRef, footerRef, hide, message }) => (
                    <div className="flex flex-column align-items-center p-5 surface-overlay border-round">
                        <div className="border-circle bg-primary inline-flex justify-content-center align-items-center h-6rem w-6rem -mt-8">
                            <i className="pi pi-question text-5xl"></i>
                        </div>
                        <span className="font-bold text-2xl block mb-2 mt-4" ref={headerRef as React.RefObject<HTMLSpanElement>}>
                            {message.header}
                        </span>
                        <p className="mb-0" ref={contentRef as React.RefObject<HTMLParagraphElement>}>
                            {message.message}
                        </p>
                        <div className="flex align-items-center gap-2 mt-4" ref={footerRef as React.RefObject<HTMLDivElement>}>
                            <Button
                                label="Save"
                                onClick={(event) => {
                                    hide(event);
                                    accept();
                                }}
                                className="w-8rem"
                            ></Button>
                            <Button
                                label="Cancel"
                                outlined
                                onClick={(event) => {
                                    hide(event);
                                    reject();
                                }}
                                className="w-8rem"
                            ></Button>
                        </div>
                    </div>
                )}
            />
            <div className="card flex flex-wrap gap-2 justify-content-center">
                <Button onClick={confirm1} icon="pi pi-check" label="Confirm"></Button>
            </div>
        </>
    )
}
        