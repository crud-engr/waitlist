const mongoose = require('mongoose');

let waitlistSchema = new mongoose.Schema(
    {
        full_name: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        type: {
            type: String,
            required: true,
            enum: {
                values: ['investors', 'asset listers'],
                message: 'Waitlist type is either investors or asset listers',
            },
        },
        asset_description: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

module.exports = new mongoose.model('Wailist', waitlistSchema);
