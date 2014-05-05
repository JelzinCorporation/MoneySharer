'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    GroupInvitation = mongoose.model('GroupInvitation');

// exports.groupInvitation = function(req, res, next, id) {
//     GroupInvitation.load(id, function(err, groupInvitation) {
//         if (err) return next(err);
//         if (!groupInvitation) return next(new Error('Failed to load groupInvitation ' + id));
//         req.groupInvitation = groupInvitation;
//         next();
//     });
// };

exports.create = function(req, res) {
    var groupInvitation = new GroupInvitation(req.body);
    groupInvitation.inviter = [req.user];

    groupInvitation.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                groupInvitation: groupInvitation
            });
        } else {
            res.jsonp(groupInvitation);
        }
    });
};

exports.destroy = function(req, res) {
    var groupInvitation = req.groupInvitation;

    groupInvitation.remove(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                groupInvitation: groupInvitation
            });
        } else {
            res.jsonp(groupInvitation);
        }
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

// exports.join = function(req, res) {
//     // join group
// };

// exports.discard = function(req, res) {
//     // disvard group invitation
// };
