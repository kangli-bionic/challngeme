import React from 'react';
import {constants} from '../../common/constants';
import {Glyphicon} from '../../common/components/Glyphicon';
import cookie from 'react-cookie';

export class CompleteChallengeForm extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            userId: cookie.load(constants.cookies.USER_ID),
            input: '',
            file: ''
        }

        this.onInputChange = this.onInputChange.bind(this);
        this.onChallengeCompleted = this.onChallengeCompleted.bind(this);
    }

    onInputChange(event){
        let selectedFile = event.target.files[0];
        let reader = new FileReader();
        let $completeChallenge = $(this.completeChallenge);
        let completeChallengeForm = this;
        this.setState({
            input: event.target.value,
            file: selectedFile
        });
        this.props.showBackLoading();
        reader.onload = function(event) {
            completeChallengeForm.props.removeBackLoading();
            completeChallengeForm.props.onLoadedChallengeImage(event.target.result);
            $completeChallenge.removeAttr('disabled');
        };
        try{
            reader.readAsDataURL(selectedFile);
        }catch(ex){
            this.props.removeBackLoading();
            completeChallengeForm.props.onLoadedChallengeImage(constants.images.EMPTY_IMG_SRC);
            $completeChallenge.attr('disabled','disabled');
        }
    }

    onChallengeCompleted(event){
        event.preventDefault();
        this.props.showBackLoading();
        let formData = new FormData();
        formData.append('file', this.state.file);
        formData.append('userId', this.state.userId);
        formData.append('currentChallengeId', this.props.challenge.id);

        let $completeChallenge = $(this.completeChallenge);
        $completeChallenge.attr('disabled','disabled');

        $.ajax({
            url: '/dash/completeChallenge',
            type: 'POST',
            dataType: 'json',
            data: formData,
            processData: false,
            contentType: false
        })
            .done(() => {
                this.props.challenge.completed = 1;
                this.props.onChallengeCompleted(this.props.challenge);
            })
            .fail((err) => {
                this.props.removeBackLoading();
                $completeChallenge.removeAttr('disabled','disabled');
                this.props.showNotification(err.responseText, constants.notifications.DANGER);
            });
    }

    render(){
        return (
            <form onSubmit={this.onChallengeCompleted} action="POST" encType="multipart/form-data" className="text-center col-md-12">
                <input type="file" name="file" id="file" className="center-block hide"
                       accept="image/*"
                       value={this.state.input}
                       onChange={this.onInputChange}/>
                <label htmlFor="file" className="bg-navy btn-sm complete-challenge-input-label text-center">
                    <Glyphicon icon="open-file" centerBlock=""/>
                    <p>
                        Upload proof of a possible awesome memory
                    </p>
                </label>
                <hr/>
                <button ref={(button) => { this.completeChallenge = button; }} type="submit" style={{marginBottom:'15px'}}
                        disabled="disabled" className="btn btn-lg btn-success" >Challnge Completed</button>
            </form>
        );
    }
}