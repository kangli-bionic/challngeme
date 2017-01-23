import React from 'react';
import cookie from 'react-cookie';
import {constants} from '../../common/constants';

export class UserForm extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            email: ''
        }

        this.onInputChange = this.onInputChange.bind(this);
        this.onStart = this.onStart.bind(this);
    }

    onStart(event){
        event.preventDefault();
        $.post('/signUp', {email: this.state.email})
            .done((data) => {
                cookie.save(constants.cookies.USER, data.email, { path: '/' });
                cookie.save(constants.cookies.NEW_USER, data.newUser, { path: '/' });
                cookie.save(constants.cookies.USER_ID, data.id, { path: '/' });
                window.location = data.redirect;
            })
            .fail((err)=>{
                this.props.onError(err.responseText);
            });
    }

    onInputChange(event){
        this.setState({
            email: event.target.value.trim()
        });
    }

    render(){

        return (
            <form id="sign-up" onSubmit={this.onStart} method="POST">
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <input onChange={this.onInputChange} value={this.state.email}
                                   type="email" className="form-control" placeholder="example@example.com" id="email"  />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-xl">Start</button>
                </div>
            </form>
        );
    }
}