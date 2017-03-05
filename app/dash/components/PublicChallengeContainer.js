import React from 'react';
import {Link} from 'react-router';
import {Challenge} from './Challenge';

export class PublicChallengeContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            challenge: {
                category: {
                    name: '',
                    description: ''
                }
            },
            loading: true
        }

    }

    componentDidMount() {
       $.get('/dash/getPublicChallenge', {
           userId: this.props.params.userId,
           challengeId: this.props.params.challengeId
       })
           .done((data) => {
                this.setState({
                    challenge: data,
                    loading: false
                });
           })
           .fail(() => {
               this.setState({
                   challenge: null,
                   loading: false
               });
           });
    }

    render(){
        return(
            <div className="content-wrapper public-challenge">
                <div className="col-md-12" >
                    <h1 className="title bg-yellow">
                        <Link to="/">Challnge me!</Link>
                    </h1>
                    {this.state.challenge ?
                        <Challenge loading={this.state.loading}
                                   challenge={this.state.challenge}/>
                        :
                        <h4 className="title callout callout-info">
                            The user didn't share or complete this challenge.
                        </h4>
                    }

                </div>
            </div>
        );

    }
}
