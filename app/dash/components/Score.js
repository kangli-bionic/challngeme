import React from 'react';
import {constants} from '../../common/constants';
import cookie from 'react-cookie';

export class Score extends React.Component {

    constructor(props){
        super(props);
        this.state ={
            score: 0,
            userId: cookie.load(constants.cookies.USER_ID)
        };
    }

    componentDidMount(){
        $.get('/dash/getUserScore', {userId: this.state.userId})
            .done((data) => {
                this.setState({
                    score: data.score
                });
            })
            .fail((err) => {
                console.log(err);
            });
    }

    render(){
        return(
            <div className="col-md-6">
                <div className="info-box bg-green">
                    <span className="info-box-icon"><i className="fa fa-thumbs-o-up"></i></span>
                    <div className="info-box-content">
                        <span className="info-box-text">Score</span>
                        <div className="progress">
                            <div className="progress-bar" style={{width: '100%'}}></div>
                        </div>
                        <span style={{fontWeight: 'bold', fontSize: '36px'}}>{this.state.score}</span>
                    </div>
                </div>
            </div>
        );
    }
}