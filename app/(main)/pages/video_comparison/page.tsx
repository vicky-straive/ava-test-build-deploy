import React from 'react';
import Splitter from '../../uikit/splitter/page';
import { ViewMetadata } from '../../uikit/metadata/page';

const page = () => {
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card flex justify-content-between">
                    <div>
                        <h5>Video Comparison</h5>
                        <p>Compare and contrast with the original media and processed media.</p>
                    </div>
                    <div className="align-self-center">
                        <ViewMetadata />
                    </div>
                </div>
            </div>
            <Splitter />
        </div>
    );
};

export default page;
