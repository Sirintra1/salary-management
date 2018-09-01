'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Masterlist Schema
 */
var MasterlistSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill Masterlist name',
        trim: true
    },
    prices: {
        type: Number,
        required: 'Please fill Month prices',
        trim: true
    },
    types: {
        type: String,
        enum: ['Outcome', 'Income']
    },
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Masterlist', MasterlistSchema);