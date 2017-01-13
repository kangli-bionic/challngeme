import React from 'react';

export class UserForm extends React.Component{

    constructor(props){
        super(props);
    }

    render(){
        return (
            <form id="sign-up" >
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <input type="email" className="form-control" placeholder="Your Email *" id="email" required />
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control" placeholder="Your Password *" id="password" required />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-xl">Sign Up</button>
                    <span>  or  </span>
                    <button type="submit" className="btn btn-xl">Log In</button>
                </div>
            </form>
        );
    }
}