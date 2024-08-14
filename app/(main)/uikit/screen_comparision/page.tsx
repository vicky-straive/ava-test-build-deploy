'use client';

import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Paginator } from 'primereact/paginator';
import { Ripple } from 'primereact/ripple';
import { InputText } from 'primereact/inputtext';

import { classNames } from 'primereact/utils';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { Image } from 'primereact/image';
import axios from 'axios';

import { useSetRecoilState, useRecoilValue } from 'recoil';
import { mediaFileState } from '../../../recoil/atoms/atoms';

export const Comparedetails =() => {
    const mediaDetails = useRecoilValue(mediaFileState);
    return (
        <div>
            <p className='text-900 font-medium'>File Name: <span className='text-500 font-medium'>{mediaDetails.data[0].name}</span></p>
        </div>
    )
} 

export default function ScreenComparison() {
    const mediaDetails = useRecoilValue(mediaFileState);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(1); // Set this to 1 to ensure each page represents one image
    const [currentPage, setCurrentPage] = useState(1);
    const [paginator, setPaginator] = useState([]);
    const [compareData, setCompareData] = useState([]);;
    const [imgData, setImgData] = useState([]);
    const [txtData, setTxtdata] = useState([]);
    const [pageInputTooltip, setPageInputTooltip] = useState("Press 'Enter' key to go to this page.");

    console.log('compareData', compareData);
    console.log('mediaDetails', mediaDetails);

    useEffect(() => {
        fetchPaginationID();
    }, []);

    useEffect(() => {
        fetchCompareData(currentPage);
    }, [currentPage]);

    const fetchCompareData = async (imgId: any) => {
        try {
            const apiUrl = 'http://10.93.10.186/Video-Automation/api/getImageExtractedText';
            const requestParams = { params: { media_id: mediaDetails.data[0]?.id, img_id: imgId } };
            const response = await axios.get(apiUrl, requestParams);
            console.log('compare', response.data);
            setCompareData(response.data);
            setImgData(response.data.image_file);
            setTxtdata(response.data.text_file);
        } catch (error) {
            console.error('Error fetching workflow data:', error);
        }
    };

    const fetchPaginationID = async () => {
        try {
            const apiUrl = 'http://10.93.10.186/Video-Automation/api/getImageExtractedTextIds';
            const requestParams = { params: { id: mediaDetails.data[0]?.id } };
            const response = await axios.get(apiUrl, requestParams);
            console.log('response', response);

            setPaginator(response.data.ids);
        } catch (error) {
            console.error('Error fetching workflow data:', error);
        }
    };

    const onPageChange = (e) => {
        const newPage = e.page + 1; // Calculate the new page number
        setCurrentPage(newPage); // Set the new page number
        setFirst(e.first); // Update the first index (optional, for UI purposes)
    };

    const onPageInputChange = (event: any) => {
        setCurrentPage(event.target.value);
    };

    const onPageInputKeyDown = (event: any, options: any) => {
        if (event.key === 'Enter') {
            const page = parseInt(currentPage);

            if (page < 1 || page > options.totalPages) {
                setPageInputTooltip(`Value must be between 1 and ${options.totalPages}.`);
            } else {
                const _first = (page - 1) * rows;
                setFirst(_first);
                setPageInputTooltip("Press 'Enter' key to go to this page.");
                setCurrentPage(page);
            }
        }
    };

    const template1 = {
        layout: 'PrevPageLink PageLinks NextPageLink RowsPerPageDropdown CurrentPageReport',
        PrevPageLink: (options: any) => (
            <button type="button" className={classNames(options.className, 'border-round')} onClick={options.onClick} disabled={options.disabled}>
                <span className="p-3">
                    <span className="pi pi-arrow-left"></span>
                </span>
                <Ripple />
            </button>
        ),
        NextPageLink: (options: any) => (
            <button type="button" className={classNames(options.className, 'border-round')} onClick={options.onClick} disabled={options.disabled}>
                <span className="p-3">
                    <span className="pi pi-arrow-right"></span>
                </span>
                <Ripple />
            </button>
        ),
        PageLinks: (options: any) => {
            if ((options.view.startPage === options.page && options.view.startPage !== 0) || (options.view.endPage === options.page && options.page + 1 !== options.totalPages)) {
                return (
                    <span className={classNames(options.className, { 'p-disabled': true })} style={{ userSelect: 'none' }}>
                        ...
                    </span>
                );
            }

            return (
                <button type="button" className={options.className} onClick={options.onClick}>
                    {options.page + 1}
                    <Ripple />
                </button>
            );
        },
        CurrentPageReport: (options: any) => (
            <span className="mx-3" style={{ color: 'var(--text-color)', userSelect: 'none' }}>
                Go to <InputText size="1" className="ml-1 mr-1" value={currentPage} tooltip={pageInputTooltip} onKeyDown={(e) => onPageInputKeyDown(e, options)} onChange={onPageInputChange} /> of {paginator?.length}
            </span>
        )
    };

    return (
        <div className="col-12">
            <div className="card" style={{ height: 'auto' }}>
                <div className="flex justify-content-around">
                    <div>
                        <h5 className="ml-2">Preview</h5>
                    </div>
                    <div>
                        <h5 className="mr-2">Extracted Text</h5>
                    </div>
                </div>
                <Splitter style={{ height: '65vh' }}>
                    <SplitterPanel className="flex align-items-center justify-content-center w-full">
                        {paginator.length > 0 ? (
                            <div>
                                <Image width="100%" src={`data:image/png;base64,${imgData}`} alt="Image" preview />
                            </div>
                        ) : (
                            <div className="align-items-center ">
                                <i className="pi pi-exclamation-triangle flex justify-content-center mb-5" style={{ fontSize: '4.5rem', color: 'var(--primary-color)' }}></i>
                                <p style={{ textAlign: 'center', }}>No preview available</p>
                            </div>
                        )}
                    </SplitterPanel>
                    <SplitterPanel className="flex align-items-center justify-content-center" style={{ height: '100%', width: '100%' }}>
                        {paginator.length > 0 ? (
                            <pre>{atob(txtData)}</pre>
                        ) : (
                            <div className="align-items-center ">
                                <i className="pi pi-exclamation-triangle flex justify-content-center mb-5" style={{ fontSize: '4.5rem', color: 'var(--primary-color)' }}></i>
                                <p style={{ textAlign: 'center' }}>No extracted text available</p>
                            </div>
                        )}
                    </SplitterPanel>
                </Splitter>
                <div className="mt-5">
                    <Paginator template={template1} first={first} rows={rows} totalRecords={paginator?.length} onPageChange={onPageChange} />
                </div>
            </div>
        </div>
    );
}
