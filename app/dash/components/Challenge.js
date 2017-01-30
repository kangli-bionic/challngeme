import React from 'react';
import {constants} from '../../common/constants';
import cookie from 'react-cookie';

export class Challenge extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            userId: cookie.load(constants.cookies.USER_ID),
            challenge: {
                category: {
                    name: '',
                    description: ''
                }
            },
            input: '',
            file: ''
        }

        this.onInputChange = this.onInputChange.bind(this);
        this.onChallengeCompleted = this.onChallengeCompleted.bind(this);
    }

    componentDidMount(){
        $.get('/dash/getNextChallenge', {userId: this.state.userId})
            .done((data) => {
                this.setState({
                    challenge: data
                });
            })
            .fail((err) => {
               console.log(err);
            })
    }

    onInputChange(event){
        let selectedFile = event.target.files[0];
        let reader = new FileReader();
        let challengeImage = this.refs.challengeImage;
        this.setState({
            input: event.target.value,
            file: selectedFile
        });

        reader.onload = function(event) {
            challengeImage.src = event.target.result;
        };

        reader.readAsDataURL(selectedFile);
    }

    onChallengeCompleted(event){
        event.preventDefault();
        let formData = new FormData();
        formData.append('file', this.state.file);
        formData.append('userId', this.state.userId);
        $.ajax({
            url: '/dash/completeChallenge',
            type: 'POST',
            dataType: 'json',
            data: formData,
            processData: false,
            contentType: false
        })
            .done((data) => {
                console.log(data);
            })
            .fail((err) => {
                console.log(err);
            });
    }

    render(){
        return (
            <div className="col-md-12">
                <div className="box box-widget widget-user-2 ">
                    <div className="widget-user-header bg-aqua">
                        <div className="widget-user-image">
                            <img className="img-circle" src="img/challenge-accepted.jpg" alt="Challenge Accepted"/>
                        </div>
                        <h3 className="widget-user-username">{this.state.challenge.category.name}</h3>
                        <h4 className="widget-user-desc">{this.state.challenge.category.description}</h4>
                    </div>
                    <form onSubmit={this.onChallengeCompleted} action="POST" encType="multipart/form-data">
                        <div className="box-footer">
                            <div className="row">
                                <div className="col-md-12 border-right">
                                    <div className="description-block">
                                        <h4 className="description-header">{this.state.challenge.description}</h4>
                                        <h4 className="description-text">Points: {this.state.challenge.points}</h4>
                                        <hr/>
                                        <input type="file" name="file" className="center-block" value={this.state.input} onChange={this.onInputChange}/>
                                        <hr/>
                                        <button type="submit" className="btn btn-lg btn-success" >Challnge Completed</button>
                                    </div>
                                    <div className="col-md-6 col-md-offset-3">
                                        <img ref="challengeImage" className="img-rounded center-block challenge-image"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}