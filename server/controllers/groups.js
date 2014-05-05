'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Group = mongoose.model('Group'),
    User = mongoose.model('User'),
    GroupInvitation = mongoose.model('GroupInvitation'),
    _ = require('lodash');

var createInvitations = function(group, currentUser, inviteMails) {
    _.each(inviteMails, function (mail) {
        User.findOne({'email': mail}, function (err, user) {
            if (err) {
                // Error while updating the group
                console.error('Error while loading a user in update group.');
            } else if (!user) {
                // user with mail address does not exists
                console.log('Unable to find user with mail addess (%s) in system', mail);
            } else { // found the user
                GroupInvitation.findOne({group: group, invitee: user}, function (err, invite) {
                    if (err) {
                        console.error(err);
                    } else if (invite) { // group invitation already exists; add user as inviter
                        invite.inviters = _.union(invite.inviters, [currentUser]);
                    } else { // create new group invitation
                        invite = new GroupInvitation({});
                        invite.group = group;
                        invite.inviters = [currentUser];
                        invite.invitee = user;
                    }
                    invite.save(function () {});
                });
            }
        });
    });
};

exports.group = function(req, res, next, id) {
    Group.load(id, function(err, group) {
        if (err) return next(err);
        if (!group) return next(new Error('Failed to load group ' + id));
        req.group = group;
        next();
    });
};

exports.create = function(req, res) {
    var group = new Group(req.body);
    group.admin = req.user;
    group.members = [req.user];

    group.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                group: group
            });
        } else {
            createInvitations(group, req.user, group.invitedUsers);
            res.jsonp(group);
        }
    });
};

exports.show = function(req, res) {
    res.jsonp(req.group);
};

exports.update = function(req, res) {

    var newInviteMails = _.difference(
        req.body.invitedUsers,
        req.group.invitedUsers
    );

    var group = req.group;
    group = _.extend(group, req.body);

    group.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                group: group
            });
        } else {
            createInvitations(group, req.uses, newInviteMails);
            res.jsonp(group);
        }
    });
};

exports.destroy = function(req, res) {
    var group = req.group;

    group.remove(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                group: group
            });
        } else {
            res.jsonp(group);
        }
    });
};

exports.all = function(req, res) {
    Group.find().sort('-created').populate('user', 'name username').exec(function(err, groups) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(groups);
        }
    });
};

exports.mine = function(req, res) {
    Group
    .find({
        $or: [
            {admin: req.user},
            {members: req.user}
        ]
    })
    .sort('-created')
    .exec(function(err, groups) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(groups);
        }
    });
};
