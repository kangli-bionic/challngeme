import React from 'react';

import {Navigation, Header} from './Navigation';
import {Notification} from '../../common/components/Notification';
import {constants} from '../../common/constants';

export class Dashboard extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            message: '',
            notificationType: constants.notifications.DANGER
        };
        this.showNotification = this.showNotification.bind(this);
        this.removeNotification = this.removeNotification.bind(this);
    }

    showNotification(message, notificationType){
        this.notification = true;
        this.setState({
            message: message,
            notificationType: notificationType
        });
    }

    removeNotification(){
        this.notification = false;
        this.setState({
            message: ''
        });
    }

    render(){
        const notification = <Notification type={this.state.notificationType}
                                           removeNotification={this.removeNotification}
                                           message={this.state.message}/>;
        return (

            <div className="wrapper skin-yellow">
                <Header title="Challnge me!" />
                <Navigation/>
                {this.notification ? notification : ''}
                <div className="content-wrapper">
                    {React.cloneElement(this.props.children, {showNotification: this.showNotification})}
                </div>
            </div>
        );
    }

}