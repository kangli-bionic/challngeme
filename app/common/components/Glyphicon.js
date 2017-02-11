import React from 'react';

export const Glyphicon = (props) => {
    return(
        <span className={`${props.centerBlock} glyphicon glyphicon-${props.icon}`}
              style={{textAlign: 'center'}}
              aria-hidden="true"></span>
    );
}

