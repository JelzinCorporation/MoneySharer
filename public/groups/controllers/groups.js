'use strict';

angular.module('mean.groups').controller('GroupController', ['$scope', '$location', 'Global', 'Groups',
    function($scope, $location, Global, Groups) {
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

        $scope.find = function() {
            console.log('foo');
            Groups.query(function(groups) {
                console.log(groups);
                $scope.groups = groups;
            });
        };
    }
]);
