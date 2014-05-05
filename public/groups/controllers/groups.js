'use strict';

angular.module('mean.groups').controller('GroupController', ['$scope', '$stateParams', '$location', 'Global', 'Groups', 'GroupInvitations',
    function($scope, $stateParams, $location, Global, Groups, GroupInvitations) {
        $scope.global = Global;
        $scope.invitedUsers = [];

        $scope.create = function() {
            var group = new Groups({
                name: this.name,
                description: this.description,
                invitedUsers: this.invitedUsers
            });

            group.$save(function(response) {
                $location.path('groups/' + response._id);
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

        $scope.remove = function(groupId) {
            if (window.confirm('Do you really want to delete this group?')) {
                for (var i in $scope.groups) {
                    if ($scope.groups[i]._id === groupId) {
                        $scope.groups.splice(i, 1);
                    }
                }

                Groups.get({
                    groupId: groupId
                }, function(group) {
                    group.$remove();
                    $location.path('groups');
                });
            }
        };

        $scope.find = function() {
            Groups.query(function(groups) {
                $scope.groups = groups;
            });
            GroupInvitations.query(function(invitations) {
                $scope.groupInvitations = invitations;
            });
        };

        $scope.findOne = function() {
            Groups.get({
                groupId: $stateParams.groupId
            }, function(group) {
                $scope.group = group;
            });
        };

        $scope.addInvitation = function() {
            var newInvite = $scope.newInvitation;
            var invitedUsers = $scope.group ? $scope.group.invitedUsers : $scope.invitedUsers;

            if (invitedUsers.indexOf(newInvite) > -1) {
                return;
            }

            // do regex email filter magic here

            invitedUsers.push(newInvite);
            $scope.newInvitation = '';
        };
    }
]);
