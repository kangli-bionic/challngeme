import React from 'react';
import {constants} from '../../common/constants';
import cookie from 'react-cookie';
import {Challenge} from './Challenge';

export class SingleChallengeContainer extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            userId: cookie.load(constants.cookies.USER_ID),
            challenge: {
                category: {
                    name:'',
                    description: ''
                }
            }
        }
    }

    componentDidMount(){
        $.get('/dash/getUserChallengeByChallengeId', {
            userId: this.state.userId,
            challengeId:this.props.params.challengeId
        })
        .done((data) => {
            this.setState({
                challenge: data
            })
        })
        .fail((err) => {
            console.log(err);
        });
    }

    render(){
        return(
            <Challenge challenge={this.state.challenge}/>
        );
    }
}

export class CurrentChallenge extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            userId: cookie.load(constants.cookies.USER_ID),
            challenge: {
                category: {
                    name:'',
                    description: ''
                }
            }
        }

        this.onChallengeComplete = this.onChallengeComplete.bind(this);
    }

    componentDidMount(){
        //TODO: get all current challenges
        $.get('/dash/getNextChallenge', {
            userId: this.state.userId
        })
            .done((data) => {
                this.setState({
                    challenge: data
                })
            })
            .fail((err) => {
                this.props.onError(constants.error.GENERIC);
            });
    }

    onChallengeComplete(data){
        console.log(data);
        this.setState({
            challenge: data
        })
    }

    render(){

        //TODO: more than one current challenge
        return(
            <div>
                <div className="col-md-12">
                    <Challenge onChallengeComplete={this.onChallengeComplete} challenge={this.state.challenge}/>
                </div>
            </div>
        );
    }

}