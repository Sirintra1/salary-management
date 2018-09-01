'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Account Schema
 */
var AccountSchema = new Schema({
    // name: {
    //     type: String,
    //     default: '',
    //     required: 'Please fill Account name',
    //     trim: true
    // },
    lists: [{
        master: {
            type: Schema.ObjectId,
            ref: 'Masterlist'
        }
    }],
    total: Number,
    amount: Number,
    comment: [{
        other: String,
        price: Number,
        types: {
            type: String,
            enum: ['Outcome', 'Income']
        }
    }],
    created: {
        type: Date,
        default: Date.now
    },
    month: {
        name: {
            type: String
        },
        days: {
            type: Number
        },
        no: {
            type: Number
        },
        items: [{
            lists: [{
                name: String,
                prices: {
                    type: Number,
                    default: 0,
                },
                types: {
                    type: String,
                    default: 'Outcome',
                },
            }],
            day: Number,
            nameday: String,
            indexday: Number,
            total: Number
        }]

    },
    year: Number,
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Account', AccountSchema);