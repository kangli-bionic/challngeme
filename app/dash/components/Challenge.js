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
        //TODO: get challenge by id on query param
        $.get('/dash/getNextChallenge', {userId: this.state.userId})
            .done((data) => {
                console.log(data);
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
        let $completeChallenge = $(this.refs.completeChallenge);

        this.setState({
            input: event.target.value,
            file: selectedFile
        });

        reader.onload = function(event) {
            challengeImage.src = event.target.result;
            $completeChallenge.removeAttr('disabled');
        };
        try{
            reader.readAsDataURL(selectedFile);
        }catch(ex){
            $completeChallenge.attr('disabled','disabled');
        }
    }

    onChallengeCompleted(event){
        event.preventDefault();
        let formData = new FormData();
        formData.append('file', this.state.file);
        formData.append('userId', this.state.userId);
        formData.append('currentChallengeId', this.state.challenge.id);

        let $completeChallenge = $(this.refs.completeChallenge);
        $completeChallenge.attr('disabled','disabled');

        $.ajax({
            url: '/dash/completeChallenge',
            type: 'POST',
            dataType: 'json',
            data: formData,
            processData: false,
            contentType: false
        })
            .done((data) => {
                let $challengeAccepted = $(this.refs.challengeAccepted);
                $challengeAccepted.attr('src', 'http://i3.kym-cdn.com/entries/icons/original/000/001/987/fyeah.jpg');
                $challengeAccepted.animateCss('flip');
                console.log(data);
                this.setState({
                    challenge: data
                });
            })
            .fail((err) => {
                $completeChallenge.removeAttr('disabled','disabled');
                console.log(err);
            });
    }

    render(){
        let showChallengeImage = this.state.input ? 'show' : 'hide';
        let showCompleteChallengeForm = this.state.challenge.completed ? 'hide' : 'show';
        let bonus = this.state.challenge.bonus ? <span className="glyphicon glyphicon-ok" aria-hidden="true"></span> :
            <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>;
        return (
            <div className="col-md-12">
                <div className="box box-widget widget-user-2 ">
                    <div className="widget-user-header bg-aqua">
                        <div className="widget-user-image">
                            <img ref="challengeAccepted" className="img-circle" src="../img/challenge-accepted.jpg" alt="Challenge Accepted"/>
                        </div>
                        <h3 className="widget-user-username">{this.state.challenge.category.name}</h3>
                        <h4 className="widget-user-desc">{this.state.challenge.category.description}</h4>
                    </div>
                        <div className="box-footer">
                            <div className="row">
                                <div className="col-md-12 border-right">
                                    <div className="description-block">
                                        <h4 className="description-header">{this.state.challenge.description}</h4>
                                        <h4 className="description-text">Points: {this.state.challenge.points} {this.state.challenge.bonus ? '(x2)' : ''}</h4>
                                        <h4 className="description-text">Bonus: {bonus}</h4>
                                        <div className={showCompleteChallengeForm}>
                                            <form onSubmit={this.onChallengeCompleted} action="POST" encType="multipart/form-data">
                                                <hr/>
                                                <input type="file" name="file" className="center-block" value={this.state.input} onChange={this.onInputChange}/>
                                                <hr/>
                                                <button type="submit" disabled="disabled" ref="completeChallenge" className="btn btn-lg btn-success" >Challnge Completed</button>
                                            </form>
                                        </div>
                                    </div>
                                    <div className={'col-md-6 col-md-offset-3 ' + showChallengeImage} >
                                        <img ref="challengeImage" className="img-rounded center-block challenge-image"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
        );
    }
}