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

        reader.onload = function(event) {
            completeChallengeForm.props.onLoadedChallengeImage(event.target.result);
            $completeChallenge.removeAttr('disabled');
        };
        try{
            reader.readAsDataURL(selectedFile);
        }catch(ex){
            completeChallengeForm.props.onLoadedChallengeImage();
            $completeChallenge.attr('disabled','disabled');
        }
    }

    onChallengeCompleted(event){
        event.preventDefault();
        let formData = new FormData();
        formData.append('file', this.state.file);
        formData.append('userId', this.state.userId);
        formData.append('currentChallengeId', this.props.challengeId);

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
                this.props.onChallengeCompleted();
            })
            .fail((err) => {
                $completeChallenge.removeAttr('disabled','disabled');
                console.log(err);
            });
    }

    render(){
        return (
            <form onSubmit={this.onChallengeCompleted} action="POST" encType="multipart/form-data">
                <hr/>
                <input type="file" name="file" id="file" className="center-block hide"
                       accept="image/jpg,image/jpeg,image/png"
                       value={this.state.input} onChange={this.onInputChange}/>
                <label htmlFor="file" className="btn btn-flat bg-navy btn-lg">
                    <Glyphicon icon="open-file" centerBlock=""/>
                    Upload proof of a possible awesome memory
                </label>
                <hr/>
                <button ref={(button) => { this.completeChallenge = button; }} type="submit"
                        disabled="disabled" className="btn btn-lg btn-success" >Challnge Completed</button>
            </form>
        );
    }
}