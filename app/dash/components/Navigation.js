import React from 'react';
import { Link, browserHistory } from 'react-router';
import cookie from 'react-cookie';
import {constants} from '../../common/constants';
import {Glyphicon} from '../../common/components/Glyphicon';
import {Score} from './Score';

export function Header(props){
    const onLogOut = (event) => {
        event.preventDefault();
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
                <div className="navbar-custom-menu">
                    <ul className="nav navbar-nav">
                        <li>
                            <Score/>
                        </li>
                        <li className="dropdown user">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-expanded="true">
                                {photo &&  photo != 'null' ?
                                    <div className="img-rounded img-responsive profile-photo-icon"
                                         style={{backgroundImage:`url('.${photo}')`}}>
                                    </div>
                                    :
                                    <Glyphicon icon="user" centerBlock=""/>
                                }

                                <span className="hidden-xs">{cookie.load(constants.cookies.USER)}</span>
                            </a>
                            <ul className="dropdown-menu" >
                                <li>
                                    <Link to="/categories">Categories</Link>
                                </li>
                                <li>
                                    <Link to="/profiles">Profile</Link>
                                </li>
                                <li role="separator" className="divider"></li>
                                <li>
                                    <a href="#" onClick={onLogOut}>                                    <Glyphicon icon="off"/>
                                         Sign out</a>
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
                    <div className="pull-left image" style={{width:'50px'}}>
                    {photo && photo != 'null' ?
                        <img src={photo} className="img-rounded img-responsive" />
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