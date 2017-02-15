import React from 'react';
import {constants} from '../../common/constants';
import cookie from 'react-cookie';

export class ChallengeUserForm extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            userId: cookie.load(constants.cookies.USER_ID),
            user: ''
        }
        this.handleInput = this.handleInput.bind(this);
    }

    handleInput(event){
        this.setState({
            user: event.target.value
        })
    }

    render(){
        return(
            <form onSubmit={this.challengeUser}>
                <p>Enter the email of a friend and challenge him too!</p>
                <div className="input-group margin">
                    <input type="email" className="form-control"/>
                    <div className="input-group-btn">
                        <button type="submit" className="btn btn-default bg-navy">Go!</button>
                    </div>
                </div>
            </form>
        );
    }
}