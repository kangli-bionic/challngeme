import React from 'react';

export class Notification extends React.Component{

    constructor(props){
        super(props);
    }

    componentDidMount(){
        this.timerID = setTimeout(
            () => this.remove(),
            5000
        );
    }

    componentWillUnmount(){
        clearTimeout(this.timerID);
    }

    remove(){
       let $notification = $(this.refs.notification);
        $notification.animateCss('bounceOutUp', () => this.remove());
    }

    render(){
        return(
            <div ref="notification" className={'callout notification callout'+this.props.type} >
                <h4>{this.props.title}</h4>
                <p>{this.props.message}</p>
            </div>
        )
    }
}