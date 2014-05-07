'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    GroupInvitation = mongoose.model('GroupInvitation'),
    Group = mongoose.model('Group'),
    _ = require('lodash');

exports.groupInvitation = function(req, res, next, id) {
    GroupInvitation.load(id, function(err, groupInvitation) {
        if (err) return next(err);
        if (!groupInvitation) return next(new Error('Failed to load groupInvitation ' + id));
        req.groupInvitation = groupInvitation;
        next();
    });
};

exports.mine = function(req, res) {
    GroupInvitation
    .find({
        invitee: req.user
    })
    .populate('group', 'name members')
    .populate('inviters', 'username')
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

exports.join = function(req, res) {
    var invite = req.groupInvitation;

    Group
    .findOne({
        _id: invite.group
    }).exec(function(err, group) {
        if (err) {
            // err handling
            console.error(err);
        } else {
            if (group.members.indexOf(req.user._id) === -1) {
                group.members.push(req.user);
            }
            group.invitedUsers = _.without(group.invitedUsers, req.user.email);
            group.save(function() {});
            invite.remove(function() {});
            res.jsonp(group);
        }
    });
};

exports.discard = function(req, res) {
    var invite = req.groupInvitation;

    Group
    .findOne({
        _id: invite.group
    }).exec(function(err, group) {
        if (err) {
            // err handling
            console.error(err);
        } else {
            invite.remove(function(err) {
                if (err) {
                    return res.send('users/signup', {
                        errors: err.errors,
                        groupInvitation: invite
                    });
                } else {
                    group.invitedUsers = _.without(group.invitedUsers, req.user.email);
                    group.save(function() {});
                    res.jsonp(invite);
                }
            });
        }
    });


};
