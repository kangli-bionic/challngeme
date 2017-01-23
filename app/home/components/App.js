import React from 'react';
import ReactDOM from 'react-dom';

import {constants} from '../../common/constants';
import {Navigation, Header} from './Navigation';
import {UserForm} from './UserForm';
import {Notification} from '../../common/components/Notification';

class App extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            error: ''
        }
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
            <div>
                {this.error ? notification : ''}
                <Navigation title={this.props.title} />
                <Header title={this.props.title} subtitle={this.props.subtitle}>
                    <UserForm onError={this.onError} />
                </Header>
            </div>
        );
    }

}



ReactDOM.render(
    <App title="Challnge me!" subtitle="You better be up for the challenge!"/>,
    document.getElementById('root')
);