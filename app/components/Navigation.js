import React from 'react';

import {UserForm} from './UserForm.js';

export function Navigation(props){
    return (
        <nav id="mainNav" className="navbar navbar-default navbar-custom navbar-fixed-top">
            <div className="container">
                <div className="navbar-header">
                    <button class="navbar-brand btn btn-link">{props.title}</button>
                </div>
            </div>
        </nav>
    );
}

export function Header(props){
    return (
        <header id="home">
            <div className="container">
                <div className="intro-text col-md-7">
                    <div className="intro-heading">{props.title}</div>
                    <div className="intro-lead-in">{props.subtitle}</div>
                </div>
                <div className="col-md-5 intro-text">
                    <UserForm/>
                </div>
            </div>
        </header>
    );
}