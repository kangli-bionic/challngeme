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
    }

    componentDidMount(){
        $.get('/dash/getNextChallenge', {
            userId: this.state.userId
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