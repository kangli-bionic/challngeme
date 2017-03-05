import React from 'react';
import {Link} from 'react-router';
import {CompleteChallengeForm} from './CompleteChallengeForm';
import {constants} from '../../common/constants';
import {Glyphicon} from '../../common/components/Glyphicon';

export const Challenge = (props) => {

    let challengeImage = null;
    let challengeAccepted = null;
    let backLoading = null;
    let image = props.challenge.completed ? constants.images.CHALLENGE_COMPLETED : constants.images.CHALLENGE_ACCEPTED;
    let showCompleteChallengeForm = props.challenge.completed == null || 0 ? true : false;
    let bonus = props.challenge.bonus ? <Glyphicon centerBlock='' icon="ok"/> : <Glyphicon centerBlock='' icon="remove"/>;

    const showChallengeImage = (image) => {
        let $challengeImage = $(challengeImage);
        if(image){
            $challengeImage.find('img').attr('src', image);
            $challengeImage.css({display: 'block'});
        }else{
            $challengeImage.css({display: 'none'});
        }
    }

    const showCompleteChallengeAnimation = (challenge) => {
        let $challengeAccepted = $(challengeAccepted);
        $challengeAccepted.attr('src', constants.images.CHALLENGE_COMPLETED);
        $challengeAccepted.animateCss('flip');
        removeBackLoading();
        props.onChallengeComplete(challenge);

    }

    const onSeeCurrentChallenge = () => {
        props.showLoadingChallenge();
        if(challengeImage){
            $(challengeImage).find('img').attr('src', constants.images.EMPTY_IMG_SRC);
        }
        props.reload();
    }

    const onShared = () => {
        props.shareChallenge(props.challenge);
    }

    const showBackLoading = () => {
        $(backLoading).css('display', 'block');
    }

    const removeBackLoading = () => {
        $(backLoading).css('display', 'none');
    }

    //TODO: if challenge was complete by friend show it on corresponding section
    return (
        <div className="box box-widget widget-user-2 ">
            <div className="backloading" ref={(div) => {backLoading = div}} style={{display:'none'}}>
                <div className="center-block">
                    <img src={constants.images.LOADING} alt="Uploading..."/>
                </div>
            </div>
            {!props.loading ?
                <div>
                    {props.challenge.category.name ?
                        <div>
                            {props.hideCategory ?
                                ''
                                : <div className="widget-user-header bg-aqua">
                                <h3 className="widget-user-username">{props.challenge.category.name}</h3>
                                <h4 className="widget-user-desc">{props.challenge.category.description}</h4>
                            </div>
                            }
                            <div className="box-footer">
                                <div className="row">
                                    <div className="col-md-12 border-right">

                                            {props.hideCategory?
                                                ''
                                                :
                                                <div className="col-md-3 col-xs-3 col-lg-2">
                                                    <img ref={(image) => {
                                                        challengeAccepted = image;
                                                    }}
                                                         className="challenge-accepted pull-right"
                                                         src={image}/>
                                                </div>
                                            }

                                        <div className="col-md-9 col-xs-9 col-lg-10">
                                            {!props.challengeOnBottom ?
                                                <div>
                                                    <h4>{props.challenge.description}</h4>
                                                    <h4>
                                                        Points: {props.challenge.points} {props.challenge.bonus ? '(x 2)' : ''}</h4>
                                                    <h4>Bonus: {bonus}</h4>
                                                </div> : ''
                                            }
                                            <div>
                                                { props.showTwitterShare ?
                                                    <span>
                                                        <a href={`https://twitter.com/share?text=Challenge completed, check it out!&url=${props.shareUrl}&hashtags=challngeme`}
                                                           className="fa fa-twitter btn bg-aqua share btn-lg" target="_blank"
                                                           data-show-count="false" onClick={onShared}> Tweet</a>
                                                    </span> : ''}
                                            </div>
                                            <div>
                                                { (props.showLinkCurrentChallenge && !showCompleteChallengeForm) ?
                                                    <button type="button" className="btn bg-yellow" style={{marginBottom:'15px'}}
                                                            onClick={onSeeCurrentChallenge}>See next challenge now</button>
                                                    : '' }
                                            </div>
                                        </div>
                                        {showCompleteChallengeForm ?
                                            <CompleteChallengeForm
                                                showNotification={props.showNotification}
                                                onError={props.onError}
                                                showBackLoading={showBackLoading}
                                                removeBackLoading={removeBackLoading}
                                                onLoadedChallengeImage={showChallengeImage}
                                                challenge={props.challenge}
                                                onChallengeCompleted={showCompleteChallengeAnimation}/>
                                            : ''
                                        }
                                        <div className="challenge-image-container" ref={(image) => {
                                            challengeImage = image;
                                        }} >
                                            {props.useDivBackground ?
                                                <div className="img-rounded challenge-image img-responsive"
                                                     style={{backgroundImage: `url(${props.challenge.image ? `./uploads/${props.challenge.image}` : constants.images.EMPTY_IMG_SRC}`}}>
                                                </div>
                                                :
                                                <img className="img-rounded challenge-image img-responsive"
                                                     src={ props.challenge.image ? `/uploads/${props.challenge.image}` : constants.images.EMPTY_IMG_SRC}/>
                                            }
                                        </div>
                                        {props.challengeOnBottom ?
                                            <div>
                                                <h4>{props.challenge.description}</h4>
                                                <h4>
                                                    Points: {props.challenge.points} {props.challenge.bonus ? '(x 2)' : ''}</h4>
                                                <h4>Bonus: {bonus}</h4>
                                            </div> : ''
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <div className="widget-user-header bg-navy center-block">
                            <h3>It seems we don't have new challenges available for <span> you </span>
                            <button type="button" className="btn bg-yellow "
                                    onClick={onSeeCurrentChallenge}>Check now
                            </button>
                             <span> or </span>
                            <Link to="/categories" className="btn bg-yellow">
                                Pick a new category
                            </Link>
                            </h3>
                        </div>
                }
                </div>
                :
                <div className="col-md-12">
                    <blockquote>
                        <p>Loading challenge...</p>
                        <div className="progress">
                            <div className="progress-bar progress-bar-primary progress-bar-striped"
                                 role="progressbar" aria-valuenow="100" aria-valuemin="100" aria-valuemax="100" style={{width: '100%'}}></div>
                        </div>
                    </blockquote>
                </div>
            }

        </div>
    );
}