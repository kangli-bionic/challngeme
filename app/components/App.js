import React from 'react';
import ReactDOM from 'react-dom';

import {Navigation, Header} from './Navigation.js';
import {Feature, FeatureContainer} from './Feature.js';
import {Footer} from './Footer.js';


function App(props){
    return (
        <div>
            <Navigation/>
            <Header title={props.title} subtitle={props.subtitle}/>
            <FeatureContainer>
                <Feature
                    inverted="false"
                    heading="Pick what you want"
                    description="Select the categories you'd like to be challenged."
                    image="img/about/1.jpg"
                />
                <Feature
                    inverted="true"
                    heading="Daily challenge"
                    description="We will choose a new challenge for you every day. All of them for the categories you like."
                    image="img/about/2.jpg"
                />
                <Feature
                    inverted="false"
                    heading="Keep your score"
                    description="Earn points by completing daily challenges and lose points :'( by failing daily challenges. And take advantage of bonus points and special challenges."
                    image="img/about/3.jpg"
                />
                <Feature
                    inverted="true"
                    heading="Share"
                    description="Share your score and achievements with your friends. Don't let them miss a thing."
                    image="img/about/4.jpg"
                />

            </FeatureContainer>
            <hr/>
            <Footer copyright="Copyright &copy; Challnge me! 2017"/>
        </div>
    );
}

ReactDOM.render(
    <App title="Challnge me!" subtitle="You better be up for the challenge!"/>,
    document.getElementById('root')
);