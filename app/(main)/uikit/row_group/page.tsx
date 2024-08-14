'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

//Recoil State Management
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { ApiProcessFile, apiProcessList, refreshWorkflowListState } from '../../../recoil/atoms/atoms';

// Prime React Components
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Skeleton } from 'primereact/skeleton';
import { Toast } from 'primereact/toast';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';

import URLLinks from '@/app/api/links';


export default function ExpandableRowGroupDemo() {
    const {SER_BASE_CONNECTION} = URLLinks

    const setApiFiles = useSetRecoilState(apiProcessList);
    const apiFiles = useRecoilValue(apiProcessList);
    const { data: customers } = useRecoilValue(apiProcessList);
    const setRefreshWorkflowList = useSetRecoilState(refreshWorkflowListState);
    const refreshWorkflowList = useRecoilValue(refreshWorkflowListState);

    const [expandedRows, setExpandedRows] = useState([]);
    const [loading, setLoading] = useState(true);

    const toast = useRef<Toast>(null);
    const items = Array.from({ length: 5 }, (v, i) => ({ id: i }));

    useEffect(() => {
        getPorcessList();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (refreshWorkflowList) {
            getPorcessList();
            setRefreshWorkflowList(false);
        }
    }, [refreshWorkflowList]);

  

    const getPorcessList = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${SER_BASE_CONNECTION}/getWorkflowList`);
            setApiFiles(response.data);
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
    

    const deleteWorkflow = async (id: number, event: React.MouseEvent<HTMLElement>) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Do you want to delete this process?',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    const response = await axios.post(`${SER_BASE_CONNECTION}/deleteWorkflow`, { id });
                    console.log('Workflow deleted:', response.data);
                    getPorcessList();
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Info',
                        detail: 'Process Deleted ',
                        life: 3000
                    });
                } catch (error) {
                    console.error('Error deleting workflow:', error);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Something went wrong',
                        detail: error instanceof Error ? error.message : 'An unknown error occurred',
                        life: 3000
                    });
                }
            },
            reject: () => {
                // Optional: Handle rejection
            }
        });
    };
    
    const headerTemplate = (data: ApiProcessFile) => {
        return (
            <React.Fragment>
                <span className="vertical-align-middle ml-2 font-bold line-height-3">{data.workflow_name}</span>
            </React.Fragment>
        );
    };

    const footerTemplate = (data: ApiProcessFile) => {
        return (
            <React.Fragment>
                <td colSpan={5}>
                    <div className="flex justify-between items-center w-full">
                        <div className="flex flex-wrap items-center gap-2 w-12">
                            <span className="font-bold">Task List:</span>{' '}
                            {data.tasklist.map((task, index) => (
                                <React.Fragment key={index}>
                                    <Tag className="font-bold">{task.process}</Tag>
                                    {index < data.tasklist.length - 1 && <i className="pi pi-arrow-right flex align-items-center" />}
                                </React.Fragment>
                            ))}
                        </div>
                        <div className="flex justify-content-end font-bold w-2">Times used: 4 </div>
                    </div>
                </td>
            </React.Fragment>
        );
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <ConfirmPopup />
            {loading ? (
                <DataTable value={items} className="p-datatable">
                    <Column field="workflow_name" header="Process List" style={{ width: '20%' }} body={<Skeleton />}></Column>
                    <Column body={<Skeleton />} field="created_by" header="Created by" style={{ width: '20%' }} headerClassName={`smooth-header ${expandedRows.length > 0 ? 'visible' : ''}`}></Column>
                    <Column body={<Skeleton />} field="created_date" header="Created Date" style={{ width: '20%' }} headerClassName={`smooth-header ${expandedRows.length > 0 ? 'visible' : ''}`}></Column>
                </DataTable>
            ) : (
                <DataTable
                    value={customers}
                    rowGroupMode="subheader"
                    groupRowsBy="workflow_name"
                    sortMode="single"
                    sortField="workflow_name"
                    sortOrder={1}
                    expandableRowGroups
                    expandedRows={expandedRows}
                    onRowToggle={(e) => setExpandedRows(e.data as React.SetStateAction<never[]>)}
                    rowGroupHeaderTemplate={headerTemplate}
                    rowGroupFooterTemplate={footerTemplate}
                    tableStyle={{ minWidth: '50rem' }}
                    className="p-datatable-striped"
                >
                    <Column field="workflow_name" header="Process List" style={{ width: '20%',  }}></Column>
                    <Column field="created_by" header="Created by" style={{ width: '20%',  }} headerClassName={`smooth-header ${expandedRows.length > 0 ? 'visible' : ''}`}></Column>
                    <Column field="created_date" header="Created Date" style={{ width: '20%',  }} headerClassName={`smooth-header ${expandedRows.length > 0 ? 'visible' : ''}`}></Column>
                    <Column
                        field="remove"
                        body={(rowData) => (
                            <i
                                className="pi pi-trash"
                                style={{ fontSize: '1rem', cursor: 'pointer' }}
                                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'red')}
                                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '')}
                                onClick={(e) => deleteWorkflow(rowData.id, e)}
                            ></i>
                        )}
                        header=""
                        style={{ width: '5%', }}
                        headerClassName={`smooth-header ${expandedRows.length > 0 ? 'visible' : ''}`}
                    />
                </DataTable>
            )}
        </div>
    );
}
