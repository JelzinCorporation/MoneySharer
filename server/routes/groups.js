'use strict';

var groups = require('../controllers/groups');

module.exports = function(app) {

    app.route('/groups')
        .get(groups.mine)
        .post(groups.create);
    app.route('/groups/:groupId')
        .get(groups.show)
        .put(groups.update)
        .delete(groups.destroy);

    // Finish with setting up the groupId param
    app.param('groupId', groups.group);

};