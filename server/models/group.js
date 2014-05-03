'use strict';

var MINIMUM_NAME_LENGTH = 3;

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Group Schema
 */
var GroupSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        default: '',
        trim: true
    },
    admin: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    members: [{
        type: Schema.ObjectId,
        ref: 'User'
    }],
    description: {
        type: String,
        default: '',
        trim: true
    }
});

/**
 * Validations
 */
GroupSchema.path('name').validate(function(name) {
    return name.length > MINIMUM_NAME_LENGTH;
}, 'Group name cannot be so short');

/**
 * Statics
 */
GroupSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};

mongoose.model('Group', GroupSchema);
