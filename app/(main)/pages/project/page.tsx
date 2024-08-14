import React from 'react';
import ListDemo from '../../uikit/project_list/page';

const ProjectPage = () => {
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Projects</h5>
                    <p>List of all project details will be listed here</p>
                </div>
                <ListDemo />
            </div>
        </div>
    );
};

export default ProjectPage;
