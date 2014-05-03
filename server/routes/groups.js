'use strict';

var groups = require('../controllers/groups');

module.exports = function(app) {

    app.route('/groups')
        .get(groups.all)
        .post(groups.create);
    // app.route('/articles/:articleId')
    //     .get(articles.show)
    //     .put(authorization.requiresLogin, hasAuthorization, articles.update)
    //     .delete(authorization.requiresLogin, hasAuthorization, articles.destroy);

    // Finish with setting up the articleId param
    // app.param('articleId', articles.article);

};