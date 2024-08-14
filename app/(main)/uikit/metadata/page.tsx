'use client';

import React, { useState, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { useParams } from 'next/navigation';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { metadataState } from '../../../recoil/atoms/atoms';

export const ViewMetadata = () => {
    const [visible, setVisible] = useState(false);
    const MetadataDetails = useRecoilValue(metadataState);
    console.log('metadata', MetadataDetails);

    return (
        <div className="flex justify-content-center">
            <Button label="View Info" icon="pi pi-info-circle" onClick={() => setVisible(true)} />
            <Dialog className="ml-3" header="View Info" visible={visible} onHide={() => setVisible(false)} style={{ width: '45vw', height: 'auto' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                <div className="grid">
                    <div className="p-fluid w-full">
                        <div className=" card flex justify-content-between mr-3 ml-3 mt-3">
                            <div className="col-5">
                                <h5 className="mb-5">Video Details</h5>
                                <p>Frame Rate : {MetadataDetails.frame_rate}</p>
                                <p>Frame Rate: {MetadataDetails.frame_rate ? MetadataDetails.frame_rate : 'N/A'}</p>
                                <p>Video Duration : {MetadataDetails.video_duration ? MetadataDetails.video_duration : 'N/A'}</p>
                                <p>Video Codec : {MetadataDetails.video_codec ? MetadataDetails.video_codec : 'N/A'}</p>
                                <p>Frame Width : {MetadataDetails.frame_width ? MetadataDetails.frame_width : 'N/A'}</p>
                                <p>Frame Height : {MetadataDetails.frame_height ? MetadataDetails.frame_height : 'N/A'}</p>
                                <p>Display Aspect Ratio : {MetadataDetails.display_aspect_ratio ? MetadataDetails.display_aspect_ratio : 'N/A'}</p>
                                <p>Video Bitrate : {MetadataDetails.video_bit_rate ? MetadataDetails.video_bit_rate : 'N/A'}</p>
                            </div>
                            <Divider layout="vertical" />
                            <div className="col-5">
                                <h5 className="mb-5">Audio Details</h5>
                                <p>Audio Length : {MetadataDetails.audio_length ? `${MetadataDetails.audio_length}` : 'N/A'}</p>
                                <p>Audio Check : {MetadataDetails.audio_check ? MetadataDetails.audio_check : 'N/A'}</p>
                                <p>Audio Bitrate : {MetadataDetails.audio_bitrate ? MetadataDetails.audio_bitrate : 'N/A'}</p>
                                <p>Audio Codec : {MetadataDetails.audio_codec ? MetadataDetails.audio_codec : 'N/A'}</p>
                                <p>Channels : {MetadataDetails.channels ? MetadataDetails.channels : 'N/A'}</p>
                                <p>Sample Rate : {MetadataDetails.sample_rate ? MetadataDetails.sample_rate : 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};
