import React from 'react';
import {constants} from '../../common/constants';
import cookie from 'react-cookie';

export class Challenge extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            userId: cookie.load(constants.cookies.USER_ID),
            challenge: {},
            file: ''
        }

        this.onInputChange = this.onInputChange.bind(this);
        this.onChallengeCompleted = this.onChallengeCompleted.bind(this);
    }

    componentDidMount(){
        $.get('/dash/getNextChallenge', {userId: this.state.userId})
            .done((data) => {
                this.setState({
                    challenge: data
                });
            })
            .fail((err) => {
               console.log(err);
            })
    }

    onInputChange(event){
        this.setState({
           file: event.target.value
        });
    }

    onChallengeCompleted(){

    }

    render(){
        return (
            <div className="col-md-12">
                <div className="box box-widget widget-user-2 ">
                    <div className={'widget-user-header ' + constants.backgrounds[Math.floor(Math.random() * (constants.backgrounds.length - 1))]}>
                        <div className="widget-user-image">
                            <img className="img-circle" src="./img/challenge-accepted.jpg" alt="Challenge Accepted"/>
                        </div>
                        <h3 className="widget-user-username">{'Category Name'}</h3>
                    </div>
                    <div className="box-footer">
                        <div className="row">
                            <div className="col-md-12 border-right">
                                <div className="description-block">
                                    <h4 className="description-header">{this.state.challenge.description}</h4>
                                    <h4 className="description-text">Points: {this.state.challenge.points}</h4>
                                    <input type="file" className="center-block" value={this.state.file} onChange={this.onInputChange}/>
                                    <button type="button" className="btn btn-lg btn-success" onClick={this.onChallengeCompleted}>Challnge Completed</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}