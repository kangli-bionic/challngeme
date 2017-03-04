import React from 'react';
import {Link} from 'react-router';
import {constants} from '../../common/constants';
import {Glyphicon} from '../../common/components/Glyphicon';
import cookie from 'react-cookie';

export class Score extends React.Component {

    constructor(props){
        super(props);
        this.state ={
            score: '0',
            userId: cookie.load(constants.cookies.USER_ID)
        };
    }

    componentDidMount(){
        $.get('/dash/getUserScore', {userId: this.state.userId})
            .done((data) => {
                this.setState({
                    score: data.score
                });
            });
    }

    render(){
        return(
            <Link to="/challenges" className="btn"
                  data-toggle="tooltip" data-placement="bottom"
                  title="Click to see your completed challenges"><Glyphicon icon="stats"/> | Score&nbsp;
                  <span className="badge">{this.state.score}</span>
            </Link>

        );
    }
}