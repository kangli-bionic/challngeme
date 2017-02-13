import React from 'react';
import {Challenge} from './Challenge';
import {constants} from '../../common/constants';
import cookie from 'react-cookie';
import { Link } from 'react-router';
import {Score} from './Score';


export class ChallengesContainer extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            userId: cookie.load(constants.cookies.USER_ID),
            challenges: []
        }
    }

    componentDidMount(){
        $.get('/dash/getChallenges', {userId: this.state.userId})
            .done((data) => {
                this.setState({
                    challenges: data
                });
            })
            .fail((err) => {
                console.log(err);
            });
    }

    render(){
        let challenges = this.state.challenges.map((challenge) =>{
            return  (
                <div className="col-md-4 col-xs-6 challenge" key={challenge.id}>
                    <Link to={`/dash/challenge/${challenge.id}`}>
                        <Challenge hideCategory challenge={challenge}></Challenge>
                    </Link>
                </div>
            );
        });

        return (
            <div>
                <Score/>
                <div style={{clear:'both'}}></div>
                {challenges}
            </div>
        )
    }

}

   