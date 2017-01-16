import React from 'react';

export function FeatureContainer(props){
    return (
        <section id="how-to-play" className="bg-light-gray">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12 text-center">
                        <h2 className="section-heading">How to play</h2>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12">
                    <ul className="timeline">
                        {props.children}
                    </ul>
                </div>
            </div>
        </section>
    );
}

export function Feature(props){
    return (
        <li className={(props.inverted == "true") ? 'timeline-inverted' : '' }>
            <div className="timeline-image">
                <img className="img-circle img-responsive" src={props.image} alt=""/>
            </div>
            <div className="timeline-panel">
                <div className="timeline-heading">
                    <h4 className="subheading">{props.heading}</h4>
                </div>
                <div className="timeline-body">
                    <p className="text-muted">{props.description}</p>
                </div>
            </div>
        </li>
    );
}