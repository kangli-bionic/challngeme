import React from 'react';
import {Challenge} from './Challenge';
import {constants} from '../../common/constants';
import cookie from 'react-cookie';
import {AdminLTE} from '../../common/template';
import { Link } from 'react-router';
import {Score} from './Score';
import InfiniteScroll from 'react-infinite-scroll-component';


export class ChallengesContainer extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            userId: cookie.load(constants.cookies.USER_ID),
            challenges: [],
            limit: 10,
            hasMore: true
        }

        this.loadChallenges = this.loadChallenges.bind(this);
    }

    componentDidMount(){
        AdminLTE.activate();
        this.loadChallenges();
    }

    loadChallenges(){
        $.get('/dash/getChallenges', {
            userId: this.state.userId,
            limit: this.state.limit})
            .done((data) => {
                this.setState((prevState, props) => {
                    return {
                        hasMore: data.length != prevState.challenges.length,
                        challenges: data,
                        limit: prevState.limit + 10
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
                <div className="col-md-4 col-xs-12 challenge" key={challenge.id}>
                    <Link to={`/challenges/${challenge.id}`} >
                        <Challenge hideCategory challenge={challenge}
                                   onError={this.props.onError}
                                   useDivBackground={true}></Challenge>
                    </Link>
                </div>
            );
        });

        return (
            <div>
                <Score/>
                <div style={{clear:'both'}}></div>
                <InfiniteScroll
                    next={this.loadChallenges}
                    hasMore={this.state.hasMore}
                    endMessage={<span style={{textAlign: 'center', clear: 'both'}}>END.</span>}
                    loader={<div className="loader" style={{textAlign: 'center', clear: 'both'}}>Loading ...</div>}>
                    {challenges}
                </InfiniteScroll>

            </div>
        )
    }

}

   