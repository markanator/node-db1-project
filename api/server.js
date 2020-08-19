const express = require('express');

const db = require('../data/dbConfig.js');

const server = express();

server.use(express.json());

server.get('/', async (req, res, next) => {
    try {
        const limit = req.query.limit;
        const sortby = req.query.sortby || 'id';
        const sortdir = req.query.sortdir || 'asc';
        console.log(limit, sortby, sortdir);

        const accounts = await db('accounts')
            .orderBy(sortby, sortdir)
            .limit(limit);

        return res.status(200).json(accounts);
    } catch (err) {
        return next(err);
    }
});

server.get('/:id', async (req, res, next) => {
    try {
        const account = await db('accounts').where('id', req.params.id).first();

        return res.status(200).json(account);
    } catch (err) {
        return next(err);
    }
});

server.post('/', ValidateBody(), async (req, res, next) => {
    try {
        const acc = await db
            .insert({
                name: req.body.name,
                budget: req.body.budget,
            })
            .into('accounts');

        return res.status(201).json(acc);
    } catch (err) {
        return next(err);
    }
});

server.put('/:id', ValidateBody(), async (req, res, next) => {
    try {
        const acc = await db('accounts')
            .update({
                name: req.body.name,
                budget: req.body.budget,
            })
            .where('id', req.params.id);

        const account = await db('accounts').where('id', req.params.id);

        return res.status(200).json(account);
    } catch (err) {
        return next(err);
    }
});

server.delete('/:id', async (req, res, next) => {
    try {
        await db('accounts').where('id', req.params.id).del();

        return res.status(200).json({
            message: 'Deleted!',
        });
    } catch (err) {
        return next(err);
    }
});

function ValidateBody() {
    return (req, res, next) => {
        if (!req.body) {
            return res.status(400).json({
                msg: 'Please enter all fields',
            });
        } else if (!req.body.name || !req.body.budget) {
            return res.status(400).json({
                msg: 'Please enter unique Name and a starting budget',
            });
        } else {
            return next();
        }
    };
}

module.exports = server;
