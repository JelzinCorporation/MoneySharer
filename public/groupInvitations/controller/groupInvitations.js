'use strict';

angular.module('mean.groupInvitations').controller('GroupInvitationController', ['$scope', '$stateParams', '$location', 'Global', 'Groups', 'GroupInvitations',
    function($scope, $stateParams, $location, Global, Groups, GroupInvitations) {
        $scope.global = Global;

        $scope.find = function() {
            GroupInvitations.query(function(invitations) {
                $scope.groupInvitations = invitations;
            });
        };

        $scope.join = function(inviteId) {
            GroupInvitations.join({
                inviteId: inviteId
            }, function(group) {
                $location.path('groups/' + group._id);
            });
        };

        $scope.discard = function(inviteId) {
            GroupInvitations.discard({
                inviteId: inviteId
            }, function(groupInvitation) {
                for (var i in $scope.groupInvitations) {
                    if ($scope.groupInvitations[i]._id === groupInvitation._id) {
                        $scope.groupInvitations.splice(i, 1);
                    }
                }
                $location.path('groups');
            });
        };

        $scope.remove = function(inviteId) {
            console.log(inviteId);
            // if (window.confirm('Do you really want to delete this group?')) {
            //     for (var i in $scope.groups) {
            //         if ($scope.groups[i]._id === groupId) {
            //             $scope.groups.splice(i, 1);
            //         }
            //     }

            //     Groups.get({
            //         groupId: groupId
            //     }, function(group) {
            //         group.$remove();
            //         $location.path('groups');
            //     });
            // }
        };
    }
]);
