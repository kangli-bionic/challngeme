import React from 'react';
import cookie from 'react-cookie';
import {constants} from '../../common/constants';

export function Header(props){
    return(
        <header className="main-header">
            <a href="index2.html" className="logo">
                <span className="logo-mini"><b>C</b>ME</span>
                <span className="logo-lg">{props.title}</span>
            </a>
            <nav className="navbar navbar-static-top">
                <a href="#" className="sidebar-toggle" data-toggle="offcanvas" role="button">
                    <span className="sr-only">Toggle navigation</span>
                </a>
                <div className="navbar-custom-menu">
                    <ul className="nav navbar-nav">

                        <li className="dropdown user user-menu">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                <img src="img/user2-160x160.jpg" className="user-image" alt="User Image"/>
                                    <span className="hidden-xs">Alexander Pierce</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}

export function Navigation(props){
    return (
        <aside className="main-sidebar">
            <section className="sidebar">
                <div className="user-panel">
                    <div className="pull-left image">
                        <img src="img/user2-160x160.jpg" className="img-circle" alt="User Image"/>
                    </div>
                    <div className="pull-left info">
                        <p>{cookie.load(constants.cookies.USER_ID)}</p>
                    </div>
                </div>
                <ul className="sidebar-menu">
                    <li className="header"></li>
                </ul>
            </section>
        </aside>  
    );
}