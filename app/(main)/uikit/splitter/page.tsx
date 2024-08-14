'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { Button } from 'primereact/button';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { metadataState, mediaFileState } from '../../../recoil/atoms/atoms';
import axios from 'axios';
import URLLinks from '@/app/api/links';


const Page: React.FC = () => {
    const {SER_BASE_CONNECTION} = URLLinks

    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const videoRefs = useRef<HTMLVideoElement[]>([]);
    const mediaDetails = useRecoilValue(mediaFileState);
    const [inputUrl, setInputUrl] = useState<{ input_url: string } | null>(null);
    const [outputUrl, setOutputUrl] = useState('');
    const setMetadata = useSetRecoilState(metadataState);
    const inputJson = {
        id: mediaDetails.data[0].id
    };
    const videoUrl1 = inputUrl?.input_url;
    console.log("mediaDetails in arry", mediaDetails.data[0].id);
    console.log("mediaDetails", mediaDetails);
    console.log("inputJson", inputJson);
    

    useEffect(() => {
        getMediaFileData();
    }, []);

    const getMediaFileData = async () => {
        try {
            const response = await axios.get(`${SER_BASE_CONNECTION}/compareInOutMedia`, { params: inputJson });
            console.log('Response', response);
            setInputUrl(response.data);
            setOutputUrl(response.data.output_url);
            setMetadata(response.data.media_properties);
        } catch (error) {
            console.error('Error fetching API data:', error);
        }
    };

    console.log('inputUrl', inputUrl?.input_url);
    console.log('outputUrl', outputUrl);

    const togglePlay = () => {
        videoRefs.current.forEach((ref) => {
            if (ref) {
                if (isPlaying) {
                    ref.pause();
                } else {
                    ref.play();
                }
            }
        });
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        videoRefs.current.forEach((ref) => {
            if (ref) {
                ref.muted = !isMuted;
            }
        });
        setIsMuted(!isMuted);
    };

    return (
        <>
            <div className="col-12">
                <div className="card" style={{ height: '72vh' }}>
                    <div className="flex justify-content-around">
                        <div>
                            <h5 className="ml-2">Original Media</h5>
                        </div>
                        <div>
                            <h5 className="mr-2">Processed Media</h5>
                        </div>
                    </div>
                    <Splitter style={{ height: '55vh', background: '#000000' }}>
                        <SplitterPanel className="flex align-items-center justify-content-center">
                            {videoUrl1 && (
                                <video
                                    ref={(el) => (videoRefs.current[0] = el!)}
                                    key={videoUrl1}
                                    height={'100%'}
                                    width={'100%'}
                                    onMouseEnter={(e) => e.currentTarget.setAttribute('controls', 'controls')}
                                    onMouseLeave={(e) => e.currentTarget.removeAttribute('controls')}
                                >
                                    <source src={videoUrl1} type={'video/mp4'} />
                                </video>
                            )}
                        </SplitterPanel>
                        <SplitterPanel className="flex align-items-center justify-content-center">
                            {outputUrl ? (
                                <video
                                    ref={(el) => (videoRefs.current[1] = el!)}
                                    height={'100%'}
                                    width={'100%'}
                                    onMouseEnter={(e) => e.currentTarget.setAttribute('controls', 'controls')}
                                    onMouseLeave={(e) => e.currentTarget.removeAttribute('controls')}
                                >
                                    <source src={outputUrl} type={'video/mp4'} />
                                </video>
                            ) : (
                                <div className="align-items-center ">
                                    <i
                                        className="pi pi-exclamation-triangle flex justify-content-center mb-5"
                                        style={{ fontSize: '4.5rem', color: 'var(--primary-color)' }}
                                    ></i>
                                    <p style={{ textAlign: 'center', color: 'white' }}>No processed media available</p>
                                </div>
                            )}
                        </SplitterPanel>
                    </Splitter>

                    <div className="col-12 flex justify-content-start flex-wrap mt-3 gap-2">
                        <Button icon={isPlaying ? 'pi pi-pause' : 'pi pi-play'} severity="secondary" onClick={togglePlay} outlined />
                        <Button icon={isMuted ? 'pi pi-volume-off' : 'pi pi-volume-up'} severity="secondary" onClick={toggleMute} outlined />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Page;
