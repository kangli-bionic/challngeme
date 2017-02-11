import React from 'react';
import ReactDOM from 'react-dom';
import { IndexRoute, Router, Route, hashHistory} from 'react-router'
import cookie from 'react-cookie';

import {constants} from '../../common/constants';
import {Navigation, Header} from './Navigation';
import {UserForm} from './UserForm';
import {Notification} from '../../common/components/Notification';
import {NotFound} from '../../common/components/NotFound';
import {Dashboard} from '../../dash/components/Dashboard';
import {ChallengesContainer} from '../../dash/components/ChallengesContainer';
import {SingleChallengeContainer, CurrentChallenge} from '../../dash/components/SingleChallengeContainer';
import {CategoryForm} from '../../dash/components/Category';

class App extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            error: ''
        }
        this.title = "Challnge me!";
        this.subtitle = "You better be up for the challenge!";
        this.onError = this.onError.bind(this);
        this.removeNotification = this.removeNotification.bind(this);
    }

    onError(message){
        this.error = true;
        this.setState({
            error: message
        });
    }

    removeNotification(){
        this.error = false;
        this.setState({
            error: ''
        });
    }

    render(){
        let notification = <Notification type={constants.notifications.DANGER} removeNotification={this.removeNotification}
                                         message={this.state.error}/>;
        return (
            <div className="home">
                {this.error ? notification : ''}
                <Navigation title={this.title} />
                <Header title={this.title} subtitle={this.subtitle}>
                    <UserForm onError={this.onError} router={this.props.router}/>
                </Header>
            </div>
        );
    }

}

const auth = (nextState, replace) => {
    if(!cookie.load(constants.cookies.USER_ID)){
        replace('/');
    }
}

const isLoggedIn = (nextState, replace) => {
    if(cookie.load(constants.cookies.USER_ID)){
        replace('/dash/');
    }
}

//TODO: work with browserHistory
ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={App} onEnter={isLoggedIn} />
        <Route path="dash" component={Dashboard} onEnter={auth}>
            <IndexRoute component={CurrentChallenge}/>
            <Route path="category" component={CategoryForm}/>
            <Route path="challenge" component={ChallengesContainer}/>
            <Route path="challenge/:challengeId" component={SingleChallengeContainer} />
            <Route path="*" component={NotFound}/>
        </Route>
        <Route path="*" component={NotFound}/>
    </Router>,
    document.getElementById('root')
);