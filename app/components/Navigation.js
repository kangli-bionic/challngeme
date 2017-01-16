import React from 'react';

import {UserForm} from './UserForm.js';

export function Navigation(props){
    return (
        <nav id="mainNav" className="navbar navbar-default navbar-custom navbar-fixed-top">
            <div className="container">
                <div className="navbar-header page-scroll">
                    <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                        <span className="sr-only">Toggle navigation</span> Menu <i className="fa fa-bars"></i>
                    </button>
                    <a className="navbar-brand page-scroll" href="#page-top">{props.title}</a>
                </div>
                <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul className="nav navbar-nav navbar-right">
                        <li className="hidden">
                            <a href="#page-top"></a>
                        </li>
                        <li>
                            <a className="page-scroll" href="#home">Home</a>
                        </li>
                        <li>
                            <a className="page-scroll" href="#how-to-play">How to play</a>
                        </li>
                        <li>
                            <a className="page-scroll" href="#contact">Contact Us</a>
                        </li>
                    </ul>
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