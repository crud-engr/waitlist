const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Waitlist = require('./model/Waitlist');
require('dotenv').config();

let db_url = process.env.LOCAL_DB;

try {
    mongoose.connect(db_url);
    console.log('DB Connection successful');
} catch (err) {
    console.error(`Connection error: ${err.message}`);
}

const app = express();
app.use(express.json());
app.use(morgan('dev'));

app.post('/api/waitlist/signup', async (req, res, next) => {
    try {
        const { type, full_name, email, asset_description } = req.body;
    if (!full_name)
        return res.status(400).json({
            status: 'fail',
            message: 'Full name is required',
            code: 400,
        });
    if (!email)
        return res.status(400).json({
            status: 'fail',
            message: 'Email address is required',
            code: 400,
        });
    if (!type)
        return res.status(400).json({
            status: 'fail',
            message: 'Wailist type is required',
            code: 400,
        });
    if (type.toLowerCase() !== 'asset listers') {
        let emailExists = await Waitlist.findOne({ email }).exec();
        if (emailExists)
            return res.status(400).json({
                status: 'fail',
                message: `email already exists`,
                code: 400,
            });
        let user = await Waitlist.create({ type, full_name, email });
        return res.status(201).json({
            status: 'success',
            message: `${full_name} has successfully joined the waiting list`,
            data: { user },
            code: 201,
        });
    }
    if (type.toLowerCase() === 'asset listers') {
        let emailExists = await Waitlist.findOne({ email }).exec();
        if (emailExists)
            return res.status(400).json({
                status: 'fail',
                message: `email already exists`,
                code: 400,
            });
        if (!asset_description) {
            return res.status(400).json({
                status: 'fail',
                message: 'Asset description is required',
                code: 400,
            });
        }
        let user = await Waitlist.create({
            type,
            full_name,
            email,
            asset_description,
        });
        return res.status(201).json({
            status: 'success',
            message: `${full_name} has successfully joined the waiting list`,
            data: { user },
            code: 201,
        });
    }
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: err.message,
            code: 500,
        });
    }
});

const port = process.env.PORT || 3200;
app.listen(port, () => console.log(`App listening on port ${port}`));
