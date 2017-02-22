import React from 'react';
import {constants} from '../../common/constants';
import {Glyphicon} from '../../common/components/Glyphicon';
import cookie from 'react-cookie';

export class Profile extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            userId: cookie.load(constants.cookies.USER_ID),
            file: '',
            photo: '',
            firstName: '',
            lastName: '',
            email: ''
        }

        this.onSubmit = this.onSubmit.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.onInputFileChange = this.onInputFileChange.bind(this);
        this.removePhoto = this.removePhoto.bind(this);
    }

    componentDidMount(){
        $.get('/dash/getProfile',{userId: this.state.userId})
            .done((data) => {
                let profile = {
                    firstName: data.name || '',
                    lastName: data.lastName || '',
                    email: data.email
                }

                if(data.photo){
                    profile.file = data.photo ? 'uploads/'+ data.photo : '';
                }
                this.setState(profile);
            })
            .fail(() => {
                this.props.showNotification(constants.error.GENERIC, constants.notifications.DANGER);
            });
    }

    onSubmit(event){
        event.preventDefault();
        let formData = new FormData();
        formData.append('photo', this.state.file);
        formData.append('userId', this.state.userId);
        formData.append('firstName', this.state.firstName);
        formData.append('lastName', this.state.lastName);

        $.ajax({
            url: '/dash/saveProfile',
            type: 'POST',
            dataType: 'json',
            data: formData,
            processData: false,
            contentType: false
        })
            .done((data) => {
                cookie.save(constants.cookies.USER, data.name && data.lastName ? `${data.name}  ${data.lastName}` : data.email, { path: '/' });
                cookie.save(constants.cookies.PHOTO, data.photo ? `/uploads/${data.photo}` : data.photo, { path: '/' });
                this.setState({
                    file: data.photo ? 'uploads/'+ data.photo : '',
                    firstName: data.name || '',
                    lastName: data.lastName || '',
                    email: data.email
                });
                this.props.showNotification(constants.message.PROFILE, constants.notifications.SUCCESS);
            })
            .fail(() => {
                this.props.showNotification(constants.error.GENERIC, constants.notifications.DANGER);
            });
    }

    onInputChange(event){
        this.setState({
           [event.target.name]: event.target.value
        });
    }

    onInputFileChange(event){
        let selectedFile = event.target.files[0];
        let reader = new FileReader();
        let profile = this;

        this.setState({
            photo: event.target.value,
            file: selectedFile
        });

        reader.onload = function(event) {
            profile.image.src = event.target.result;
        };

        try{
            reader.readAsDataURL(selectedFile);
        }catch(ex){

        }
    }

    removePhoto(){
        $.post('/dash/removePhoto', {
            userId: this.state.userId
        })
            .done((data) => {
                cookie.save(constants.cookies.PHOTO, null);
                this.props.showNotification(constants.message.PHOTO_REMOVED, constants.notifications.SUCCESS);
                this.setState({
                    file: data.photo
                });
            })
            .fail(() => {
                this.props.showNotification(constants.error.GENERIC, constants.notifications.DANGER);
            });
    }

    render(){
        return(
            <form role="form" method="POST" onSubmit={this.onSubmit}>
                <div className="box-body">
                    <div className="col-md-6">
                        <label htmlFor="photo">
                            {this.state.file ?
                                <div className="profile-photo">
                                    <img src={this.state.file} className="center-block img-responsive"
                                         style={{ cursor:'pointer'}}
                                         ref={(image) => {this.image = image}}/>
                                    <div>
                                        <button type="button" className="btn btn-danger btn-xs center-block"
                                                onClick={this.removePhoto}>Remove photo</button>
                                    </div>
                                </div>
                                :
                                <div>
                                    <div style={{fontSize: '100px', cursor:'pointer'}}>
                                        <Glyphicon centerBlock="center-block" icon="user"
                                                   title="Upload a photo"/>
                                    </div>
                                    <p>Upload a photo</p>
                                </div>
                            }

                        </label>

                    </div>
                    <div style={{clear:'both'}}></div>
                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" className="form-control col-md-6" id="firstName" name="firstName"
                               placeholder="Enter your first name"
                               onChange={this.onInputChange}
                               value={this.state.firstName}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input type="text" className="form-control col-md-6" id="lastName" name="lastName"
                               placeholder="Enter your last name"
                               onChange={this.onInputChange}
                               value={this.state.lastName}/>
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" disabled="disabled" className="form-control col-md-6" id="email"  name="email"
                               onChange={this.onInputChange}
                               value={this.state.email}/>
                    </div>
                    <input type="file" name="photo" id="photo" className="center-block hide"
                           accept="image/jpg,image/jpeg,image/png"
                           value={this.state.photo}
                           onChange={this.onInputFileChange}/>
                    <button type="submit" className="btn btn-success btn-lg">Save</button>
                </div>
            </form>
        );
    }
}