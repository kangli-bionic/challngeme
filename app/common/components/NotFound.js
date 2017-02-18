import React from 'react';
import {Link} from 'react-router';

export function NotFound(){
    return (
        <section className="content">
            <div className="error-page">
                <h2 className="headline text-yellow"> 404</h2>

                <div className="error-content">
                    <h3><i className="fa fa-warning text-yellow"></i>
                        Oops! Page not found.

                    </h3>
                    <h4 style={{textAlign: 'center'}}>
                        <Link to="/">Go to the Home Page.</Link>
                    </h4>
                </div>
            </div>
        </section>
    );
}