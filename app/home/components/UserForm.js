import React from 'react';
import cookie from 'react-cookie';

export class UserForm extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            email: ''
        }

        this.onInputChange = this.onInputChange.bind(this);
        this.onStart = this.onStart.bind(this);
    }

    onStart(){
        $.post('/signUp', {email: this.state.email})
            .done((data) => {
                cookie.save('user', data.email, { path: '/' });
                cookie.save('newUser', data.newUser, { path: '/' });
                window.location = data.redirect;
            })
            .fail((err)=>{
                console.log(err);
            });
    }

    onInputChange(event){
        this.setState({
            email: event.target.value.trim()
        });
    }

    render(){
        return (
            <form id="sign-up" >
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <input onChange={this.onInputChange} value={this.state.email}
                                   type="email" className="form-control" placeholder="example@example.com" id="email"  />
                        </div>
                    </div>
                    <button type="button" onClick={this.onStart} className="btn btn-xl">Start</button>
                </div>
            </form>
        );
    }
}