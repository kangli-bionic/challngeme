import React from 'react';

export class Notification extends React.Component{

    constructor(props){
        super(props);
        this.remove = this.remove.bind(this);
    }

    componentDidMount(){
        this.timerID = setTimeout(
            () => this.remove(),
            2000
        );
    }

    componentWillUnmount(){
        clearTimeout(this.timerID);
    }

    remove(){
       let $notification = $(this.refs.notification);
        $notification.animateCss('bounceOutUp', () => {this.props.removeNotification()});
    }

    render(){
        return(
            <div onClick={this.remove} ref="notification" className={'callout notification callout-'+this.props.type} >
                <p>{this.props.message}</p>
            </div>
        )
    }
}