'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * GroupInvitation Schema
 */
var GroupInvitationSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    group: {
        type: Schema.ObjectId,
        ref: 'Group'
    },
    inviters: [{
        type: Schema.ObjectId,
        ref: 'User'
    }],
    invitee: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

/**
 * Statics
 */
// GroupInvitationSchema.statics.load = function(id, cb) {
//     this.findOne({
//         _id: id
//     })
//     .exec(cb);
// };

mongoose.model('GroupInvitation', GroupInvitationSchema);