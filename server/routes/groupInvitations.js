'use strict';

var groupInvitations = require('../controllers/groupInvitations');

module.exports = function(app) {

    app.route('/groupInvitations')
        .get(groupInvitations.mine);
    app.route('/groupInvitations/:inviteId/join')
        .get(groupInvitations.join);
    app.route('/groupInvitations/:inviteId/discard')
        .get(groupInvitations.discard);

    // Finish with setting up the inviteId param
    app.param('inviteId', groupInvitations.groupInvitation);

};