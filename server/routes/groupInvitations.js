'use strict';

var groupInvitations = require('../controllers/groupInvitations');

module.exports = function(app) {

    app.route('/groupInvitations')
        .get(groupInvitations.mine);

    // // Finish with setting up the groupId param
    // app.param('groupId', groups.group);

};