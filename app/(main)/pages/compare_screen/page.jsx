import React from 'react';
import ScreenComparision, {Comparedetails} from '../../uikit/screen_comparision/page';

function page() {
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card flex justify-content-between">
                    <div className=''>
                        <h5>Comapre Screen</h5>
                        <p>Compare with the files that has been generated.</p>
                    </div>
                    <div >
                     <Comparedetails/>
                    </div>
                </div>
            </div>
            <ScreenComparision />
        </div>
    );
}

export default page;
