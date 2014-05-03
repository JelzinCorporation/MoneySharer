'use strict';

//Articles service used for articles REST endpoint
angular.module('mean.groups').factory('Groups', ['$resource', function($resource) {
    return $resource('groups/:groupId', {
        articleId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);