'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

import { useSetRecoilState, useRecoilValue } from 'recoil';
import { mediaFileState, dialogResState } from '../../../recoil/atoms/atoms';

const AssignWorkflow = () => {
    const mediaDetails = useRecoilValue(mediaFileState);
    const mediaFiles = mediaDetails.data?.[0]?.url;
    const [loading, setLoading] = useState(false);
    const [workflowList, setWorkflowList] = useState([]);
    const [selectedWorkflow, setSelectedWorkflow] = useState(null);
    const digsetVisible = useSetRecoilState(dialogResState);

    const toast = useRef<Toast>(null);

    console.log('workflowList', workflowList);
    console.log('selectedWorkflow', selectedWorkflow);
    console.log('mediaDetails', mediaDetails.data[0].id);

    useEffect(() => {
        fetchWorkflowData();
    }, []);

    const assignWorkflowAPI = async () => {
        setLoading(true);
        try {
            const requestData = {
                media_id: mediaDetails.data[0].id,
                workflow_id: selectedWorkflow?.WORKFLOW_ID
            };
            const response = await axios.post('http://10.93.10.186/Video-Automation/api/assignWorkflow', requestData);
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Workflow Assigned ',
                life: 3000
            });
            setTimeout(() => {
                digsetVisible(false);
            }, 2000);
            setLoading(false);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Something went wrong',
                detail: error instanceof Error ? error.message : 'An unknown error occurred',
                life: 3000
            });
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const fetchWorkflowData = async () => {
        try {
            const response = await axios.get('https://10.93.10.186/Video-Automation/api/getWorkflowData');
            setWorkflowList(response.data.data);
        } catch (error) {
            console.error('Error fetching workflow data:', error);
        }
    };

    const selectedCountryTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.WORKFLOW_NAME}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const countryOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.WORKFLOW_NAME}</div>
            </div>
        );
    };

    return (
        <div className="flex justify-content-center">
            <Toast ref={toast}></Toast>
            <div className="col-12">
                <div className="">
                    <div className="grid">
                        <div className="col ">
                            <div>
                                <h5>Preview</h5>
                            </div>
                            <div>
                                <video
                                    // ref={(el) => (videoRefs.current[0] = el!)}
                                    key={mediaFiles}
                                    height={'auro'}
                                    width={'100%'}
                                    onMouseEnter={(e) => e.currentTarget.setAttribute('controls', 'controls')}
                                    onMouseLeave={(e) => e.currentTarget.removeAttribute('controls')}
                                >
                                    <source src={mediaFiles} type={'video/mp4'} />
                                </video>
                            </div>
                        </div>
                        <Divider layout="vertical" />
                        <div className="col-4 ">
                            <h5>Choose Workflow</h5>
                            <div className="flex flex-column flex-nowrap gap-8">
                                <div className="flex justify-content-start">
                                    <Dropdown
                                        value={selectedWorkflow}
                                        onChange={(e) => setSelectedWorkflow(e.value)}
                                        options={workflowList}
                                        optionLabel="name"
                                        placeholder="Select Below"
                                        filter
                                        valueTemplate={selectedCountryTemplate}
                                        itemTemplate={countryOptionTemplate}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <div className="flex flex-wrap justify-content-end gap-3">
                                        <Button label="Assign Workflow" icon="pi pi-plus" loading={loading} onClick={assignWorkflowAPI} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignWorkflow;
