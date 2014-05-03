'use strict';

angular.module('mean.groups').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.state('Group', {
            url: '/group/auth',
            templateUrl: 'public/group/views/index.html'
        }).
        state('create group', {
        	url: '/groups/create',
        	templateUrl: 'public/groups/views/create.html'
        }).
        state('all groups', {
            url: '/groups',
            templateUrl: 'public/groups/views/list.html'
        });
    }
]);
