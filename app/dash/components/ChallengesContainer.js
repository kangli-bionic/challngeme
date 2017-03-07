import React from 'react';
import {Challenge} from './Challenge';
import {constants} from '../../common/constants';
import cookie from 'react-cookie';
import { Link } from 'react-router';
import InfiniteScroll from 'react-infinite-scroll-component';

export class ChallengesContainer extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            userId: cookie.load(constants.cookies.USER_ID),
            challenges: [],
            limit: 5,
            hasMore: true
        }

        this.loadChallenges = this.loadChallenges.bind(this);
    }

    componentDidMount(){
        this.loadChallenges();
    }

    loadChallenges(){
        $.get('/dash/getChallenges', {
            userId: this.state.userId,
            limit: this.state.limit})
            .done((data) => {
                this.setState((prevState) => {
                    return {
                        hasMore: data.length != prevState.challenges.length,
                        challenges: data,
                        limit: prevState.limit + 5
                    }
                });
            })
            .fail(() => {
                this.props.showNotification(constants.error.CATEGORY, constants.notifications.DANGER);
            });
    }

    render(){
        let challenges = this.state.challenges.map((challenge) =>{
            return (
                <div className="col-md-4 col-xs-12 challenge many" key={challenge.id}>
                    <Link to={`/challenges/${challenge.id}`} >
                        <Challenge hideCategory challenge={challenge}
                                   onError={this.props.onError}
                                   challengeOnBottom={true}
                                   useDivBackground={true}></Challenge>
                    </Link>
                </div>
            );
        });

        return (
            <div>
                <div style={{overflow:'auto'}}>
                    <div className="col-md-3 col-xs-3 col-lg-2 many">
                        <img className="challenge-accepted pull-right"
                             src={constants.images.CHALLENGE_COMPLETED}/>
                    </div>
                    <div className="col-md-9 col-xs-9 col-lg-10 many">
                        <h1>Completed Challenges</h1>
                    </div>
                </div>
                <div style={{clear:'both'}}></div>
                <InfiniteScroll
                    next={this.loadChallenges}
                    hasMore={this.state.hasMore}
                    endMessage={<span style={{textAlign: 'center', clear: 'both'}}>END.</span>}
                    loader={<div className="loader" style={{textAlign: 'center', clear: 'both'}}>Loading ...</div>}>
                    {challenges}
                    <div style={{clear:'both'}}></div>
                </InfiniteScroll>

            </div>
        )
    }

}

   