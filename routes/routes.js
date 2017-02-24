const controllers = require('../controllers/controllers');
const path = require('path');

const routes = (app) => {
    app.post('/claimAccount', controllers.claimAccount);
    app.get('/dash/getCategories', controllers.getCategories);
    app.get('/dash/getNextChallenge', controllers.getNextChallenge);
    app.post('/dash/completeChallenge', controllers.completeChallenge);
    app.post('/dash/saveCategory', controllers.saveCategory);
    app.get('/dash/getChallenges', controllers.getUserCompletedChallenges);
    app.get('/dash/getUserChallengeByChallengeId', controllers.getUserChallengeByChallengeId);
    app.get('/dash/getUserScore', controllers.getUserScore);
    app.get('/dash/getProfile', controllers.getProfile);
    app.post('/dash/saveProfile', controllers.saveProfile);
    app.get('/dash/getPublicChallenge', controllers.getPublicProfile);
    app.post('/dash/shareChallenge', controllers.shareChallenge);
    app.post('/dash/removePhoto', controllers.removePhoto);

    app.get('*', function (request, response){
        response.sendFile(path.resolve( './','app', 'index.html'));
    })

}

module.exports = routes;