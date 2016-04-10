import React, { PropTypes } from 'react'
import './style.scss';

function CoreLayout ({ children }) {
    return (
        <div className='page-container'>
            <div className='view-container'>
                {children}
            </div>
        </div>
    );
}

CoreLayout.propTypes = {
    children: PropTypes.element
};

export default CoreLayout;
