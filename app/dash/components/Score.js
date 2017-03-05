import React from 'react';
import {Link} from 'react-router';
import {Glyphicon} from '../../common/components/Glyphicon';


export const Score = (props) => {
    return (
        <Link to="/challenges" className="btn"
              data-toggle="tooltip" data-placement="bottom"
              title="Click to see your completed challenges"><Glyphicon icon="stats"/> | Score&nbsp;
            <span className="badge">{props.score}</span>
        </Link>
    )
}
