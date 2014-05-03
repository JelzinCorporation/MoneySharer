'use strict';

angular.module('mean.groups').controller('GroupController', ['$scope', '$stateParams', '$location', 'Global', 'Groups',
    function($scope, $stateParams, $location, Global, Groups) {
        $scope.global = Global;

        $scope.create = function() {
            var group = new Groups({
                name: this.name,
                description: this.description
            });

            group.$save(function(response) {
                $location.path('group/' + response._id);
            });

            this.name = '';
            this.description = '';
        };

        $scope.update = function() {
            var group = $scope.group;
            if (!group.updated) {
                group.updated = [];
            }
            group.updated.push(new Date().getTime());

            group.$update(function() {
                $location.path('groups/' + group._id);
            });
        };

        $scope.find = function() {
            Groups.query(function(groups) {
                $scope.groups = groups;
            });
        };

        $scope.findOne = function() {
            Groups.get({
                groupId: $stateParams.groupId
            }, function(group) {
                $scope.group = group;
            });
        };
    }
]);
