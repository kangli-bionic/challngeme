import React from 'react';

export class ContactForm extends React.Component{

    constructor(props){
        super(props);
    }

    render(){
        return (
            <section id="contact">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 text-center">
                            <h2 className="section-heading">Contact Us</h2>
                            <h3 className="section-subheading text-muted">Any suggestions ? Send us a message!</h3>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <form id="contactForm" >
                                <div className="row">
                                    <div className="col-md-6 col-md-offset-3">
                                        <div className="form-group">
                                            <input type="email" className="form-control" placeholder="Your Email *" id="email" required />
                                        </div>
                                        <div className="form-group">
                                            <textarea className="form-control" placeholder="Your Message *" id="message" required ></textarea>
                                        </div>
                                        <div className="clearfix"></div>
                                        <div className="col-lg-12 text-center">
                                            <button type="submit" className="btn btn-xl">Send Message</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}