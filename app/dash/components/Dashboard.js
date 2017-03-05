import React from 'react';

import { Header} from './Navigation';
import {Notification} from '../../common/components/Notification';
import {constants} from '../../common/constants';
import cookie from 'react-cookie';

export class Dashboard extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            message: '',
            notificationType: constants.notifications.DANGER,
            score: '0',
            userId: cookie.load(constants.cookies.USER_ID)
        };

        this.showNotification = this.showNotification.bind(this);
        this.removeNotification = this.removeNotification.bind(this);
        this.getScore = this.getScore.bind(this);
    }

    componentDidMount(){
        this.getScore();
    }

    getScore(){
        $.get('/dash/getUserScore', {userId: this.state.userId})
            .done((data) => {
                this.setState({
                    score: data.score
                });
            });
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

            <div>
                <div className="wrapper skin-yellow">
                    <Header title="Challnge me!" score={this.state.score}/>
                    {this.notification ? notification : ''}
                    <div className="container" style={{paddingTop:'15px'}}>
                        {React.cloneElement(this.props.children, {
                            showNotification: this.showNotification,
                            getScore: this.getScore
                        })}
                    </div>
                </div>
            </div>
        );
    }

}