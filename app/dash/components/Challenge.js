import React from 'react';
import {constants} from '../js/constants';

export class Challenge extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            challenge: {}
        }

    }

    componentDidMount(){
        $.get('/dash/getNextChallenge', {userId: this.props.userId})
            .done((data) => {
                this.setState({
                    challenge: data
                });
            })
            .fail((err) => {
               console.log(err);
            })
    }

    render(){
        return (
            <div className="col-md-12">
                <div className="box box-widget widget-user">
                    <div className={'widget-user-header ' + constants.backgrounds[Math.floor(Math.random() * (constants.backgrounds.length - 1))]}>
                        <h3 className="widget-user-username">{this.state.challenge.categoryName}</h3>
                    </div>
                    <div className="box-footer">
                        <div className="row">
                            <div className="col-md-12 border-right">
                                <div className="description-block">
                                    <h4 className="description-header">{this.state.challenge.description}</h4>
                                    <h4 className="description-text">Points: {this.state.challenge.points}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}