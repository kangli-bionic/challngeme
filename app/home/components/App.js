import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, browserHistory} from 'react-router'
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
import {Profile} from '../../dash/components/Profile';
import {PublicChallengeContainer} from '../../dash/components/PublicChallengeContainer';

class App extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            error: ''
        }
        this.title = "Challnge me";
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
        browserHistory.push('/');
    }

}

const isLoggedIn = (nextState, replace) => {
    if(cookie.load(constants.cookies.USER_ID)){
        browserHistory.push('/current');
    }
}

//TODO: section to see completed challenges by friends
ReactDOM.render(
    <Router history={browserHistory} >
        <Route path="/" component={App} onEnter={isLoggedIn} />
        <Route component={Dashboard} onEnter={auth}>
            <Route path="current" component={CurrentChallenge} />
            <Route path="categories" component={CategoryForm}/>
            <Route path="profiles" component={Profile}/>
            <Route path="challenges" component={ChallengesContainer}/>
            <Route path="challenges/:challengeId" component={SingleChallengeContainer} />
        </Route>
        <Route path="profiles/:userId/challenges/:challengeId" component={PublicChallengeContainer} />
        <Route path="*" component={NotFound}/>
    </Router>,
    document.getElementById('root')
);