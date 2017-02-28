import React from 'react';
import cookie from 'react-cookie';
import {constants} from '../../common/constants';

export class UserForm extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            email: '',
            password:''
        }
        this.showPasswordField = false;
        this.onInputChange = this.onInputChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.onStart = this.onStart.bind(this);
    }

    onStart(event){
        event.preventDefault();
        $.post('/claimAccount', {email: this.state.email, pass: this.state.password})
            .done((data) => {
                $(this.formGroup).find('input').removeClass('input-error');
                cookie.save(constants.cookies.USER, data.user.name, { path: '/' });
                cookie.save(constants.cookies.NEW_USER, data.user.newUser, { path: '/' });
                cookie.save(constants.cookies.USER_ID, data.user.id, { path: '/' });
                cookie.save(constants.cookies.PHOTO, data.user.photo ? `/uploads/${data.user.photo}` : data.user.photo, { path: '/' });
                this.props.router.push(data.redirect);
            })
            .fail((err)=>{
                $(this.formGroup).find('input').addClass('input-error');
                this.props.onError(err.responseText);
            });
    }

    onInputChange(event){
        let email = event.target;
        let password = this.refs.password;
        this.setState(() => {
            let validity = email.checkValidity() && password && !this.showPasswordField;
            if(validity && email.value.trim()){
                $(password).animateCss('fadeInDown');
                this.showPasswordField = true;
            }
            return {
                email: email.value.trim()
            }
        });
    }

    onPasswordChange(event){
        this.setState({
            password: event.target.value
        });
    }

    render(){

        return (
            <form id="sign-up" onSubmit={this.onStart} method="POST">
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group" ref={(formGroup) => {this.formGroup = formGroup;}}>
                            <input onChange={this.onInputChange} value={this.state.email} maxLength="60"
                                   type="email" className="form-control" placeholder="hello@email.com" id="email"  />
                            <input ref="password" type="password" onChange={this.onPasswordChange} value={this.state.password}
                                   className="form-control" placeholder="password" maxLength="60"
                            style={ {display: !this.showPasswordField ? 'none' : 'initial'} }/>
                        </div>
                        <button type="submit" className="btn btn-xl start">Start</button>
                    </div>
                </div>
            </form>
        );
    }
}