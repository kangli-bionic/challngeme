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
        .fail(() => {
            this.props.showNotification(constants.error.GENERIC, constants.notifications.DANGER);
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
            },
            showTwitterShare: false,
            shareUrl: ''
        }

        this.onChallengeComplete = this.onChallengeComplete.bind(this);
        this.reload = this.reload.bind(this);
        this.getNextChallenge = this.getNextChallenge.bind(this);
    }

    componentDidMount(){
        //TODO: get all current challenges
        this.getNextChallenge(() => {});
    }

    getNextChallenge(callback){
        $.get('/dash/getNextChallenge', {
            userId: this.state.userId
        })
            .done((data) => {
                if(!data){
                    callback();
                    this.setState({
                        challenge: {
                            category: {name: null}
                        },
                        showTwitterShare: false
                    });
                    return;
                }
                let baseUrl = `http://${document.domain}/profiles/${this.state.userId}/challenges/${data.id}`;

                $.ajax({
                    method:'POST',
                    url: constants.api.SHORTEN_URL,
                    data: JSON.stringify({longUrl: baseUrl}),
                    contentType: 'application/json'
                })
                    .done((url) => {
                        this.setState({
                            challenge: data,
                            shareUrl: url.id,
                            showTwitterShare: false
                        });
                    })
                    .fail(() => {
                        this.setState({
                            challenge: data,
                            shareUrl: baseUrl,
                            showTwitterShare: false
                        });
                    });

            })
            .fail(() => {
                this.props.showNotification(constants.error.GENERIC, constants.notifications.DANGER);
            });
    }

    onChallengeComplete(data){
        this.setState({
            challenge: data,
            showTwitterShare: true
        });
    }

    reload(){
        this.getNextChallenge(() =>  {
            this.props.showNotification(constants.error.NO_CHALLENGES, constants.notifications.INFO);
        });
    }

    render(){

        //TODO: more than one current challenge
        return(
            <div>
                <div className="col-md-12" >
                    <Challenge showLinkCurrentChallenge={true}
                               onChallengeComplete={this.onChallengeComplete}
                               shareUrl={this.state.shareUrl}
                               reload={this.reload}
                               showTwitterShare={this.state.showTwitterShare}
                               challenge={this.state.challenge}/>
                </div>
            </div>
        );
    }

}