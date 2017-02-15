import React from 'react';

import {Navigation, Header} from './Navigation';
import {Notification} from '../../common/components/Notification';
import {constants} from '../../common/constants';


export class Dashboard extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            error: ''
        };
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
        const notification = <Notification type={constants.notifications.DANGER}
                                           removeNotification={this.removeNotification}
                                           message={this.state.error}/>;
        return (

            <div className="wrapper skin-yellow">
                <Header title="Challnge me!" />
                <Navigation/>
                {this.error ? notification : ''}
                <div className="content-wrapper">
                    {React.cloneElement(this.props.children, {onError: this.onError})}
                </div>
            </div>
        );
    }

}