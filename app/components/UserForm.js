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
                            <input type="email" className="form-control" placeholder="example@example.com" id="email"  />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-xl">Start</button>
                </div>
            </form>
        );
    }
}