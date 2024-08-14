'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { Demo } from '@/types';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { FileService } from '../../../../demo/service/FileService';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { ScrollPanel } from 'primereact/scrollpanel';
import { SpeedDial } from 'primereact/speeddial';
import { Tooltip } from 'primereact/tooltip';
import { Dialog } from 'primereact/dialog';

import AssignWorkflow from '../assign_workflow/page';

import axios from 'axios';
import URLLinks from '@/app/api/links';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { ApiFile, apiFilesState, mediaFileState, dialogResState } from '../../../recoil/atoms/atoms';

export default function MultipleInteractionCard() {
    const router = useRouter();
    const [dataViewValue, setDataViewValue] = useState<Demo.Media[]>([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filteredValue, setFilteredValue] = useState<Demo.Media[] | null>(null);
    const [layout, setLayout] = useState<'grid' | 'list' | (string & Record<string, unknown>)>('grid');
    const [sortKey, setSortKey] = useState(null);
    const [sortOrder, setSortOrder] = useState<0 | 1 | -1 | null>(null);
    const [sortField, setSortField] = useState('');
    const setApiFiles = useSetRecoilState(apiFilesState);
    const apiFiles = useRecoilValue(apiFilesState);
    const setMediaFile = useSetRecoilState(mediaFileState);
    const mediaDetails = useRecoilValue(mediaFileState);
    const { SER_BASE_CONNECTION } = URLLinks;
    const digvisible = useRecoilValue(dialogResState);
    const digsetVisible = useSetRecoilState(dialogResState);

    console.log('digvisible', digvisible);
    

    const sortOptions = [
        { label: 'Date Recent to Start', value: '!date' },
        { label: 'Date Start to Recent', value: 'date' }
    ];

    const items = [
        {
            label: 'Compare Video',
            icon: 'pi pi-arrow-right-arrow-left',
            command: () => {
                router.push('/pages/video_comparison');
            }
        },
        {
            label: 'Compare Screen',
            icon: 'pi pi-clone',
            command: () => {
                router.push('/pages/compare_screen');
            }
        },
        {
            label: 'Assign Workflow',
            icon: 'pi pi-sitemap',
            command: () => {
                digsetVisible(true);
            }
        }
    ];

    useEffect(() => {
        FileService.getUploadedFiles().then((data) => setDataViewValue(data));
        setGlobalFilterValue('');
        getMediaData();
    }, []);

    useEffect(() => {
        FileService.getUploadedFiles().then((data) => setDataViewValue(data));
        setGlobalFilterValue('');
    }, []);

    const onFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGlobalFilterValue(value);
        if (value.length === 0) {
            setFilteredValue(null);
        } else {
            const filtered = dataViewValue?.filter((file) => {
                const productNameLowercase = file.name?.toLowerCase() ?? '';
                const searchValueLowercase = value.toLowerCase();
                return productNameLowercase.includes(searchValueLowercase);
            });

            setFilteredValue(filtered);
        }
    };

    const getMediaData = async () => {
        try {
            const response = await axios.get(`${SER_BASE_CONNECTION}/getMediaList`);
            setApiFiles(response.data);
        } catch (error) {
            console.error('Error fetching API data:', error);
        }
    };

    const onSortChange = (event: DropdownChangeEvent) => {
        const value = event.value;

        if (value.indexOf('!') === 0) {
            setSortOrder(-1);
            setSortField(value.substring(1, value.length));
            setSortKey(value);
        } else {
            setSortOrder(1);
            setSortField(value);
            setSortKey(value);
        }
    };

    const videoRef = useRef<HTMLVideoElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    const syncAudio = () => {
        if (videoRef.current && audioRef.current) {
            if (videoRef.current.paused) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            } else {
                if (audioRef.current.paused) {
                    audioRef.current.play();
                }
            }
        }
    };

    const dataViewHeader = (
        <div className="flex flex-column md:flex-row md:justify-content-between gap-2">
            <Dropdown value={sortKey} options={sortOptions} optionLabel="label" placeholder="Sort By Date" onChange={onSortChange} />
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilterValue} onChange={onFilter} placeholder="Search by Name" />
            </span>
            <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
        </div>
    );

    console.log('apiFiles', apiFiles);

    const dataviewListItem = (data: Demo.Files) => {
        return (
            <div className="col-12">
                <div className="flex flex-column md:flex-row align-items-center p-3 w-full">
                    <img src={`/demo/images/product/${data.image}`} alt={data.name} className="my-4 md:my-0 w-9 md:w-10rem shadow-2 mr-5" />
                    <div className="flex-1 flex flex-column align-items-center text-center md:text-left">
                        <div className="font-bold text-2xl">{data.name}</div>
                        <div className="mb-2">{data.description}</div>
                        <div className="flex align-items-center">
                            <i className="pi pi-tag mr-2"></i>
                            {/* <span className="font-semibold">{data.category}</span> */}
                        </div>
                    </div>
                    <div className="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
                        <span className="text-2xl font-semibold mb-2 align-self-center md:align-self-end">{data.date}</span>
                    </div>
                </div>
            </div>
        );
    };

    const dataviewGridItem = (data: ApiFile) => {
        return (
            <div className="col-12 lg:col-4">
                <div className="card m-3 border-1 surface-border">
                    <div className="flex flex-wrap justify-content-center mb-2 ">
                        {data.type === 'video' && (
                            <div key={data.id}>
                                <video height={230} width={'100%'} onMouseEnter={(e) => e.currentTarget.setAttribute('controls', 'controls')} onMouseLeave={(e) => e.currentTarget.removeAttribute('controls')}>
                                    <source src={data.url} type={`video/${data.format}`} />
                                </video>
                            </div>
                        )}

                        {data.type === 'audio' && (
                            <div>
                                <video
                                    ref={videoRef}
                                    onMouseEnter={(e) => e.currentTarget.setAttribute('controls', 'controls')}
                                    onMouseLeave={(e) => e.currentTarget.removeAttribute('controls')}
                                    loop
                                    height={205}
                                    width={'100%'}
                                    onPlay={syncAudio}
                                    onPause={syncAudio}
                                    onEnded={() => {
                                        if (audioRef.current) {
                                            audioRef.current.pause();
                                            audioRef.current.currentTime = 0;
                                        }
                                    }}
                                >
                                    <source src="/demo/asset/soundLoader.mp4" type="video/mp4" />
                                    Your browser does not support the video element.
                                </video>

                                <audio ref={audioRef} preload="auto">
                                    <source src={data.url} type={`audio/${data.format}`} />
                                    Your browser does not support the audio element.
                                </audio>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2 align-items-center justify-content-between mb-2">
                        <div className="flex align-items-center"></div>
                    </div>
                    <div className="flex flex-column align-items-center text-center mb-3"></div>
                    <div className="flex flex-row  justify-content-between	">
                        <div className="flex flex-column">
                            <div className="text-xl font-bold">{data.name}</div>
                            <div className="flex align-items-center justify-content-between">
                                <span className="text-2s">{data.date}</span>
                            </div>
                        </div>
                        <div className="flex flex-column flex-nowrap" style={{ top: '-165px', right: '35px', position: 'relative' }}>
                            <Tooltip target=".speeddial-bottom-left .p-speeddial-action" position="right" />
                            <SpeedDial model={items} direction="up" onClick={() => setMediaFile({ data: [{ ...data, id: parseInt(data.id) }] })} className="speeddial-bottom-left" />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const itemTemplate = (data: ApiFile, layout: 'grid' | 'list' | (string & Record<string, unknown>)) => {
        if (!data) {
            return;
        }
        if (layout === 'list') {
            // return dataviewListItem(data);
        } else if (layout === 'grid') {
            return dataviewGridItem(data);
        }
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card scrollpanel-demo">
                    <div className="flex flex-column md:flex-row gap-5">
                        <div className="flex-auto">
                            <ScrollPanel style={{ width: '100%', height: 'calc(77.5vh - 7.7rem)' }} className="custombar1">
                                <div className="">
                                    {/* <h5>DataView</h5> */}
                                    <DataView value={filteredValue || apiFiles.data} layout={layout} paginator rows={12} sortOrder={sortOrder} sortField={sortField} itemTemplate={itemTemplate} header={dataViewHeader}></DataView>
                                </div>
                            </ScrollPanel>
                        </div>
                    </div>
                </div>
                <div className="flex justify-content-center">
                    {digvisible && (
                        <Dialog
                            header="Assign Workflow"
                            visible={digvisible}
                            maximizable
                            style={{ width: '90vw' }}
                            onHide={() => {
                                digsetVisible(false);
                            }}
                            breakpoints={{ '960px': '75vw', '641px': '100vw' }}
                        >
                            <AssignWorkflow />
                        </Dialog>
                    )}
                </div>
            </div>
        </div>
    );
}
