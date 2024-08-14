'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Steps } from 'primereact/steps';
import { Toast } from 'primereact/toast';
import { FloatLabel } from 'primereact/floatLabel';
import { InputText } from 'primereact/inputtext';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Badge } from 'primereact/badge';
import { Divider } from 'primereact/divider';
import { ScrollPanel } from 'primereact/scrollpanel';
import { ProgressBar } from 'primereact/progressbar';

import axios from 'axios';
import URLLinks from '@/app/api/links';

import { useSetRecoilState, useRecoilValue } from 'recoil';
import { apiProcessState, refreshWorkflowListState } from '../../../recoil/atoms/atoms';

export const AddWorkflow = () => {
    const {SER_BASE_CONNECTION} = URLLinks

    const [visible, setVisible] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedVideoP, setSelectedVideoP] = useState<string[]>([]);
    const [selectedAudioP, setSelectedAudioP] = useState<string[]>([]);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [workflowName, setWorkflowName] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [selectedProcessList, setSelectedProcessList] = useState<string[] | null>(null);
    const [videoList, setVideoList] = useState<string[]>([]);
    const [bothList, setBothList] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const setLocalApiProcess = useSetRecoilState(apiProcessState);
    const apiLocalApiProcess = useRecoilValue(apiProcessState);
    const videoProcesses = Array.isArray(apiLocalApiProcess.data) ? [] : videoList;
    const BothProcesses = Array.isArray(apiLocalApiProcess.data) ? [] : bothList;
    const [selectedProcesses, setSelectedProcesses] = useState<Array<{ id: number; name: string; optional_flag: string }>>([]);
    const setRefreshWorkflowList = useSetRecoilState(refreshWorkflowListState);

    interface Workflow {
        workflow_name: string;
        created_by: string;
        optional_flag: string;
        tasklist: { id: number }[];
    }

    const [formattedWorkflow, setFormattedWorkflow] = useState<Workflow>({
        workflow_name: '',
        created_by: '',
        optional_flag: '',
        tasklist: []
    });

    useEffect(() => {
        getProcess();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const toast = useRef<Toast>(null);
    const items = [
        {
            label: 'Details',
            command: (event: { originalEvent: React.SyntheticEvent; item: { label: string } }) => {
                // toast.current?.show({ severity: 'info', summary: 'First Step', detail: event.item.label });
            }
        },
        {
            label: 'Configure',
            command: (event: { originalEvent: React.SyntheticEvent; item: { label: string } }) => {
                // toast.current?.show({ severity: 'info', summary: 'Second Step', detail: event.item.label });
            }
        },
        {
            label: 'Confirm',
            command: (event: { originalEvent: React.SyntheticEvent; item: { label: string } }) => {
                // toast.current?.show({ severity: 'info', summary: 'Third Step', detail: event.item.label });
            }
        }
    ];

    const getProcess = async () => {
        try {
            const response = await axios.get(`${SER_BASE_CONNECTION}/getProcessList`);
            const videoProcesses = response.data.data.filter((process: { work_process: string }) => process.work_process === 'VIDEO');
            const bothProcesses = response.data.data.filter((process: { work_process: string }) => process.work_process === 'BOTH');
            setVideoList(videoProcesses);
            setBothList(bothProcesses);
            setLocalApiProcess({ data: response.data });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching API data:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Something went wrong',
                detail: error instanceof Error ? error.message : 'An unknown error occurred',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const goToNextStep = () => {
        if (workflowName && createdBy) {
            setActiveIndex((prevIndex) => prevIndex + 1);
        }
    };

    const finalStep = async () => {
        if (selectedProcesses.length > 0) {
            const formattedData: Workflow = {
                workflow_name: workflowName,
                created_by: createdBy,
                tasklist: selectedProcesses.map((process) => ({ id: process.id })),
                optional_flag: '' // Add a default value or get it from somewhere
            };
            setFormattedWorkflow(formattedData);
            try {
                const response = await axios.post(`${SER_BASE_CONNECTION}/addWorkflow`, formattedData);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'New process created ',
                    life: 3000
                });
                setWorkflowName('');
                setCreatedBy('');
                setSelectedProcesses([]);
                setActiveIndex(0);
                setRefreshWorkflowList(true);
                setVisible(false);
            } catch (error) {
                console.error('Error sending workflow data:', error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Something went wrong',
                    detail: error instanceof Error ? error.message : 'An unknown error occurred',
                    life: 3000
                });
                // Handle error (e.g., show error message)
            } finally {
            }
        }
    };

    const shouldDisableProcess = (process: { optional_flag?: string; id: string | number }) => {
        if (!process.optional_flag || process.optional_flag === 'null') return false;
        return selectedProcesses.some((selectedProcess) => selectedProcess.optional_flag === process.optional_flag && selectedProcess.id !== process.id);
    };

    console.log('process:', selectedProcessList);

    const audioP = ['Audio Test', 'Post Processing Audio', 'Audio Trimming', 'Beta Ray'];

    return (
        <div className="flex justify-content-center">
            <Toast ref={toast}></Toast>
            <Button label="Create New Process" icon="pi pi-plus" onClick={() => setVisible(true)} />
            <Dialog header="Create New Process" visible={visible} onHide={() => setVisible(false)} style={{ width: '90vw', height: 'auto' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                <div className="card">
                    <div className="">
                        <Steps model={items} activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={false} />
                    </div>
                </div>
                {/* <ScrollPanel style={{ width: '100%', height: '300px' }}> */}
                {/* Process list details */}
                {activeIndex == 0 && (
                    <div title="Add Process Details" className="card">
                        <div className="grid">
                            <div className="p-fluid w-full">
                                <div className="flex justify-content-between mr-3 ml-3 mt-5">
                                    <div>
                                        <h5 className="">Process Details</h5>
                                        <p className="mb-5">Give your process a name and other details.</p>
                                    </div>
                                    <div>
                                        <Button icon="pi pi-arrow-right" severity="secondary" rounded outlined aria-label="Filter" className="mr-2" disabled={!workflowName || !createdBy} onClick={goToNextStep} />
                                    </div>
                                </div>
                                <Divider />
                                <div className="formgrid grid mt-5">
                                    <div className="field col m-3">
                                        <FloatLabel>
                                            <label htmlFor="workflowName">Workflow name</label>
                                            <InputText id="workflowName" type="text" value={workflowName} onChange={(e) => setWorkflowName(e.target.value)} />
                                        </FloatLabel>
                                    </div>
                                    <div className="field col m-3">
                                        <FloatLabel>
                                            <label htmlFor="createdBy">Created by</label>
                                            <InputText id="createdBy" type="text" value={createdBy} onChange={(e) => setCreatedBy(e.target.value)} />
                                        </FloatLabel>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Process configuration */}
                {activeIndex === 1 && (
                    <div title="Add Workflow Details" className="card">
                        <div className="grid">
                            <div className="p-fluid w-full">
                                <div className="flex justify-content-between mr-3 ml-3 mt-5">
                                    <div>
                                        <h5 className="">Configure Process</h5>
                                        <p className="mb-5">Select the list of process that needed for the creation of new process.</p>
                                    </div>
                                    <div>
                                        <Button icon="pi pi-arrow-left" severity="secondary" rounded outlined aria-label="Filter" className="mr-2" onClick={() => setActiveIndex((prevIndex) => prevIndex - 1)} />
                                        <Button icon="pi pi-arrow-right" severity="secondary" rounded outlined aria-label="Filter" onClick={() => setActiveIndex((prevIndex) => prevIndex + 1)} />
                                    </div>
                                </div>
                                <Divider />
                                {loading ? (
                                    <ProgressBar mode="indeterminate" className="mt-5" style={{ height: '6px' }}></ProgressBar>
                                ) : (
                                    <div className="formgrid grid flex justify-content-between ">
                                        <div className="w-5 mr-3 ml-3 mt-5 ">
                                            <h5 className="m-2 mb-5">Choose any process below for your process list</h5>
                                            <Accordion>
                                                <AccordionTab
                                                    header={
                                                        <span className="flex align-items-center gap-2 w-full">
                                                            <span className="font-bold white-space-nowrap">Video Processing</span>
                                                            <Badge value={videoList?.length} className="ml-auto" />
                                                        </span>
                                                    }
                                                >
                                                    {videoProcesses.map((item, index) => (
                                                        <Button
                                                            key={item.id}
                                                            label={item.name}
                                                            severity={selectedProcesses.some((p) => p.id === item.id) ? 'success' : 'secondary'}
                                                            onClick={() => {
                                                                setSelectedProcesses((prev) => {
                                                                    const exists = prev.some((p) => p.id === item.id);
                                                                    if (exists) {
                                                                        return prev.filter((p) => p.id !== item.id);
                                                                    } else {
                                                                        return [...prev, { id: item.id, name: item.name, optional_flag: item.optional_flag }];
                                                                    }
                                                                });
                                                            }}
                                                            outlined
                                                            className="w-auto mb-3 ml-2 mr-2"
                                                            disabled={shouldDisableProcess(item)}
                                                        />
                                                    ))}
                                                </AccordionTab>
                                            </Accordion>
                                            <Accordion>
                                                <AccordionTab
                                                    header={
                                                        <span className="flex align-items-center gap-2 w-full">
                                                            <span className="font-bold white-space-nowrap">Audio / Video Processing</span>
                                                            <Badge value={BothProcesses.length} className="ml-auto" />
                                                        </span>
                                                    }
                                                >
                                                    {BothProcesses.map((item, index) => (
                                                        <Button
                                                            key={item.id}
                                                            label={item.name}
                                                            severity={selectedProcesses.some((p) => p.id === item.id) ? 'success' : 'secondary'}
                                                            outlined
                                                            onClick={() => {
                                                                setSelectedProcesses((prev) => {
                                                                    const exists = prev.some((p) => p.id === item.id);
                                                                    if (exists) {
                                                                        return prev.filter((p) => p.id !== item.id);
                                                                    } else {
                                                                        return [...prev, { id: item.id, name: item.name, optional_flag: item.optional_flag }];
                                                                    }
                                                                });
                                                            }}
                                                            className="w-auto mb-3 ml-2 mr-2"
                                                            disabled={shouldDisableProcess(item)}
                                                        />
                                                    ))}
                                                </AccordionTab>
                                            </Accordion>
                                        </div>
                                        <div className="w-5 mr-3 ml-3 mt-5">
                                            <h5 className="m-2 mb-5">Selected process</h5>

                                            <Accordion activeIndex={0}>
                                                <AccordionTab
                                                    header={
                                                        <span className="flex align-items-center gap-2 w-full">
                                                            <span className="font-bold white-space-nowrap">View</span>
                                                            <Badge value={selectedVideoP.length + selectedAudioP.length} className="ml-auto" />
                                                        </span>
                                                    }
                                                >
                                                    {selectedProcesses.length === 0 ? (
                                                        <p>Please select a process to list here! </p>
                                                    ) : (
                                                        <div className=" flex flex-auto flex-wrap">
                                                            {' '}
                                                            {selectedProcesses.map((item, index, array) => (
                                                                <React.Fragment key={item.id}>
                                                                    <div className="flex flex-wrap mb-3">
                                                                        <Button
                                                                            label={item.name}
                                                                            severity="secondary"
                                                                            outlined
                                                                            className="w-auto hover:p-button-danger"
                                                                            // icon={hoveredItem === item ? 'pi pi-times-circle' : undefined}
                                                                            iconPos="right"
                                                                            onMouseEnter={(e) => {
                                                                                e.currentTarget.classList.add('p-button-danger');
                                                                                setHoveredItem(item);
                                                                            }}
                                                                            onMouseLeave={(e) => {
                                                                                e.currentTarget.classList.remove('p-button-danger');
                                                                                setHoveredItem(null);
                                                                            }}
                                                                            onClick={() => {
                                                                                setSelectedProcesses((prev) => prev.filter((p) => p.id !== item.id));
                                                                            }}
                                                                        />
                                                                        {index < array.length - 1 && <i className="flex pi pi-arrow-right ml-3 mr-3" style={{ fontSize: '1rem', alignItems: 'center' }}></i>}
                                                                    </div>
                                                                </React.Fragment>
                                                            ))}
                                                        </div>
                                                    )}
                                                </AccordionTab>
                                            </Accordion>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Confirm flow */}
                {activeIndex === 2 && (
                    <div title="Add Workflow Details" className="card">
                        <div className="grid">
                            <div className="p-fluid w-full">
                                <div className="flex justify-content-between mr-3 ml-3 mt-5">
                                    <div>
                                        <h5 className="">Confirm Process</h5>
                                        <p className="mb-5">Confirm your process details and click create button to create a new process.</p>
                                    </div>
                                    <div>
                                        <Button icon="pi pi-arrow-left" severity="secondary" rounded outlined aria-label="Filter" className="ml-2" onClick={() => setActiveIndex((prevIndex) => prevIndex - 1)} />
                                    </div>
                                </div>
                                <Divider />
                                <div className="formgrid grid mt-5">
                                    <div className="field col m-3">
                                        <FloatLabel>
                                            <label htmlFor="name2">Workflow name</label>
                                            <InputText id="name2" type="text" disabled value={workflowName} />
                                        </FloatLabel>
                                    </div>
                                    <div className="field col m-3">
                                        <FloatLabel>
                                            <label htmlFor="name2">Created by</label>
                                            <InputText id="name2" type="text" disabled value={createdBy} />
                                        </FloatLabel>
                                    </div>
                                </div>
                                <Divider />
                                <div className="w-5 mr-2 ml-2 mt-5 w-12">
                                    <div className="flex justify-content-between mr-3 ml-3 mt-5 align-items-baseline">
                                        <div>
                                            {/* <h5 className="">Your porcess config</h5> */}
                                            <p className="mb-5">New process config list will be created in this order.</p>
                                        </div>
                                    </div>
                                    <div className=" flex flex-auto flex-wrap ml-3 mr-3">
                                        {' '}
                                        {selectedProcesses.map((item, index, array) => (
                                            <React.Fragment key={index}>
                                                <div className="flex flex-wrap mb-3">
                                                    <Button
                                                        label={item.name}
                                                        severity="secondary"
                                                        outlined
                                                        className="w-auto "
                                                        iconPos="right"
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.classList.add('p-button-success');
                                                            setHoveredItem(item);
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.classList.remove('p-button-success');
                                                            setHoveredItem(null);
                                                        }}
                                                    />
                                                    {index < array.length - 1 && <i className="flex pi pi-arrow-right ml-3 mr-3" style={{ fontSize: '1rem', alignItems: 'center' }}></i>}
                                                </div>
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                                <Divider />
                                <div className="flex w-12 mt-5 flex-row-reverse">
                                    <Button label="Create" className="flex w-2 mr-2 ml-2" onClick={finalStep} disabled={!workflowName || !createdBy || selectedProcesses.length === 0} />
                                    {/* <p>Dispaly err if fileds are missing </p> */}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* </ScrollPanel> */}
            </Dialog>
        </div>
    );
};
