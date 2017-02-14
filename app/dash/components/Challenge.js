import React from 'react';
import {CompleteChallengeForm} from './CompleteChallengeForm';
import {constants} from '../../common/constants';
import {Glyphicon} from '../../common/components/Glyphicon';

export const Challenge = (props) => {

    let challengeImage = null;
    let challengeAccepted = null;
    let formContainer = null;
    let image = props.challenge.completed ? constants.images.CHALLENGE_COMPLETED : constants.images.CHALLENGE_ACCEPTED;
    let showCompleteChallengeForm = props.challenge.completed ? 'hide' : 'show';
    let bonus = props.challenge.bonus ? <Glyphicon centerBlock='' icon="ok"/> : <Glyphicon centerBlock='' icon="remove"/>;

    const showChallengeImage = (image) => {
        let $challengeImage = $(challengeImage);
        if(image){
            challengeImage.src = image;
            $challengeImage.parent().css({display: 'initial'});
        }else{
            $challengeImage.parent().css({display: 'none'});
        }
    }

    const showCompleteChallengeAnimation = (challenge) => {
        let $challengeAccepted = $(challengeAccepted);
        $challengeAccepted.attr('src', constants.images.CHALLENGE_COMPLETED);
        $challengeAccepted.animateCss('flip');
        props.onChallengeComplete(challenge);
    }

    //TODO: if challenge was complete by friend show it on corresponding section
    return (
        <div className="box box-widget widget-user-2 ">
            {props.challenge.category.name ?
                <div>
                    {props.hideCategory ?
                            ''
                        : <div className="widget-user-header bg-aqua">
                            <div className="widget-user-image">
                                <img ref={(image) => {
                                    challengeAccepted = image;}}
                                     className="img-circle"
                                     src={image}/>
                            </div>
                            <h3 className="widget-user-username">{props.challenge.category.name}</h3>
                            <h4 className="widget-user-desc">{props.challenge.category.description}</h4>
                        </div>
                    }
                    <div className="box-footer">
                        <div className="row">
                            <div className="col-md-12 border-right">
                                <div className="description-block">
                                    <h4 className="description-header">{props.challenge.description}</h4>
                                    <h4 className="description-text">Points: {props.challenge.points} {props.challenge.bonus ? '(x 2)' : ''}</h4>
                                    <h4 className="description-text">Bonus: {bonus}</h4>
                                    <div className={showCompleteChallengeForm} >
                                        <CompleteChallengeForm
                                            onLoadedChallengeImage={showChallengeImage}
                                            challenge={props.challenge}
                                            onChallengeCompleted={showCompleteChallengeAnimation}/>
                                    </div>
                                </div>
                                <div className="col-md-12" >
                                    <img ref={(image) => { challengeImage = image; }} className="img-rounded center-block challenge-image"
                                         src={ props.challenge.image ? `/uploads/${props.challenge.image}` : null} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <div className="widget-user-header bg-navy">
                    <h3>It seems we don't have new challenges available for you, for now.</h3>
                </div>
            }
        </div>
    );
}