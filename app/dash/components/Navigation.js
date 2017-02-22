import React from 'react';
import { Link, browserHistory } from 'react-router';
import cookie from 'react-cookie';
import {constants} from '../../common/constants';
import {Glyphicon} from '../../common/components/Glyphicon';

export function Header(props){
    const onLogOut = () => {
        cookie.remove(constants.cookies.NEW_USER, {path: '/'});
        cookie.remove(constants.cookies.USER, {path: '/'});
        cookie.remove(constants.cookies.USER_ID, {path: '/'});
        cookie.remove(constants.cookies.PHOTO, {path: '/'});
        browserHistory.push('/');
    }

    let photo = cookie.load(constants.cookies.PHOTO);
    return(
        <header className="main-header">
            <Link to="/current" className="logo">
                <span className="logo-mini"><b>C</b>ME</span>
                <span className="logo-lg">{props.title}</span>
            </Link>
            <nav className="navbar navbar-static-top">
                <a href="#" className="sidebar-toggle glyphicon glyphicon-menu-hamburger" data-toggle="offcanvas" role="button">
                    <span className="sr-only">Toggle navigation</span>
                </a>
                <div className="navbar-custom-menu">
                    <ul className="nav navbar-nav">
                        <li className="dropdown user">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-expanded="true">
                                {photo &&  photo != 'null' ?
                                    <img src={photo} className="user-image img-circle" />
                                    :
                                    <Glyphicon icon="user" centerBlock=""/>
                                }

                                <span className="hidden-xs">{cookie.load(constants.cookies.USER)}</span>
                            </a>
                            <ul className="dropdown-menu">
                                <li className="user-footer">
                                    <button className="btn btn-link" onClick={onLogOut}>Sign out</button>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}

//TODO: create profile component
export function Navigation(){

    let photo = cookie.load(constants.cookies.PHOTO);

    return (
        <aside className="main-sidebar">
            <section className="sidebar">
                <div className="user-panel">
                    <div className="pull-left image">
                    {photo && photo != 'null' ?
                        <img src={photo} className="img-circle" />
                        :
                        <Glyphicon icon="user" centerBlock=""/>
                    }
                    </div>
                    <div className="pull-left info">
                        <p>{cookie.load(constants.cookies.USER)}</p>
                    </div>
                </div>
                <ul className="sidebar-menu">
                    <li className="header">
                        <Link to="/current">Current Challenge</Link>
                    </li>
                    <li className="header">
                        <Link to="/challenges">Challenges</Link>
                    </li>
                    <li className="header">
                        <Link to="/categories">Categories</Link>
                    </li>
                    <li className="header">
                        <Link to="/profiles">Profile</Link>
                    </li>
                </ul>
            </section>
        </aside>  
    );
}