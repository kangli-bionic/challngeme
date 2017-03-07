import React from 'react';

export function Navigation(props){
    return (
        <nav id="mainNav" className="navbar navbar-default navbar-custom navbar-fixed-top">
            <div className="container">
                <div className="navbar-header">
                    <button className="navbar-brand btn btn-link">{props.title}</button>
                </div>
            </div>
        </nav>
    );
}

export function Header(props){
    return (
        <header id="home">
            <div className="container">
                <div className="intro-text">
                    <div className="col-md-7">
                        <div className="intro-heading">{props.title}</div>
                        <div className="intro-lead-in">"{props.subtitle}"</div>
                    </div>
                    <div className="col-md-5">
                        {props.children}
                    </div>
                    <div style={{clear: 'both'}}></div>
                </div>
            </div>
        </header>
    );
}