import React from 'react';
import ReactDOM from 'react-dom';

import {CategoryForm} from './Category';
import {Navigation, Header} from './Navigation';

function Dashboard(props){
    return (
        <div className="wrapper">
            <Header/>
            <Navigation/>
            <CategoryForm/>
        </div>
    );
}

ReactDOM.render(
    <Dashboard title="Challnge me!" subtitle="You better be up for the challenge!"/>,
    document.getElementById('root')
);