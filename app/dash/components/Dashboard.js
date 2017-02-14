import React from 'react';

import {Navigation, Header} from './Navigation';

export function Dashboard(props){
    return (
        <div className="wrapper skin-yellow">
            <Header title="Challnge me!" />
            <Navigation/>
            <div className="content-wrapper">
                {props.children}
            </div>
        </div>
    );
}