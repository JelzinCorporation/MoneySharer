'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Group = mongoose.model('Group'),
    _ = require('lodash');

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
            res.jsonp(group);
        }
    });
};

exports.show = function(req, res) {
    res.jsonp(req.group);
};

exports.update = function(req, res) {
    var group = req.group;

    group = _.extend(group, req.body);

    group.save(function(err) {
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