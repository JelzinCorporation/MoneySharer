'use strict';

//Group invitations service used for articles REST endpoint
angular.module('mean.groupInvitations').factory('GroupInvitations', ['$resource', function($resource) {
    return $resource('groupInvitations/:inviteId', {
        inviteId: '@_id'
    }, {
        join: {
            method: 'GET',
            url: 'groupInvitations/:inviteId/join'
        },
        discard: {
            method: 'GET',
            url: 'groupInvitations/:inviteId/discard'
        }
    });
}]);