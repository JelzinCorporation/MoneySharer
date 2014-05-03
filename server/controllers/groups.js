'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Group = mongoose.model('Group');
    // _ = require('lodash');


exports.create = function(req, res) {
    var group = new Group(req.body);
    group.user = req.user;

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

exports.all = function(req, res) {
    res.send('asdd');
};