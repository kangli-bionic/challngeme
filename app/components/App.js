import React from 'react';
import ReactDOM from 'react-dom';

import {Navigation, Header} from './Navigation.js';

function App(props){
    return (
        <div>
            <Navigation title={props.title} />
            <Header title={props.title} subtitle={props.subtitle}/>
        </div>
    );
}

ReactDOM.render(
    <App title="Challnge me!" subtitle="You better be up for the challenge!"/>,
    document.getElementById('root')
);