import React from 'react';

export const Glyphicon = (props) => {
    return(
        <span className={`center-block glyphicon glyphicon-${props.icon}`} aria-hidden="true"></span>
    );
}

